import { GET, HTTP400Exception, Rester, View } from '../../main';

@View()
class DemoView {

  @GET()
  @GET('internal')
  internal() {
    throw new Error('Some internal error');
  }

  @GET('http')
  http() {
    throw new HTTP400Exception('Some HTTP error', { hello: 'error' });
  }

}

const server = new Rester()
  .configAddress.setHost('0.0.0.0').end()
  .configViews.add(DemoView).end()
  .listen();
