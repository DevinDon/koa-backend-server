import { IncomingMessage, Server, ServerResponse } from 'http';
import 'reflect-metadata';
import { Controller, GET, HandlerPool, HTTPRequest, HTTPResponse, Method, PathQuery, PathVariable, POST, RequestBody, RequestHeader, Router, Injector } from '../../main';

namespace SimpleDemo {

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

    @GET('/query')
    query(@PathQuery('name') name: string): any {
      return { name: name };
    }

    @POST('/body')
    async body(@RequestBody() body: any): Promise<any> {
      return body;
    }

    @POST('/async')
    async asyncTest(): Promise<any> {
      return 'Async test OK!';
    }

  }

  @Controller('/prefix')
  class PrefixController {
    @GET('/')
    index() {
      return 'Hello, prefix!';
    }
  }

  const pool = Injector.generate(HandlerPool);
  const router: Router = Injector.generate(Router);

  const server = new Server((request, response) => {
    pool.process({
      request,
      response,
      route: router.get({ method: request.method as Method, path: request.url! })!
    });
  }).listen(8080, () => { console.log('Server listening on localhost:8080.'); });

}
