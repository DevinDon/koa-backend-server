import { createWriteStream, writeFileSync } from 'fs';
import { IncomingMessage } from 'http';
import { CORSHandler, Handler, HTTPRequest, Part, PUT, RequestBody, Rester, View } from '../../main';

@View()
@Handler(CORSHandler)
class UploadView {

  @PUT('/')
  index(
    @RequestBody() body: Part[]
  ) {
    console.log(`Length: ${body.length}`);
    // console.log(body);
    body.forEach(v => v.contentDispositionFilename && writeFileSync('temp/' + v.contentDispositionFilename + '.txt', v.data));
    return body.map(v => ({ file: v.contentDispositionFilename, size: v.data.length }));
  }

  @PUT('/single')
  async single(
    @HTTPRequest() request: IncomingMessage,
    @RequestBody() body?: Buffer
  ) {
    if (body) {
      console.log(`Length: ${body.length}`);
      console.log(body);
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

}

const server = new Rester()
  .configViews.add(UploadView).end()
  .listen(() => { }, 8080, '0.0.0.0');
