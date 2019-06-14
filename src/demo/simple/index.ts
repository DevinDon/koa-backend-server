import { Controller, GET, Rester } from '../../main';

@Controller()
class DemoController {

  @GET('/')
  index() {
    return { hello: 'world' };
  }

}

const server = new Rester()
  .configControllers.add(DemoController).end()
  .listen();
