import { writeFileSync } from 'fs';
import { CORSHandler, Handler, Part, PUT, RequestBody, Rester, View } from '../../main';

@View()
@Handler(CORSHandler)
class UploadView {

  @PUT('/')
  index(
    @RequestBody() body: Part[]
  ) {
    console.log(`Length: ${body.length}`);
    console.log(body);
    body.forEach(v => v.contentDispositionFilename && writeFileSync('temp/' + v.contentDispositionFilename + '.txt', v.data));
    return body.map(v => ({ file: v.contentDispositionFilename, size: v.data.length }));
  }

  @PUT('/single')
  single(@RequestBody() body: Buffer) {
    console.log(`Length: ${body.length}`);
    console.log(body);
    writeFileSync('temp/' + Math.random(), body);
    return body.length;
  }

}

const server = new Rester()
  .configViews.add(UploadView).end()
  .listen(() => { }, 8080, '0.0.0.0');
