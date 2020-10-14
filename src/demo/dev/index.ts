import { IncomingMessage, ServerResponse } from 'http';
import 'reflect-metadata';
import { GET, Handler, HTTP401Exception, HTTPRequest, HTTPResponse, PathQuery, PathVariable, POST, RequestBody, RequestHeader, Rester, View } from '../../main';
import { DelayHandler } from './DelayHandler';
import { LogHandler } from './LogHandler';
import { ModifyAgainHandler } from './ModifyAgainHandler';
import { ModifyHostHandler } from './ModifyHostHandler';
import { ModifyPrefixHandler } from './ModifyPrefixHandler';
import { User, UserEntity } from './UserEntity';

namespace SimpleDemo {

  @View('/')
  class DemoView {

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

    @GET('/show/:name')
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

  @View('prefix')
  @Handler(ModifyPrefixHandler) // View must be the decorator farthest from this class
  class PrefixView {

    @GET()
    index() {
      return 'Hello, prefix!';
    }

    @Handler(ModifyAgainHandler)
    @GET('again')
    again() {
      return 'raw';
    }

  }

  @View('/user')
  class UserView {

    @POST('/add')
    async add(@RequestBody() user: User) {
      return UserEntity.insert(user);
    }

    @GET('/list')
    async list() {
      return UserEntity.find();
    }

  }

  const server = new Rester()
    .configViews
    .add(DemoView, PrefixView, UserView)
    .end()
    .configDatabase
    .setType('postgres')
    .setHost('t-1.don.red')
    .setPort(5432)
    .setUsername('shared')
    .setPassword('shared')
    .setDatabase('shared')
    .setEntities([UserEntity])
    .setLogging(true)
    .setSynchronize(true)
    .end()
    .configHandlers
    .add(LogHandler, DelayHandler)
    .end()
    .listen();

  // const server = new Rester({
  //   database: {
  //     type: 'postgres',
  //     host: 't-1.don.red',
  //     port: 5432,
  //     username: 'shared',
  //     password: 'shared',
  //     database: 'shared',
  //     entities: [
  //       UserEntity
  //     ],
  //     logging: true,
  //     synchronize: true
  //   }
  // }).listen();
  // .addHandlers(DelayHandler);
  // .addHandlers(LogHandler);

}
