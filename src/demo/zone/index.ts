import { logger } from '@iinfinity/logger';
import { BaseHandler, ExceptionHandler, GET, Handler, HandlerZone, ParameterHandler, PathVariable, Rester, RouterHandler, SchemaHandler, View } from '../../main';

class ZoneHandler extends BaseHandler {

  async handle(next: () => Promise<any>): Promise<any> {
    this.zone = { hello: 'world' };
    logger.debug('handler works');
    return next();
  }

}

@View()
class DemoView {

  @GET()
  index() {
    return { hello: 'world' };
  }

  @Handler(ZoneHandler)
  @GET(':name')
  name(
    @PathVariable('name') name: string,
    @HandlerZone() zone: { hello: 'world' },
    @HandlerZone('what') what: string
  ) {
    return { ...zone, name, what };
  }

}

const server = new Rester()
  .configAddress.setHost('0.0.0.0').end()
  .configViews.add(DemoView).end()
  .configHandlers.set(ExceptionHandler, SchemaHandler, RouterHandler, ZoneHandler, ParameterHandler).end()
  .listen();
