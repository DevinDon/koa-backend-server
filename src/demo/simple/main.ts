import { BaseView, GET, Rester, ResterModule, View } from '../../main';

@View()
class SimpleView extends BaseView {

  @GET()
  index() {
    return 'Hello, world!';
  }

}

const indexModule: ResterModule = {
  views: [SimpleView],
};

const rester = new Rester({ modules: [indexModule] });

rester.bootstrap();
