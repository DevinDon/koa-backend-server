export interface Part {
  raw: Buffer;
  contentDisposition: string;
  contentDispositionName: string;
  contentDispositionFilename?: string;
  contentTransferEncoding?: string;
  contentType?: string;
  contentTypeCharset?: string;
  data: Buffer;
}

const keymap = {
  br: 0x0a,
  dash: 0x2d
};

const regmap = {
  regular: /([^\s]*): ([^\s]*)/,
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
    private body: string
  ) {
    this.boundary = contentType.match(/boundary=(.*)/)![1];
  }

  parse(body: string = this.body) {
    const buffer: Buffer = Buffer.from(body);
    const info = {
      partStart: 0,
      dataStart: 0,
      lineStart: 0,
      isHeader: true,
      contentDisposition: '',
      contentDispositionName: '',
      contentDispositionFilename: undefined as any,
      contentType: undefined as any,
      contentTypeCharset: undefined as any,
      contentTransferEncoding: undefined as any
    };
    for (let i = 0; i < buffer.length; i++) {
      if (buffer[i] === keymap.br) {
        const start = i + 3;
        const end = start + this.boundary.length;
        if (
          buffer.length > end
          && buffer[i + 1] === keymap.dash
          && buffer[i + 2] === keymap.dash
          && buffer.toString('utf8', start, end) === this.boundary
        ) { // is boundary line, end last part
          info.isHeader = true;
          if (i !== 0) {
            this.parts.push({
              raw: buffer.slice(info.partStart, i - 1),
              contentDisposition: info.contentDisposition,
              contentDispositionName: info.contentDispositionName,
              contentDispositionFilename: info.contentDispositionFilename,
              contentTransferEncoding: info.contentTransferEncoding,
              contentType: info.contentType,
              contentTypeCharset: info.contentTypeCharset,
              data: buffer.slice(info.dataStart, i - 1)
            });
          }
          i = end;
          info.partStart = end + 1;
          info.lineStart = end + 1;
        } else { // not boundary line, mark as data
          if (info.lineStart === i && info.isHeader) {
            info.isHeader = false;
            info.dataStart = i + 1;
          }
          if (i !== 0 && info.isHeader) { // if is multipart header
            const line = buffer.toString(undefined, info.lineStart, i - 1);
            info.lineStart = i + 1;
            const match = line.match(regmap.regular);
            switch (match && match[1]) {
              case 'Content-Disposition':
                const disposition = line.match(regmap.contentDisposition);
                info.contentDisposition = disposition && disposition[1] || '';
                const name = line.match(regmap.contentDispositionName);
                info.contentDispositionName = name && name[1] || '';
                const filename = line.match(regmap.contentDispositionFilename);
                info.contentDispositionFilename = filename && filename[1] || undefined;
                break;
              case 'Content-Transfer-Encoding':
                const encoding = line.match(regmap.regular);
                info.contentTransferEncoding = encoding && encoding[1];
                break;
              case 'Content-Type':
                const type = line.match(regmap.contentType);
                info.contentType = type && type[1] || undefined;
                const charset = line.match(regmap.contentTypeCharset);
                info.contentTypeCharset = charset && charset[1];
                break;
              default: // is not header, maybe exception
                info.dataStart = i + 1;
                break;
            }
          }
        }

      } else {

      }
    }
    return this.parts;
  }

}
