import HTTP from 'http';
import HTTP2 from 'http2';
import HTTPS from 'https';
import { ConnectionOptions } from 'typeorm';
import { Method } from './@types';
import { HandlerType, Injector } from './decorator';
import { HandlerPool } from './handler';
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
    ssl?: HTTPS.ServerOptions | HTTP2.SecureServerOptions;
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

  addHandlers(...handlerTypes: HandlerType[]): this {
    this.pool.handlerTypes.push(...handlerTypes);
    return this;
  }

  getHandlers(): HandlerType[] {
    return this.pool.handlerTypes;
  }

  resetHandlers(): this {
    this.pool.handlerTypes = [];
    return this;
  }

  listen(port: number = this.option.address.port, host: string = this.option.address.host): this {
    this.server.listen(port, host);
    console.log(`Server online, listening on: ${host}:${port}.`);
    return this;
  }

}
