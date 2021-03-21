import { createReadStream, existsSync, lstatSync, ReadStream } from 'fs';
import { lookup } from 'mime-types';
import { ContentType, CONTENT_TYPE } from '../constants';
import { HTTP400Exception, HTTP404Exception } from '../exceptions';
import { BaseResponse, Response } from './base.response';

export type ResourceResponseConfig = Partial<Response> & {
  file: string | ReadStream;
  type?: string;
  encoding?: BufferEncoding;
}

export class ResourceResponse extends BaseResponse<ReadStream> {

  constructor({ file, type, encoding, ...rest }: ResourceResponseConfig) {
    super(rest as any);
    if (typeof file === 'string') {
      if (!existsSync(file)) {
        throw new HTTP404Exception(`Cannot find ${file}`);
      }
      if (!lstatSync(file).isFile()) {
        throw new HTTP400Exception('Cannot get a directory');
      }
      this.data = createReadStream(file, { encoding });
      this.headers[CONTENT_TYPE] = type || lookup(file) || ContentType.STREAM;
    } else {
      this.data = file;
    }
  }

}
