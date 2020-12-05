import { readFileSync } from 'fs';
import { ContentType, GET, Handler, LoggerHandler, ResourceHandler, Rester, View } from '../../main';

@View()
class StaticView {

  @GET()
  @GET(':path')
  @Handler(LoggerHandler)
  @Handler(ResourceHandler, { ContentType: ContentType.HTML })
  async static() {
    return readFileSync('README.md').toString();
  }

}

const server = new Rester()
  // .configDatabases.setEntities([TestEntity]).setEntities([TestEntity], 'mongo').end()
  .configAddress.setHost('0.0.0.0').end()
  .configViews.add(StaticView).end()
  .listen();
