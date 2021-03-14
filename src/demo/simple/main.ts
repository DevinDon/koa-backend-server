import { ExceptionHandler, GET, LoggerHandler, ParameterHandler, Rester, RouterHandler, SchemaHandler, View } from '../../main';

@View()
class SimpleView {

  @GET()
  index() {
    return 'Hello, world!';
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
