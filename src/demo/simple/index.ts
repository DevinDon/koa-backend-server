import { IncomingMessage, Server, ServerResponse } from 'http';
import 'reflect-metadata';
import { Controller, GET, CoreHandler, CoreHandlerPool, HTTPRequest, HTTPResponse, Injectable, Injector, POST, RequestHeader } from '../../main';

const pool: CoreHandlerPool = Injector.generate(CoreHandlerPool);

@Controller()
class DemoController {

  private count = 0;

  @GET('/')
  index(): string {
    return new Date().toLocaleString();
  }

  @POST('/add')
  add(): number {
    return ++this.count;
  }

  @GET('/host')
  host(@RequestHeader('host') host: string): string {
    return host;
  }

  @GET('/request')
  request(@HTTPRequest() request: IncomingMessage): string {
    return request.headers as any;
  }

  @GET('/response')
  response(@HTTPResponse() response: ServerResponse): number {
    response.writeHead(401, 'This is a long test reason, /adwdad/awd/wada/da/d/w/da//a/abc not found.');
    return 401;
  }

}

interface Plugin {
  core: (handler: CoreHandler) => any;
}

@Injectable()
class ExceptionPlugin implements Plugin {
  core(handler: CoreHandler) {
    // handler.handle;
  }
}

const server = new Server((request, response) => {
  const handler = pool.take(request, response);
  response.end(handler.handle());
  // don't need init
  pool.give(handler);
}).listen(8080);
