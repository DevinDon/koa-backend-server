import { IncomingMessage, ServerResponse } from 'http';
import 'reflect-metadata';
import { Controller, GET, Handler, HTTPRequest, HTTPResponse, PathQuery, PathVariable, POST, RequestBody, RequestHeader, Rester, HTTP401Exception } from '../../main';
import { LogHandler } from './LogHandler';
import { ModifyHostHandler } from './ModifyHostHandler';
import { ModifyPrefixHandler } from './ModifyPrefixHandler';
import { ModifyAgainHandler } from './ModifyAgainHandler';
import { UserEntity, User } from './UserEntity';

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
    request(@HTTPRequest() request: IncomingMessage): any {
      return request.headers;
    }

    @GET('/request/method')
    requestMethod(@HTTPRequest() request: IncomingMessage): string {
      return request.method! + request.url!;
    }

    @GET('/response')
    response(@HTTPResponse() response: ServerResponse): any {
      return 'What the fuck!';
    }

    @GET('/status')
    status() {
      throw new HTTP401Exception('401 status code test.', 'Status code is 401, and this is response.');
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

    @POST('/body/buffer')
    buffer(@RequestBody() body: Buffer) {
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

  @Controller('/user')
  class UserController {

    @POST('/add')
    async add(@RequestBody() user: User) {
      return UserEntity.insert(user);
    }

    @GET('/list')
    async list() {
      return UserEntity.find();
    }

  }

  const server = new Rester({
    database: {
      type: 'postgres',
      host: 't-1.don.red',
      port: 5432,
      username: 'shared',
      password: 'shared',
      database: 'shared',
      entities: [
        UserEntity
      ],
      logging: true,
      synchronize: true
    }
  }).listen()
    .addHandlers(LogHandler);

}
