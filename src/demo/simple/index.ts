import { GET, Rester, View } from '../../main';


@View()
class DemoView {

  @GET()
  index() {
    return 'ok';
  }

}

const server = new Rester()
  .configAddress.setHost('0.0.0.0').end()
  .configViews.add(DemoView).end()
  .listen();
