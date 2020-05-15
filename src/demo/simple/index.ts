import { GET, PathVariable, Rester, View, baseParam, parameterInjectors, BaseHandler } from '../../main';

const Test = baseParam('abc');

parameterInjectors.abc = (handler) => {
  return handler.request.headers;
}

@View()
class DemoView {

  @GET()
  index() {
    return { hello: 'world' };
  }

  @GET('{{name}}')
  name(@Test() name: string) {
    const a = name + 1;
    return name;
  }

}

const server = new Rester()
  .configAddress.setHost('0.0.0.0').end()
  .configViews.add(DemoView).end()
  .listen();
