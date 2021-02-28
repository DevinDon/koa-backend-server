import { delay } from '@iinfinity/delay';
import { Logger } from '@iinfinity/logger';
import { readFileSync } from 'fs';
import * as HTTP from 'http';
import * as HTTP2 from 'http2';
import * as HTTPS from 'https';
import { Connection, ConnectionOptions, createConnections } from 'typeorm';
import { HandlerType, InjectedType, Injector } from './decorators';
import { HandlerPool, ParameterHandler } from './handlers';
import { ExceptionHandler } from './handlers/exception.handler';
import { RouterHandler } from './handlers/router.handler';
import { SchemaHandler } from './handlers/schema.handler';
import { MetadataKey, Route } from './interfaces';
import { load } from 'js-yaml';

/**
 * Address option.
 *
 * - protocol: 'HTTP' | 'HTTPS' | 'HTTP2'
 * - host: string
 * - port: number
 * - ssl?: HTTPS.ServerOptions | HTTP2.SecureServerOptions
 * - proxy?: boolean
 */
interface AddressOption {
  /** Rester Server protocol. */
  protocol: 'HTTP' | 'HTTPS' | 'HTTP2';
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
 * - `setProtocol`: set protocol, include `HTTP`, `HTTPS`, `HTTP2`
 * - `setSSL`: set ssl options, if protocol is `HTTPS` or `HTTP2`
 * - `end`: end address config & return this rester instance
 */
interface ConfigAddress {
  unconfigured: boolean;
  setHost: (host: AddressOption['host']) => ConfigAddress;
  setPort: (port: AddressOption['port']) => ConfigAddress;
  setProxy: (proxy: AddressOption['proxy']) => ConfigAddress;
  setProtocol: (protocol: AddressOption['protocol']) => ConfigAddress;
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
 * - `reset`:
 * - `end`: end database config & return this rester instance
 */
interface ConfigDatabase {
  unconfigured: boolean;
  set: (options: ConnectionOptions[]) => ConfigDatabase;
  reset: () => ConfigDatabase;
  add: (option: ConnectionOptions) => ConfigDatabase;
  setEntities: (entities: ConnectionOptions['entities'], name?: string) => ConfigDatabase;
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
  private connections?: Connection[];
  /** Database option. */
  private databases: ConnectionOptions[];
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
      protocol: 'HTTP',
      host: 'localhost',
      port: 8080
    };
    // config empty views
    this.views = [];
    // config empty databases
    this.databases = [];
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
   * - `setProtocol`: set protocol, include `HTTP`, `HTTPS`, `HTTP2`
   * - `setSSL`: set ssl options, if protocol is `HTTPS` or `HTTP2`
   * - `end`: end address config & return this rester instance
   */
  configAddress: ConfigAddress = {
    unconfigured: true,
    setHost: host => { this.address.host = host; return this.configAddress; },
    setPort: port => { this.address.port = port; return this.configAddress; },
    setProxy: proxy => { this.address.proxy = proxy; return this.configAddress; },
    setProtocol: protocol => { this.address.protocol = protocol; return this.configAddress; },
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
  configDatabases: ConfigDatabase = {
    unconfigured: true,
    set: options => { this.databases = options; return this.configDatabases; },
    reset: () => { this.databases = []; return this.configDatabases; },
    add: option => {
      const index = this.databases.findIndex(database => database.name === option.name);
      if (index === -1) {
        // add new database
        this.databases.push(option);
      } else {
        // update new database
        Object.assign(this.databases[index], option);
      }
      return this.configDatabases;
    },
    setEntities: (entities, name = 'default') => {
      const index = this.databases.findIndex(database => database.name === name);
      if (index === -1) {
        // insert
        this.databases.push({ name, entities } as any);
      } else {
        // update
        (this.databases[index] as any).entities = entities;
      }
      return this.configDatabases;
    },
    end: () => { this.configDatabases.unconfigured = false; return this; }
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
   * Load config file, config will override code.
   *
   * @param {'DEV' | 'PROD'} mode Depoly mode, 'DEV' or 'PROD'.
   * @returns {Rester} Rester instance.
   */
  private loadConfig(mode: 'PROD' | 'DEV' = process.env.MODE as any): Rester {
    try {
      let yaml;
      if (mode === 'PROD') {
        // production mode
        this.logger.info('Rester is in Production mode.');
        yaml = readFileSync('rester.yaml');
      } else {
        // development mode
        this.logger.debug('Rester is in Development mode');
        yaml = readFileSync('rester.dev.yaml');
      }
      const config: any = load(yaml.toString());
      Object.assign(this.address, config.address);
      config.databases.forEach((database: any) => this.configDatabases.add(database));
      this.zone.config = config;
    } catch (error) {
      this.logger.error(`Load config failed: ${error}`);
    }
    return this;
  }

  /**
   * Connect database.
   *
   * @param {number} retry Retry times, default to 1.
   */
  async connectDatabase(retry: number = 1): Promise<void> {
    while (retry) {
      try {
        this.logger.info('Database connecting...');
        this.connections = await createConnections(this.databases);
        this.logger.info('Database connected.');
        retry = 0;
      } catch (error) {
        if (--retry) {
          this.logger.warn(`Database connect failed: ${error}, retry ${retry} in 10 seconds...`);
        } else {
          this.logger.error('Database connect failed, database offline.');
        }
        this.connections?.map(connection => connection.close());
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
  async listen(callback?: Function, port?: number, host?: string): Promise<this> {
    this.loadConfig();
    if (this.configAddress.unconfigured) { this.configAddress.end(); }
    if (this.configViews.unconfigured) { this.configViews.end(); }
    if (this.configDatabases.unconfigured) { this.configDatabases.end(); }
    if (this.configHandlers.unconfigured) { this.configHandlers.end(); }
    if (this.configLogger.unconfigured) { this.configLogger.end(); }
    // create server
    switch (this.address.protocol) {
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
    if (this.databases.length) {
      await this.connectDatabase(10);
    } else {
      this.logger.warn('No database connection.');
    }
    Injector
      .list()
      .forEach(injected => {
        try {
          injected.type === InjectedType.CONTROLLER
            && typeof injected.instance.init === 'function'
            && injected.instance.init();
        } catch (error) {
          this.logger.warn(`Instance init method call failed: ${injected.instance.name}`);
        }
      }
      );
    // listen to address
    host = host || this.address.host || 'localhost';
    port = port || this.address.port || 8080;
    this.server.listen(port, host, () => {
      if (typeof callback === 'function') {
        callback();
      }
      this.logger.info(`Server online, listening on: ${this.address.protocol === 'HTTP' ? 'http' : 'https'}://${host}:${port}`);
    });
    return this;
  }

}
