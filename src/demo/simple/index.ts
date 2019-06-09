import { IncomingMessage, ServerResponse } from 'http';
import 'reflect-metadata';
import { Controller, GET, Handler, HTTPRequest, HTTPResponse, PathQuery, PathVariable, POST, RequestBody, RequestHeader, Rester } from '../../main';
import { LogHandler } from './LogHandler';
import { ModifyHostHandler } from './ModifyHostHandler';
import { ModifyPrefixHandler } from './ModifyPrefixHandler';
import { ModifyAgainHandler } from './ModifyAgainHandler';

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

    @Handler(ModifyHostHandler)
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
      response.writeHead(401, '401 status code test.');
      return 401;
    }

    @GET('/show/{{name}}')
    show(@PathVariable('name') name: string): string {
      return name;
    }

    @GET('/query')
    query(@PathQuery('username') username: string, @PathQuery('password') password: string): any {
      return { username, password };
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
  @Handler(ModifyPrefixHandler) // Controller must be the decorator farthest from this class
  class PrefixController {

    @GET('/')
    index() {
      return 'Hello, prefix!';
    }

    @Handler(ModifyAgainHandler)
    @GET('/again')
    again() {
      return 'raw';
    }

  }

  const server = new Rester().listen().addHandlers(LogHandler);

}
