/* eslint-disable no-case-declarations */
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

const keymap = {
  cr: 0x0d,
  lf: 0x0a,
  dash: 0x2d
};

const regmap = {
  key: /([^\s]*): ([^\s]*)/,
  contentDisposition: /Content-Disposition: ([^;]*)/,
  contentDispositionName: /[^e]name="(.+?)"/,
  contentDispositionFilename: /filename="(.+?)"/,
  contentType: /Content-Type: ([^;]*)/,
  contentTypeCharset: /charset=([^;]*)/,
  contentTransferEncoding: /Content-Transfer-Encoding: ([^;]*)/
};

export class FormParser {

  private boundary: string;
  private parts: Part[] = [];

  constructor(
    contentType: string,
    private body: Buffer
  ) {
    this.boundary = contentType.match(/boundary=(.*)/)![1];
  }

  parse(body: Buffer = this.body): Part[] {

    const buffer: Buffer = body;
    const length = buffer.length;
    let start = 0;
    let end = 0;

    // Get each part.
    for (let i = 0; i < length; i++) {
      if (buffer[i] === keymap.cr) { i++; }
      if (buffer[i] !== keymap.lf) { continue; }
      if (!this.isBoundary(buffer, i + 1)) { continue; }
      start += 1 + 2 + this.boundary.length + 1;
      end = i - 1;
      const part: Part = {} as any;
      part.buffer = buffer.slice(start, i - 1);
      for (let j = 0; j < part.buffer.length; j++) {
        if (part.buffer[j] === keymap.cr && part.buffer[j + 1] === keymap.lf) {
          part.data = part.buffer.slice(j + 2, end);
          this.parts.push(part);
          break;
        } else {
          const lineBuffer = this.readLine(part.buffer, j); // fix utf8 code
          const line = lineBuffer.toString();
          const key = line.match(regmap.key)![1];
          switch (key) {
            case 'Content-Disposition':
              const disposition = line.match(regmap.contentDisposition);
              part.contentDisposition = disposition && disposition[1] || '';
              const filename = line.match(regmap.contentDispositionFilename);
              part.contentDispositionFilename = filename && filename[1] || undefined;
              const name = line.match(regmap.contentDispositionName);
              part.contentDispositionName = name && name[1] || '';
              break;
            case 'Content-Transfer-Encoding':
              const encoding = line.match(regmap.contentTransferEncoding);
              part.contentTransferEncoding = encoding && encoding[1] || undefined;
              break;
            case 'Content-Type':
              const type = line.match(regmap.contentType);
              part.contentType = type && type[1] || undefined;
              const charset = line.match(regmap.contentTypeCharset);
              part.contentTypeCharset = charset && charset[1] || undefined;
              break;
          }
          j += lineBuffer.length; // fix utf8 code
        }
      }
      start = i + 1;
    }

    return this.parts;

  }

  /**
   * It is boundary line or not.
   *
   * First char should not `\n`.
   *
   * @param buffer Source buffer.
   * @param start Where to start.
   */
  isBoundary(buffer: Buffer, start: number): boolean {

    return buffer[start] === keymap.dash
      && buffer.length > start + 2 + this.boundary.length
      && buffer[start + 1] === keymap.dash
      && buffer.toString(undefined, start + 2, start + 2 + this.boundary.length) === this.boundary;

  }

  isData(buffer: Buffer, start: number): boolean {

    return buffer[start] === keymap.lf && buffer[start + 1] === keymap.lf;

  }

  /**
   * Read a line from buffer.
   *
   * First char should not `\n`.
   *
   * @param buffer Read from buffer.
   * @param start Where to start.
   */
  readLine(buffer: Buffer, start: number): Buffer {

    const length = buffer.length;

    for (let i = start; i < length; i++) {
      if (buffer[i] === keymap.cr) { return buffer.slice(start, i + 1); }
      if (buffer[i] === keymap.lf) { return buffer.slice(start, i); }
    }

    // The end line.
    return buffer.slice(start, length);

  }

}
