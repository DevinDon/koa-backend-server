import { delay } from '@iinfinity/delay';
import { Logger } from '@iinfinity/logger';
import { readFileSync } from 'fs';
import * as HTTP from 'http';
import * as HTTP2 from 'http2';
import * as HTTPS from 'https';
import { Connection, ConnectionOptions, createConnection } from 'typeorm';
import { MetadataKey, Route } from './@types';
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
 * Config address.
 *
 * - `setHost`: set host
 * - `setPort`: set port
 * - `setProxy`: set if proxy mode
 * - `setPortocol`: set portocol, include `HTTP`, `HTTPS`, `HTTP2`
 * - `setSSL`: set ssl options, if portocol is `HTTPS` or `HTTP2`
 * - `end`: end address config & return this rester instance
 */
interface ConfigAddress {
  unconfigured: boolean;
  setHost: (host: AddressOption['host']) => ConfigAddress;
  setPort: (port: AddressOption['port']) => ConfigAddress;
  setProxy: (proxy: AddressOption['proxy']) => ConfigAddress;
  setPortocol: (portocol: AddressOption['portocol']) => ConfigAddress;
  setSSL: (ssl: AddressOption['ssl']) => ConfigAddress;
  end: () => Rester;
}

/**
 * Config views.
 *
 * - `add`: add views
 * - `get`: get views
 * - `set`: reset views & then set
 * - `reset`: reset views
 * - `end`: end views config & return this rester instance
 */
interface ConfigViews {
  unconfigured: boolean;
  add: (...views: Function[]) => ConfigViews;
  get: () => Function[];
  set: (...views: Function[]) => ConfigViews;
  reset: () => ConfigViews;
  end: () => Rester;
}

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
interface ConfigDatabase {
  unconfigured: boolean;
  set: (option: ConnectionOptions) => ConfigDatabase;
  setType: (type: ConnectionOptions['type']) => ConfigDatabase;
  setHost: (host: string) => ConfigDatabase;
  setPort: (port: number) => ConfigDatabase;
  setUsername: (username: string) => ConfigDatabase;
  setPassword: (password: string) => ConfigDatabase;
  setDatabase: (database: ConnectionOptions['database']) => ConfigDatabase;
  setEntities: (entities: ConnectionOptions['entities']) => ConfigDatabase;
  setLogger: (logger: ConnectionOptions['logger']) => ConfigDatabase;
  setLogging: (logging: ConnectionOptions['logging']) => ConfigDatabase;
  setSynchronize: (synchronize: boolean) => ConfigDatabase;
  end: () => Rester;
}

/**
 * Config handlers.
 *
 * - `add`:
 * - `get`:
 * - `set`:
 * - `reset`:
 * - `end`: end handlers config & return this rester instance
 */
interface ConfigHandlers {
  unconfigured: boolean;
  /**
   * Add global handlers.
   *
   * @param {HandlerType[]} handlers Handler type.
   * @returns {ConfigHandlers} Return config handler chain.
   */
  add: (...handlers: HandlerType[]) => ConfigHandlers;
  get: () => HandlerType[];
  set: (...handlers: HandlerType[]) => ConfigHandlers;
  reset: () => ConfigHandlers;
  end: () => Rester;
}

/**
 * Config logger.
 *
 * - `get`:
 * - `set`:
 * - `end`: end logger config & return this rester instance
 */
interface ConfigLogger {
  unconfigured: boolean;
  get: () => Logger;
  set: (logger: Logger) => ConfigLogger;
  end: () => Rester;
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
  /** Views in this rester instance. */
  private views: Function[];
  /** Typeorm connection. */
  private connection?: Connection;
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
  public zone: { [index: string]: any };

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
    // config empty views
    this.views = [];
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
  configAddress: ConfigAddress = {
    unconfigured: true,
    setHost: host => { this.address.host = host; return this.configAddress; },
    setPort: port => { this.address.port = port; return this.configAddress; },
    setProxy: proxy => { this.address.proxy = proxy; return this.configAddress; },
    setPortocol: portocol => { this.address.portocol = portocol; return this.configAddress; },
    setSSL: ssl => { this.address.ssl = ssl; return this.configAddress; },
    end: () => { this.configAddress.unconfigured = false; return this; }
  };

  /**
   * Config views.
   *
   * - `add`: add views
   * - `get`: get views
   * - `set`: reset views & then set
   * - `reset`: reset views
   * - `end`: end views config & return this rester instance
   */
  configViews: ConfigViews = {
    unconfigured: true,
    add: (...views) => { this.views = this.views.concat(views); return this.configViews; },
    get: () => this.views,
    set: (...views) => { this.views = views || []; return this.configViews; },
    reset: () => { this.views = []; return this.configViews; },
    end: () => { this.configViews.unconfigured = false; return this; }
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
  configDatabase: ConfigDatabase = {
    unconfigured: true,
    set: option => { this.database = option; return this.configDatabase; },
    setType: type => { (this.database as any).type = type; return this.configDatabase; },
    setHost: host => { (this.database as any).host = host; return this.configDatabase; },
    setPort: port => { (this.database as any).port = port; return this.configDatabase; },
    setUsername: username => { (this.database as any).username = username; return this.configDatabase; },
    setPassword: password => { (this.database as any).password = password; return this.configDatabase; },
    setDatabase: database => { (this.database as any).database = database; return this.configDatabase; },
    setEntities: entities => { (this.database as any).entities = entities; return this.configDatabase; },
    setLogger: logger => { (this.database as any).logger = logger; return this.configDatabase; },
    setLogging: logging => { (this.database as any).logging = logging; return this.configDatabase; },
    setSynchronize: synchronize => { (this.database as any).synchronize = synchronize; return this.configDatabase; },
    end: () => { this.configDatabase.unconfigured = false; return this; }
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
  configHandlers: ConfigHandlers = {
    unconfigured: true,
    add: (...handlers) => { this.handlers = this.handlers.concat(handlers); return this.configHandlers; },
    get: () => this.handlers,
    set: (...handlers) => { this.handlers = handlers || []; return this.configHandlers; },
    reset: () => { this.handlers = []; return this.configHandlers; },
    end: () => {
      this.handlers.forEach(handler => handler.init(this));
      const set: Set<HandlerType> = new Set();
      this.views.forEach(view => {
        const routes: Route[] = Reflect.getMetadata(MetadataKey.View, view) || [];
        routes.map(route => route.handlers).flat().forEach(handler => set.add(handler));
      });
      set.forEach(handler => handler.init(this));
      this.configHandlers.unconfigured = false;
      return this;
    }
  };

  /**
   * Config logger.
   *
   * - `get`:
   * - `set`:
   * - `end`: end logger config & return this rester instance
   */
  configLogger: ConfigLogger = {
    unconfigured: true,
    get: () => this.logger,
    set: logger => { this.logger = logger; return this.configLogger; },
    end: () => { this.configLogger.unconfigured = false; return this; }
  };


  /**
   * Load config file.
   *
   * @param {'DEV' | 'PROD'} mode Depoly mode, 'DEV' or 'PROD'.
   * @returns {Rester} Rester instance.
   */
  private loadConfig(mode: 'DEV' | 'PROD' | undefined = process.env.MODE as any): Rester {
    try {
      let json;
      if (mode === 'PROD') { // production mode
        json = readFileSync('rester.json');
      } else { // development mode
        this.logger.debug('Rester is in Development mode');
        json = readFileSync('rester.dev.json');
      }
      const config = JSON.parse(json.toString());
      Object.assign(this.address, config.address);
      Object.assign(this.database, config.database);
      this.zone.config = config;
    } catch (error) {
      this.logger.error(`Load config failed: ${error}.`);
    }
    return this;
  }

  /**
   * Connect database.
   *
   * @param {number} retry Retry times, default to 0.
   */
  async connectDatabase(retry: number = 0): Promise<void> {
    while (retry) {
      try {
        this.logger.info('Database connecting...');
        this.connection = await createConnection(this.database);
        this.logger.info('Database connected.');
        retry = 0;
      } catch (error) {
        if (--retry) {
          this.logger.warn(`Database connect failed: ${error}, retry in 10 seconds...`);
        } else {
          this.logger.error('Database connect failed, database offline.');
        }
        await this.connection?.close();
      } finally {
        await delay(10000);
      }
    }
  }

  /**
   * Start listening.
   *
   * @param {Function} callback Callback funcation after listen.
   * @param {number} port Listening port.
   * @param {string} host Listening host.
   * @returns {this} This instance.
   */
  listen(callback?: Function, port?: number, host?: string): this {
    this.loadConfig();
    if (this.configAddress.unconfigured) { this.configAddress.end(); }
    if (this.configViews.unconfigured) { this.configViews.end(); }
    if (this.configDatabase.unconfigured) { this.configDatabase.end(); }
    if (this.configHandlers.unconfigured) { this.configHandlers.end(); }
    if (this.configLogger.unconfigured) { this.configLogger.end(); }
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
      setInterval(() => this.connection?.isConnected || this.connectDatabase(1), 5000);
    } else {
      this.logger.warn('No database connection.');
    }
    // listen to address
    host = host || this.address.host || 'localhost';
    port = port || this.address.port || 8080;
    this.server.listen(port, host, () => {
      if (typeof callback === 'function') {
        callback();
      }
      this.logger.info(`Server online, listening on: ${host}:${port}.`);
    });
    return this;
  }

}
