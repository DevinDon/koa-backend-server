import { GET, PathVariable, ResourceResponse, Rester, View } from '../../main';

@View()
class StaticView {

  @GET()
  @GET(':path')
  async static(@PathVariable('path') path: string) {
    return new ResourceResponse({ data: path });
  }

}

const rester = new Rester();

rester.bootstrap();
