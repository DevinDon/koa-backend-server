import { Logger } from '@iinfinity/logger';
import HTTP from 'http';
import HTTP2 from 'http2';
import HTTPS from 'https';
import { ConnectionOptions, createConnection, createConnections } from 'typeorm';
import { HandlerType, Injector } from './decorator';
import { HandlerPool, ParameterHandler } from './handler';
import { ExceptionHandler } from './handler/ExceptionHandler';
import { RouterHandler } from './handler/RouterHandler';
import { SchemaHandler } from './handler/SchemaHandler';

/**
 * Address option.
 *
 * - portocol: 'HTTP' | 'HTTPS' | 'HTTP2'
 * - host: string
 * - port: number
 * - ssl?: HTTPS.ServerOptions | HTTP2.SecureServerOptions
 * - proxy?: boolean
 */
interface AddressOption {
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
}

/**
 * Rester server.
 *
 * **Usage:**
 *
 * `new Rester().listen()` // listening on http://localhost:8080
 *
 * `new Rester().listen(80, '0.0.0.0')` // listening on http://0.0.0.0:80
 *
 * `new Rester().configHandler.add(SomeHandler, AnotherHandler).end().listen()` // add handlers & listening
 *
 * See [FULL README DOCUMENT](https://github.com/DevinDon/rester/blob/master/docs/README.md) for more usage.
 */
export class Rester {

  /** Address option. */
  private address: AddressOption;
  /** Controllers in this rester instance. */
  private controllers: Function[];
  /** Database option. */
  private database: ConnectionOptions;
  /** Handler types. */
  private handlers: HandlerType[];
  /** Logger instance, use `getLogger` to get or `setLogger` to set. */
  private logger: Logger;
  /** Handler pool. */
  private pool: HandlerPool;
  /** Node.js server. */
  private server!: HTTP.Server | HTTP2.Http2Server | HTTPS.Server;

  /** Zone to storage something about this instance. */
  zone: { [index: string]: any };

  /**
   * Create a new rester server.
   *
   * Use `config*` methods to config rester server.
   */
  constructor() {
    // config default address
    this.address = {
      portocol: 'HTTP',
      host: 'localhost',
      port: 8080
    };
    // config empty controllers
    this.controllers = [];
    // config empty database
    this.database = {} as any;
    // config default global handlers
    this.handlers = [ExceptionHandler, SchemaHandler, RouterHandler, ParameterHandler];
    // config logger to new
    this.logger = new Logger(`Rester ${Date.now()}`);
    // config handler pool
    this.pool = new HandlerPool(this);
    // init zone
    this.zone = {};
  }

  /**
   * Add global handlers.
   *
   * @param {HandlerType[]} handlerTypes Handler types.
   * @returns {this} Rester instance.
   */
  addHandlers(...handlerTypes: HandlerType[]): this {
    this.pool.handlerTypes.push(...handlerTypes);
    return this;
  }

  /**
   * Get global handlers
   *
   * @returns {HandlerType[]} Handler types.
   */
  getHandlers(): HandlerType[] {
    return this.pool.handlerTypes;
  }

  /**
   * Reset global handlers to `[]` .
   *
   * @returns {this} Rester instance.
   */
  resetHandlers(): this {
    this.pool.handlerTypes = [];
    return this;
  }

  /**
   * Get logger.
   *
   * @returns {Logger} Logger instance.
   */
  getLogger(): Logger {
    return this.logger;
  }

  /**
   * Set logger.
   *
   * @param {Logger} logger Logger.
   * @returns {Logger} And return it.
   */
  setLogger(logger: Logger): Logger {
    return this.logger = logger;
  }

  /**
   * Start listening.
   *
   * @param {number} port Listening port, default to `option.address.port || 8080` .
   * @param {string} host Listening host, default to `option.address.host || 'localhost'` .
   * @returns {this} This instance.
   */
  listen(port: number = this.option.address.port, host: string = this.option.address.host): this {
    this.server.listen(port, host);
    this.logger.log(`Server online, listening on: ${host}:${port}.`);
    return this;
  }

}
