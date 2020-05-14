
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
