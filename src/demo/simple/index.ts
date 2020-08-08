import { baseParam, GET, parameterInjectors, Rester, View, HandlerZone, BaseHandler, Handler, PathQuery, PathVariable, HTTPRequest, ExceptionHandler, RouterHandler, ParameterHandler, SchemaHandler } from '../../main';
import { logger } from '@iinfinity/logger';

class ZoneHandler extends BaseHandler {

  async handle(next: () => Promise<any>): Promise<any> {
    // this.zone.hello = 'world!!!!';
    this.zone = { what: 'fuck' };
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
  @GET('{{name}}')
  name(
    @PathVariable('name') name: string,
    @HandlerZone() zone: any,
    @HandlerZone('what') fuck: string
  ) {
    return zone;
  }

}

const server = new Rester()
  .configAddress.setHost('0.0.0.0').end()
  .configViews.add(DemoView).end()
  .configHandlers.set(ExceptionHandler, SchemaHandler, RouterHandler, ZoneHandler, ParameterHandler).end()
  .listen();
