import { ExceptionHandler, GET, LoggerHandler, ParameterHandler, PathVariable, ResourceResponse, Rester, RouterHandler, SchemaHandler, View } from '../../main';

@View()
class StaticView {

  @GET()
  @GET(':path')
  async static(@PathVariable('path') path: string) {
    return new ResourceResponse({ file: path });
  }

}

const rester = new Rester();
rester.addHandlers(
  ExceptionHandler,
  SchemaHandler,
  RouterHandler,
  ParameterHandler,
  LoggerHandler,
);

rester.bootstrap();
