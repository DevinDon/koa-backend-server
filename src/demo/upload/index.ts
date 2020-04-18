import { PUT, Rester, View, RequestBody, RequestHeader } from '../../main';
import { FormParser } from './parser';

@View()
class UploadView {

  @PUT('/')
  index(
    @RequestHeader('Content-Type') contentType: string,
    @RequestBody() body: string
  ) {
    console.log(`Length: ${body.length}`);
    // 解析 FormData 请参考 [深入解析 multipart/form-data](https://www.jianshu.com/p/29e38bcc8a1d)
    const parts = new FormParser(contentType, body).parse();
    return parts;
  }

}

const server = new Rester()
  .configViews.add(UploadView).end()
  .listen(() => console.log('Server started.'), 8080, '0.0.0.0');
