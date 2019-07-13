import { GET, Rester, View } from '../../main';

@View()
class DemoView {

  @GET('/')
  index() {
    return { hello: 'world' };
  }

}

const server = new Rester()
  .configViews.add(DemoView).end()
  .listen();
