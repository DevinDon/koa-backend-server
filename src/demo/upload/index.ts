import { PUT, Rester, View, RequestBody, RequestHeader } from '../../main';

@View()
class UploadView {

  @PUT('/')
  index(
    @RequestHeader('Content-Type') contentType: string,
    @RequestBody() body: string
  ) {
    console.log(`Length: ${body.length}`);
    console.log(`Content Type: ${contentType}`);
    const boundary = /boundary=(.*)/.exec(contentType)![1];
    // 解析 FormData 请参考 [深入解析 multipart/form-data](https://www.jianshu.com/p/29e38bcc8a1d)
    const formParser = new FormParser(contentType, body);
    // TODO: 优化解析方案，实现逐行开头字符匹配减少开销
    return results.toString();
  }

}

const server = new Rester()
  .configViews.add(UploadView).end()
  .listen(() => console.log('Server started.'), 8080, '0.0.0.0');
