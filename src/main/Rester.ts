import HTTP from 'http';
import HTTP2, { SecureServerOptions } from 'http2';
import HTTPS, { ServerOptions } from 'https';
import { ConnectionOptions } from 'typeorm';
import { Method } from './@types';
import { Injector, HandlerType } from './decorator';
import { HandlerPool, BaseHandler } from './handler';
import { Router } from './Router';

export interface ResterOption {
  address: {
    /** Rester Server portocol. */
    portocol: 'HTTP' | 'HTTPS' | 'HTTP2';
    /** Rester Server host. */
    host: string;
    /** Rester Server port. */
    port: number;
    /** Rester Server ssl option, only required in secure server (HTTPS or HTTP2). */
    ssl?: ServerOptions | SecureServerOptions;
    /** In proxy mode or not. */
    proxy?: boolean;
  };
  database?: ConnectionOptions | ConnectionOptions[];
}

export class Rester {

  private option: ResterOption;
  private pool: HandlerPool = Injector.generate(HandlerPool);
  private router: Router = Injector.generate(Router);
  private server: HTTP.Server | HTTP2.Http2Server | HTTPS.Server;

  constructor(option?: ResterOption) {
    this.option = {
      address: Object.assign({
        portocol: 'HTTP',
        host: 'localhost',
        port: 8080
      }, option && option.address),
      database: option && option.database
    };
    switch (this.option.address.portocol) {
      // case 'HTTP2':
      //   this.server = HTTP2.createSecureServer(this.option.address.ssl || {}, this.listener.bind(this));
      //   break;
      case 'HTTPS':
        this.server = HTTPS.createServer(this.option.address.ssl || {}, (request, response) => this.pool.process({ request, response, route: this.router.get({ method: request.method as Method, path: request.url! })! }));
        break;
      default:
        this.server = HTTP.createServer((request, response) => this.pool.process({ request, response, route: this.router.get({ method: request.method as Method, path: request.url! })! }));
        break;
    }
  }

  addHandlers(...handlerTypes: HandlerType[]) {
    this.pool.handlerTypes.push(...handlerTypes);
    return this.pool.handlerTypes;
  }

  listen(port: number = this.option.address.port, host: string = this.option.address.host): this {
    this.server.listen(port, host);
    console.log(`Server online, listening on: ${host}:${port}.`);
    return this;
  }

}
