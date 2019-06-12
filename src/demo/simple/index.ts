import { Controller, GET, Rester } from '../../main';

@Controller()
class DemoController {

  @GET('/')
  index() {
    return 'Hello, world!';
  }

}

const server = new Rester().listen(8080);
