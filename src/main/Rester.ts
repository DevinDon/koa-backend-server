import { Logger } from '@iinfinity/logger';
import HTTP from 'http';
import HTTP2 from 'http2';
import HTTPS from 'https';
import { ConnectionOptions } from 'typeorm';
import { HandlerType, Injector } from './decorator';
import { HandlerPool } from './handler';

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

  private logger: Logger = new Logger(`Rester ${Date.now()}`);
  private option: ResterOption;
  private pool: HandlerPool = Injector.generate(HandlerPool);
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
      //   this.server = HTTP2.createSecureServer(this.option.address.ssl || {}, this.pool.process.bind(this.pool));
      //   break;
      // case 'HTTPS':
      //   this.server = HTTPS.createServer(this.option.address.ssl || {}, this.pool.process.bind(this.pool));
      //   break;
      default:
        this.server = HTTP.createServer(this.pool.process.bind(this.pool));
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

  getLogger(): Logger {
    return this.logger;
  }

  setLogger(logger: Logger): Logger {
    return this.logger = logger;
  }

  listen(port: number = this.option.address.port, host: string = this.option.address.host): this {
    this.server.listen(port, host);
    this.logger.log(`Server online, listening on: ${host}:${port}.`);
    return this;
  }

}
