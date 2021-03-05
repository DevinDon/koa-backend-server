import { createReadStream } from 'fs';
import { GET, PathVariable, Rester, View } from '../../main';

@View()
class StaticView {

  @GET()
  @GET(':path')
  async static(@PathVariable('path') path: string) {
    return createReadStream(path ?? 'README.md');
  }

}

const rester = new Rester();

rester.bootstrap();
