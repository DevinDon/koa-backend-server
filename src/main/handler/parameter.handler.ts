import { IncomingMessage, ServerResponse } from 'http';
import { MetadataKey } from '../@types';
import { ParamInjection, ParamInjectionType } from '../decorator';
import { HTTP400Exception, HTTP404Exception } from '../exception';
import { BaseHandler } from './base.handler';

export interface Part {
  buffer: Buffer;
  contentDisposition: string;
  contentDispositionName: string;
  contentDispositionFilename?: string;
  contentTransferEncoding?: string;
  contentType?: string;
  contentTypeCharset?: string;
  head: Buffer;
  data: Buffer;
}

export class BodyParser {

  private static keymap = {
    CR: 0x0d,
    LF: 0x0a,
    DASH: 0x2d
  };

  private static regmap = {
    key: /([^\s]*): ([^\s]*)/,
    contentDisposition: /Content-Disposition: ([^;]*)/,
    contentDispositionName: /[^e]name="(.+?)"/,
    contentDispositionFilename: /filename="(.+?)"/,
    contentType: /Content-Type: ([^;]*)/,
    contentTypeCharset: /charset=([^;]*)/,
    contentTransferEncoding: /Content-Transfer-Encoding: ([^;]*)/
  };

  private contentType!: string;
  private body!: Buffer;

  setContentType(contentType: string) {
    this.contentType = contentType;
    return this;
  }

  parse(body: Buffer) {
    this.body = body;
    const type = this.contentType.match(/[^;]*/)![0];
    const left = type.match(/(.*)\/(.*)/)![1];
    const right = type.match(/(.*)\/(.*)/)![2];
    switch (left) {
      case 'application':
        switch (right) {
          case 'json':
            return this.parseApplicationJSON();
          default:
            return this.parseApplication();
        }
      case 'multipart':
        switch (right) {
          case 'form-data':
            return this.parseMultipartFormData();
          default:
            return this.parseMultipart();
        }
      case 'text':
        switch (right) {
          case 'plain':
            return this.parseTextPlain();
          default:
            return this.parseText();
        }
      default:
        return this.parseDefault();
    }
  }

  parseApplicationJSON(buffer: Buffer = this.body): any {
    return JSON.parse(buffer.toString());
  }

  parseApplication(buffer: Buffer = this.body): Buffer {
    return buffer;
  }

  parseMultipartFormData(
    buffer: Buffer = this.body,
    boundary = Buffer.from(this.contentType.match(/boundary=(.*)/)![1])
  ) {
    const length = buffer.length;
    /** All parts of body. */
    const parts: Part[] = [];
    /** Part start. */
    let start = 0;
    /** Part end. */
    let end = 0;
    // get each part
    for (let i = 0; i < length; i++) {
      // if not new line, continue
      if (buffer[i] !== BodyParser.keymap.CR) { continue; }
      // if the new line is not boundary, continue
      if (!this.isBoundary(buffer, i + 2, boundary)) { continue; }
      // if it is new boundary line, do it
      // set start, start += double dash + boundary length + CRLF
      start += 2 + boundary.length + 2;
      // set end, end = current, not inculde current CR
      end = i;
      /** Part data. */
      const part: Part = {} as any;
      part.buffer = buffer.slice(start, end);
      // split head & data
      for (let j = 0; j < part.buffer.length; j++) {
        // if not new line, continue
        if (part.buffer[j] !== BodyParser.keymap.CR) { continue; }
        // if it is data line (double CRLF), set part.data & break
        if (this.isData(part.buffer, j)) {
          // set part.head, skip double CRLF
          // slice(a, b), the position b will not be included
          part.head = part.buffer.slice(0, j);
          // set part.data, skip double CRLF
          part.data = part.buffer.slice(j + 4);
          break;
        }
      }
      // parse head
      const head = part.head.toString();
      part.contentDisposition = head.match(BodyParser.regmap.contentDisposition)![1];
      const contentDispositionFilename = head.match(BodyParser.regmap.contentDispositionFilename);
      part.contentDispositionFilename = contentDispositionFilename && contentDispositionFilename[1] || undefined;
      part.contentDispositionName = head.match(BodyParser.regmap.contentDispositionName)![1];
      const contentTransferEncoding = head.match(BodyParser.regmap.contentTransferEncoding);
      part.contentTransferEncoding = contentTransferEncoding && contentTransferEncoding[1] || '';
      const contentType = head.match(BodyParser.regmap.contentType);
      part.contentType = contentType && contentType[1] || undefined;
      const contentTypeCharset = head.match(BodyParser.regmap.contentTypeCharset);
      part.contentTypeCharset = contentTypeCharset && contentTypeCharset[1] || undefined;
      parts.push(part);
      // start = end + CRLF
      start = end + 2;
      // pointer = end + CRLF + boundary.length
      i = end + 2 + boundary.length;
    }
    return parts;
  }

  parseMultipart(buffer: Buffer = this.body): Buffer {
    return buffer;
  }

  parseTextPlain(buffer: Buffer = this.body): string {
    return buffer.toString();
  }

  parseText(buffer: Buffer = this.body): string {
    return buffer.toString();
  }

  parseDefault(buffer: Buffer = this.body): Buffer {
    return buffer;
  }

  /**
   * It is boundary line or not.
   *
   * First char should not `\n`.
   *
   * @param buffer Source buffer.
   * @param start Where to start.
   */
  isBoundary(buffer: Buffer, start: number, boundary: Buffer): boolean {

    return buffer[start] === BodyParser.keymap.DASH
      && buffer.length > start + 2 + boundary.length
      && buffer[start + 1] === BodyParser.keymap.DASH
      && boundary.equals(buffer.slice(start + 2, start + 2 + boundary.length));

  }

  /**
   * It is data start or not.
   *
   * The first double CRLF.
   *
   * @param buffer Source buffer.
   * @param start Where to start.
   */
  isData(buffer: Buffer, start: number): boolean {

    return buffer[start] === BodyParser.keymap.CR
      && buffer[start + 1] === BodyParser.keymap.LF
      && buffer[start + 2] === BodyParser.keymap.CR
      && buffer[start + 3] === BodyParser.keymap.LF;

  }

  /**
   * Read a line from buffer.
   *
   * First char should not `CR` or `LF`, and last char is not `CR` or `LF` either.
   *
   * @param buffer Read from buffer.
   * @param start Where to start.
   */
  readLine(buffer: Buffer, start: number): Buffer {

    const length = buffer.length;

    for (let i = start; i < length; i++) {
      if (buffer[i] === BodyParser.keymap.CR || buffer[i] === BodyParser.keymap.LF) {
        // return this line without CRLF
        return buffer.slice(start, i - 1);
      }
    }

    // return hole buffer
    return buffer.slice(start, length);

  }

}

/**
 * Parameter handler.
 *
 * Inject parameter to view method.
 *
 * @extends BaseHandler
 */
export class ParameterHandler extends BaseHandler {

  private parser = new BodyParser();

  /** Parameter injectors, function. */
  private parameterInjectors: { [index in ParamInjectionType]: (name: string) => any } = {
    /**
     * Inject HTTP request instance.
     *
     * @returns {IncomingMessage} Request instance.
     */
    PARAM$HTTP$REQUEST: (): IncomingMessage => this.request,
    /**
     * Inject HTTP response instance.
     *
     * @returns {ServerResponse} Response instance.
     */
    PARAM$HTTP$RESPONSE: (): ServerResponse => this.response,
    /**
     * Inject path query object.
     *
     * @returns {string | undefined} Query value of special key, maybe undefined.
     */
    PARAM$PATH$QUERY: (key: string): string | undefined => this.mapping.queryObject && this.mapping.queryObject[key],
    /**
     * Inject path variable.
     *
     * @returns {string} Path variable.
     */
    PARAM$PATH$VARIABLE: (key: string): string => this.mapping.pathArray![this.route.mapping.pathArray!.indexOf(`{{${key}}}`)],
    /**
     * Inject request body object, should await it to get result.
     *
     * @returns {Promise<any>} Request body promise object.
     */
    PARAM$REQUEST$BODY: (type?: string): Promise<any> => new Promise<any>((resolve, reject) => {
      if (+this.request.headers['content-length']! > 10 * 1024 * 1024) { // if size > 10m, should parse it yourself
        resolve();
      } else {
        let data: Buffer = Buffer.allocUnsafe(0);
        this.request.on('data', (chunk: Buffer) => data = Buffer.concat([data, chunk]));
        // TODO: JSON schema & validate
        this.request.on('end', () => resolve(
          this.parser
            .setContentType(type || this.request.headers['content-type'] || '')
            .parse(data)
        ));
        this.request.on('error', error => reject(error));
      }
    }),
    /**
     * Inject special request header.
     *
     * @returns {string | string[] | undefined} Header value of special key, or undefined.
     */
    PARAM$REQUEST$HEADER: (key: string): string | string[] | undefined => this.request.headers[key.toLowerCase()]
  };

  /**
   * Parameter handle method.
   *
   * @param {Next<T>} next Next function, to go to next handler.
   * @returns {Promise<T>} Result for this handler.
   * @throws {HTTP404Exception} Not found exception.
   */
  async handle(next: () => Promise<any>): Promise<any> {
    // if route exist
    if (this.route) {
      /** Parameter injection array. */
      const parameterInjections: ParamInjection[] | undefined = this.route.target && Reflect.getMetadata(MetadataKey.Parameter, this.route.target.prototype, this.route.name);
      /** Arguments, or undefined. */
      this.args = parameterInjections ? parameterInjections.map(v => this.parameterInjectors[v.type](v.value)) : [];
      try {
        // await promise args, such as `body`
        for (let i = 0, length = this.args.length; i < length; i++) {
          if (this.args[i] instanceof Promise) {
            this.args[i] = await this.args[i];
          }
        }
      } catch (exception) {
        // bad request cannot be parsed, throw 400
        throw new HTTP400Exception(`Bad Request`);
      }
      return next();
    }
    // throw 404 not found exception
    throw new HTTP404Exception(`Can't ${this.request.method} ${this.request.url!}`);
  }

}
