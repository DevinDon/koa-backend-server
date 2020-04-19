import { PUT, RequestBody, Rester, View } from '../../main';

@View()
class UploadView {

  @PUT('/')
  index(
    @RequestBody() body: any
  ) {
    console.log(`Length: ${body.length}`);
    console.log(body);
    return body;
  }

}

const server = new Rester()
  .configViews.add(UploadView).end()
  .listen(() => console.log('Server started.'), 8080, '0.0.0.0');
