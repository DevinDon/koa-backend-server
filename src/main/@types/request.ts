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
