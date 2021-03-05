import { GET, Rester, View } from '../../main';

@View()
class SimpleView {

  @GET()
  index() {
    return 'Hello, world!';
  }

}

const rester = new Rester();

rester.bootstrap();
