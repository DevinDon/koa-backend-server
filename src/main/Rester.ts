import { Logger } from '@iinfinity/logger';
import HTTP from 'http';
import HTTP2 from 'http2';
import HTTPS from 'https';
import { ConnectionOptions, createConnection, createConnections } from 'typeorm';
import { HandlerType, Injector } from './decorator';
import { HandlerPool } from './handler';

/** Rester option. */
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

/**
 * Rester server.
 *
 * **Usage:**
 *
 * `new Rester().listen()` // listening on http://localhost:8080
 *
 * `new Rester().listen(80, '0.0.0.0')` // listening on http://0.0.0.0:80
 *
 * `new Rester(option).listen()` // use special option
 *
 * See [FULL README DOCUMENT](https://github.com/DevinDon/rester/blob/master/docs/README.md) for more usage.
 */
export class Rester {

  /** Logger instance, use `getLogger` to get or `setLogger` to set. */
  private logger: Logger = new Logger(`Rester ${Date.now()}`);
  /** Rester option. */
  private option: ResterOption;
  /** Handler pool. */
  private pool: HandlerPool = Injector.instance(HandlerPool);
  /** Node.js server. */
  private server: HTTP.Server | HTTP2.Http2Server | HTTPS.Server;

  /**
   * Create a new server.
   *
   * @param {Partial<ResterOption>} option Rester option.
   */
  constructor(option?: Partial<ResterOption>) {
    // assign default option
    this.option = {
      address: Object.assign({
        portocol: 'HTTP',
        host: 'localhost',
        port: 8080
      }, option && option.address),
      database: option && option.database
    };
    // create server
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
    // connect database
    if (this.option.database) {
      if (this.option.database instanceof Array) {
        createConnections(this.option.database);
      } else {
        createConnection(this.option.database);
      }
      this.logger.info(`Database connecting.`);
    } else {
      this.logger.warn(`No database connection.`);
    }
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
