import { createWriteStream, existsSync, mkdirSync, writeFileSync } from 'fs';
import { IncomingMessage } from 'http';
import { BaseView, CORSHandler, Handler, HTTPRequest, Part, partsToObject, PUT, RequestBody, Rester, ResterModule, View } from '../../main';
import { CONTENT_TYPE } from '../../main/constants';
import { ResterResponse } from '../../main/responses';

@View()
@Handler(CORSHandler)
class UploadView extends BaseView {

  @PUT()
  index(
    @RequestBody() body: Part[],
  ) {
    this.logger.log(`Length: ${body.length}`);
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
    return new ResterResponse({
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

const uploadModule: ResterModule = {
  views: [UploadView],
};

const rester = new Rester({ modules: [uploadModule] });

rester.bootstrap();
