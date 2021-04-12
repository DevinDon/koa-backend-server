import { BaseView, GET, PathVariable, ResourceResponse, Rester, ResterModule, View } from '../../src';

@View()
class ResourceView extends BaseView {

  @GET()
  @GET(':path')
  async static(@PathVariable('path') path: string) {
    return new ResourceResponse({ file: path });
  }

}

const resourceModule: ResterModule = {
  views: [ResourceView],
};

const rester = new Rester({ modules: [resourceModule] });

rester.bootstrap();
