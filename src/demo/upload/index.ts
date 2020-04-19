import { PUT, Rester, View, RequestBody, RequestHeader } from '../../main';
import { FormParser } from './parser';
import { writeFileSync } from 'fs';

@View()
class UploadView {

  @PUT('/')
  index(
    @RequestHeader('Content-Type') contentType: string,
    @RequestBody() body: any
  ) {
    console.log(`Length: ${body.length}`);
    // 解析 FormData 请参考 [深入解析 multipart/form-data](https://www.jianshu.com/p/29e38bcc8a1d)
    const parts = new FormParser(contentType, body).parse();
    const results = parts.map(v => ({
      raw: v.buffer.toString(),
      data: v.data.toString(),
      name: v.contentDispositionName,
      file: v.contentDispositionFilename
    }));
    // parts.forEach(
    //   v => v.contentDispositionFilename
    //     && writeFileSync(v.contentDispositionFilename, v.data, 'binary')
    // );
    return results;
  }

}

const server = new Rester()
  .configViews.add(UploadView).end()
  .listen(() => console.log('Server started.'), 8080, '0.0.0.0');
