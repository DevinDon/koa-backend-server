import { Logger } from '@iinfinity/logger';
import * as HTTP from 'http';
import * as HTTP2 from 'http2';
import * as HTTPS from 'https';
import { ConnectionOptions, createConnection } from 'typeorm';
import { HandlerType } from './decorator';
import { HandlerPool, ParameterHandler } from './handler';
import { ExceptionHandler } from './handler/exception.handler';
import { RouterHandler } from './handler/router.handler';
import { SchemaHandler } from './handler/schema.handler';

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
   * Config address.
   *
   * - `setHost`: set host
   * - `setPort`: set port
   * - `setProxy`: set if proxy mode
   * - `setPortocol`: set portocol, include `HTTP`, `HTTPS`, `HTTP2`
   * - `setSSL`: set ssl options, if portocol is `HTTPS` or `HTTP2`
   * - `end`: end address config & return this rester instance
   */
  configAddress = {
    setHost: (host: AddressOption['host']) => { this.address.host = host; return this.configAddress; },
    setPort: (port: AddressOption['port']) => { this.address.port = port; return this.configAddress; },
    setProxy: (proxy: AddressOption['proxy']) => { this.address.proxy = proxy; return this.configAddress; },
    setPortocol: (portocol: AddressOption['portocol']) => { this.address.portocol = portocol; return this.configAddress; },
    setSSL: (ssl: AddressOption['ssl']) => { this.address.ssl = ssl; return this.configAddress; },
    end: (): Rester => this
  };

  /**
   * Config controllers.
   *
   * - `add`: add controllers
   * - `get`: get controllers
   * - `set`: reset controllers & then set
   * - `reset`: reset controllers
   * - `end`: end controllers config & return this rester instance
   */
  configControllers = {
    add: (...controllers: Function[]) => { this.controllers = this.controllers.concat(controllers); return this.configControllers; },
    get: () => this.controllers,
    set: (...controllers: Function[]) => { this.controllers = controllers || []; return this.configControllers; },
    reset: () => { this.controllers = []; return this.configControllers; },
    end: (): Rester => this
  };

  /**
   * Config database.
   *
   * - `set`:
   * - `setType`:
   * - `setHost`:
   * - `setPort`:
   * - `setUsername`:
   * - `setPassword`:
   * - `setDatabase`:
   * - `setEntities`:
   * - `setLogger`:
   * - `setLogging`:
   * - `setStnchronize`:
   * - `end`: end database config & return this rester instance
   */
  configDatabase = {
    set: (option: ConnectionOptions) => { this.database = option; return this.configDatabase; },
    setType: (type: ConnectionOptions['type']) => { (this.database as any).type = type; return this.configDatabase; },
    setHost: (host: string) => { (this.database as any).host = host; return this.configDatabase; },
    setPort: (port: number) => { (this.database as any).port = port; return this.configDatabase; },
    setUsername: (username: string) => { (this.database as any).username = username; return this.configDatabase; },
    setPassword: (password: string) => { (this.database as any).password = password; return this.configDatabase; },
    setDatabase: (database: ConnectionOptions['database']) => { (this.database as any).database = database; return this.configDatabase; },
    setEntities: (entities: ConnectionOptions['entities']) => { (this.database as any).entities = entities; return this.configDatabase; },
    setLogger: (logger: ConnectionOptions['logger']) => { (this.database as any).logger = logger; return this.configDatabase; },
    setLogging: (logging: ConnectionOptions['logging']) => { (this.database as any).logging = logging; return this.configDatabase; },
    setSynchronize: (synchronize: boolean) => { (this.database as any).synchronize = synchronize; return this.configDatabase; },
    end: (): Rester => this
  };

  /**
   * Config handlers.
   *
   * - `add`:
   * - `get`:
   * - `set`:
   * - `reset`:
   * - `end`: end handlers config & return this rester instance
   */
  configHandlers = {
    add: (...handlers: HandlerType[]) => { this.handlers = this.handlers.concat(handlers); return this.configHandlers; },
    get: () => this.handlers,
    set: (...handlers: HandlerType[]) => { this.handlers = handlers || []; return this.handlers; },
    reset: () => { this.handlers = []; return this.configHandlers; },
    end: (): Rester => this
  };

  /**
   * Config logger.
   *
   * - `get`:
   * - `set`:
   * - `end`: end logger config & return this rester instance
   */
  configLogger = {
    get: () => this.logger,
    set: (logger: Logger) => { this.logger = logger; return this.configLogger; },
    end: (): Rester => this
  };

  /**
   * Start listening.
   *
   * @param {Function} callback Callback funcation after listen.
   * @param {number} port Listening port, default to `address.port || 8080` .
   * @param {string} host Listening host, default to `address.host || 'localhost'` .
   * @returns {this} This instance.
   */
  listen(callback?: Function, port: number = this.address.port, host: string = this.address.host): this {
    // create server
    switch (this.address.portocol) {
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
    if (this.database.type) {
      createConnection(this.database)
        .then(() => this.logger.info(`Database connecting.`))
        .catch(error => this.logger.error(`Database connect failed: ${error}`))
        .then(() => this.logger.info(`Database connected.`));
    } else {
      this.logger.warn(`No database connection.`);
    }
    // listen to address
    this.server.listen(port, host, () => {
      if (typeof callback === 'function') {
        callback();
      }
      this.logger.info(`Server online, listening on: ${host}:${port}.`);
    });
    return this;
  }

}
