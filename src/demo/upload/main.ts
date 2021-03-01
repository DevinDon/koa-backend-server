import { Logger } from '@iinfinity/logger';
import { createWriteStream, writeFileSync } from 'fs';
import { IncomingMessage } from 'http';
import { CORSHandler, Handler, HTTPRequest, Part, partsToObject, PUT, RequestBody, Rester, View } from '../../main';

@View()
@Handler(CORSHandler)
class UploadView {

  private logger = Logger.getLogger('rester')!;

  @PUT('/')
  index(
    @RequestBody() body: Part[],
  ) {
    this.logger.log(`Length: ${body.length}`);
    // console.log(body);
    body.forEach(v => v.contentDispositionFilename && writeFileSync('temp/' + v.contentDispositionFilename + '.txt', v.data));
    return body.map(v => ({ file: v.contentDispositionFilename, size: v.data.length }));
  }

  @PUT('/single')
  async single(
    @HTTPRequest() request: IncomingMessage,
    @RequestBody() body?: Buffer,
  ) {
    if (body) {
      this.logger.log(`Length: ${body.length}`);
      this.logger.log(body);
      writeFileSync('temp/' + Math.random(), body);
      return body.length;
    } else {
      const result = await new Promise((resolve, reject) => {
        const file = createWriteStream(`${Math.random()}`);
        request.pipe(file);
        request.on('end', () => resolve(file));
      });
      return result;
    }
  }

  @PUT('/object')
  async object(
    @RequestBody() parts: Part[],
  ) {
    return partsToObject(parts);
  }

}

const rester = new Rester();

rester.bootstrap();
