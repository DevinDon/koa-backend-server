import { IncomingMessage, Server, ServerResponse } from 'http';
import 'reflect-metadata';
import { inspect } from 'util';
import { Controller, CoreHandlerPool, GET, HTTPRequest, HTTPResponse, Injector, PathVariable, POST, RequestHeader } from '../../main';
import { HTTPException } from '../../main/Exception';

namespace Simple {

  const pool: CoreHandlerPool = Injector.generate(CoreHandlerPool);

  @Controller('/')
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

    @GET('/request/method')
    requestMethod(@HTTPRequest() request: IncomingMessage): string {
      return request.method! + request.url!;
    }

    @GET('/response')
    response(@HTTPResponse() response: ServerResponse): number {
      response.writeHead(401, 'This is a long test reason, /adwdad/awd/wada/da/d/w/da//a/abc not found.');
      return 401;
    }

    @GET('/show/{{name}}')
    show(@PathVariable('name') name: string): string {
      return name;
    }

  }

  @Controller('/prefix')
  class PrefixController {
    @GET('/')
    index() {
      return 'Hello, prefix!';
    }
  }

  const server = new Server((request, response) => {
    const handler = pool.take(request, response);
    try {
      response.end(handler.handle());
    } catch (error) {
      const exception: HTTPException = error;
      response.writeHead(exception.code, exception.message);
      response.end(inspect(exception.content, true));
    }
    // don't need init
    pool.give(handler);
  }).listen(8080, () => { console.log('Server listening on localhost:8080.'); });

}
