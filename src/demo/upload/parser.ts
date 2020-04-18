export interface Part {
  raw: Buffer;
  name: string;
  filename: string;
  contentType: string;
  contentTransferEncoding: string;
  data: Buffer;
}

const keymap = {
  br: 0x0a,
  dash: 0x2d
};

export class FormParser {

  private boundary: string;
  private parts: Part[] = [];

  constructor(
    private contentType: string,
    private body: string
  ) {
    this.boundary = contentType.match(/boundary=(.*)/)![1];
  }

  parse(body: string) {
    const buffer: Buffer = Buffer.from(body);
    const info = {
      partStart: 0,
      partEnd: 0,
      isData: false,
      name: undefined,
      filename: undefined,
      contentType: undefined,
      contentTransferEncoding: undefined,
      dataStart: 0,
      dataEnd: 0
    };
    let partStart = 0;
    for (let i = 0; i < buffer.length; i++) {
      switch (buffer[i]) {
        case keymap.br:
          const start = i + 3;
          const end = start + this.boundary.length;
          if (
            buffer.length > end
            && buffer[i + 1] === keymap.dash
            && buffer[i + 2] === keymap.dash
            && buffer.toString('utf8', start, end) === this.boundary
          ) { // is boundary line, end last part
            this.parts.push({
              raw: buffer.slice(info.partStart, info.partEnd)
            });
            partStart = end;
            i = end;
          } else { // not boundary line, mark as data

          }
          break;

        default:
          break;
      }
    }
  }

}
