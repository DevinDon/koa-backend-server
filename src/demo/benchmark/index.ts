import { createServer } from 'http';
import { GET, Rester, View, RouterHandler } from '../../main';

const serverRaw = createServer((request, response) => response.end('ok')).listen(8080);

@View()
class DemoView {

  @GET()
  index() {
    return 'ok';
  }

}

const serverRester = new Rester()
  .configAddress.setHost('0.0.0.0').setPort(8081).end()
  .configViews.add(DemoView).end()
  .configHandlers.set(RouterHandler).end()
  .listen();
