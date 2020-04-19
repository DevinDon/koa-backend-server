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
  data: Buffer;
}

export class BodyParser {

  private static keymap = {
    cr: 0x0d,
    lf: 0x0a,
    dash: 0x2d
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
    switch (this.contentType.match(/[^;]*/)![1]) {
      case 'application/json':
        return this.parseApplicationJson();
      case 'application/octet-stream':
        return this.parseApplicationOctetStream();
      case 'multipart/form-data':
        return this.parseMultipartFormData();
      case 'text/plain':
        return this.parseTextPlain();
      default:
        return this.parseDefault();
    }
  }

  parseApplicationJson(buffer: Buffer = this.body): any {
    return JSON.parse(buffer.toString());
  }

  parseApplicationOctetStream(buffer: Buffer = this.body): Buffer {
    return buffer;
  }

  parseMultipartFormData(buffer: Buffer = this.body, contentType = this.contentType) {
    const boundary = contentType.match(/boundary=(.*)/)![1];
    const length = buffer.length;
    const parts: Part[] = [];
    let start = 0;
    let end = 0;
    return '';
  }

  parseTextPlain(buffer: Buffer = this.body): string {
    return buffer.toString();
  }

  parseDefault(buffer: Buffer = this.body): Buffer {
    return buffer;
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
      let data: Buffer = Buffer.allocUnsafe(0);
      this.request.on('data', (chunk: Buffer) => data = Buffer.concat([data, chunk]));
      // TODO: JSON schema & validate
      this.request.on('end', () => resolve(
        this.parser
          .setContentType(type || this.request.headers['content-type'] || '')
          .parse(data)
      ));
      this.request.on('error', error => reject(error));
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
