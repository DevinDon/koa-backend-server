import { createReadStream, existsSync, ReadStream } from 'fs';
import { contentType } from 'mime-types';
import { ContentType, CONTENT_TYPE } from '../constants';
import { HTTP404Exception } from '../exceptions';
import { BaseResponse, Response } from './base.response';

export class ResourceResponse extends BaseResponse<ReadStream> {

  constructor({ data, headers, ...rest }: Response<string>) {
    if (!existsSync(data)) {
      throw new HTTP404Exception(`Cannot find file ${data}`);
    }
    super({
      data: createReadStream(data),
      headers: {
        ...headers,
        [CONTENT_TYPE]: contentType(data) || ContentType.STREAM,
      },
      ...rest,
    });
  }

}
