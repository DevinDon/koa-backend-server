import { Logger } from '@iinfinity/logger';
import { createWriteStream, existsSync, mkdirSync, writeFileSync } from 'fs';
import { IncomingMessage } from 'http';
import { CORSHandler, Handler, HTTPRequest, Part, partsToObject, PUT, RequestBody, RequestHeader, Rester, View } from '../../main';
import { ContentType, CONTENT_TYPE } from '../../main/constants';
import { BaseResponse } from '../../main/responses/base.response';

@View()
@Handler(CORSHandler)
class UploadView {

  private logger!: Logger;

  @PUT()
  index(
    @RequestBody() body: Part[],
  ) {
    this.logger.log(`Length: ${body.length}`);
    // console.log(body);
    if (!existsSync('temp')) {
      mkdirSync('temp');
    }
    body.forEach(v => v.contentDispositionFilename && writeFileSync('temp/' + v.contentDispositionFilename, v.data));
    return body.map(value => ({ file: value.contentDispositionFilename, size: value.data.length }));
  }

  @PUT('echo')
  async echo(
    @RequestBody() body: Part[],
  ) {
    return new BaseResponse({
      headers: { [CONTENT_TYPE]: body[0].contentType! },
      data: body[0].buffer,
    });
  }

  @PUT('to/pipe')
  async toPipe(
    @HTTPRequest() request: IncomingMessage,
    @RequestBody() body?: Buffer,
  ) {
    if (body) {
      this.logger.log(`Length: ${body.length}`);
      this.logger.log(body);
      writeFileSync(`temp/${Math.random()}`, body);
      return body;
    } else {
      const result = await new Promise((resolve, reject) => {
        const file = createWriteStream(`temp/${Math.random()}`);
        request.pipe(file);
        request.on('end', () => resolve(file));
      });
      return result;
    }
  }

  @PUT('to/object')
  async toObject(
    @RequestBody() parts: Part[],
  ) {
    return partsToObject(parts);
  }

}

const rester = new Rester();

rester.bootstrap();
