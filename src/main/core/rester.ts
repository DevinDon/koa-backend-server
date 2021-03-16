import { Logger } from '@iinfinity/logger';
import { BaseEntity } from 'typeorm';
import { MetadataKey } from '../constants';
import { loadResterConfig, ResterConfig } from '../core/rester.config';
import { HandlerType, InjectedType, Injector, VIEWS } from '../decorators';
import { ServerException } from '../exceptions';
import { HandlerPool } from '../handlers';
import { createDatabaseConnections, createHTTPServer, DatabaseConnection, HTTP2Server, HTTPServer, HTTPSServer, Mapping, Route } from '../interfaces';

/**
 * Rester server.
 *
 * **Usage:**
 *
 * `await new Rester().bootstrap()`
 *
 * See [FULL README DOCUMENT](https://github.com/DevinDon/rester/blob/master/docs/README.md) for more usage.
 */
export class Rester {

  /** Rester config. */
  public config: ResterConfig;

  /** Views in this rester instance. */
  public readonly views: Function[] = [];
  /** Controllers in this rester instance. */
  public readonly controllers: Function[] = [];
  /** Typeorm connection. */
  private connections?: DatabaseConnection[] = [];
  /** Handler types. */
  public handlers: HandlerType[] = [];
  /** Logger instance. */
  public readonly logger: Logger;
  /** Handler pool. */
  private pool: HandlerPool;
  /** Node.js server. */
  private servers: (HTTPServer | HTTP2Server | HTTPSServer)[] = [];

  constructor(inputConfig: Partial<ResterConfig> = {}) {
    // config
    this.config = loadResterConfig(inputConfig);
    // views
    // connections
    // handlers
    // logger
    Logger.setLogger(
      new Logger({
        name: 'rester',
        level: this.config.logger.level,
        stdout: process.stdout,
        stderr: process.stderr,
        fileout: this.config.logger.outputLog,
        fileerr: this.config.logger.errorLog,
      }),
    );
    this.logger = Logger.getLogger('rester')!;
    // handler pool
    this.pool = new HandlerPool(this);
    // server
  }

  /**
   * Register all databases or exception, before controller init.
   *
   * @throws {ServerException} throw a server exception
   */
  private async registerDatabases() {
    try {
      this.logger.info('Database connecting...');
      this.connections = await createDatabaseConnections(this.config.databases);
      this.logger.info('Database connected.');
    } catch (error) {
      this.logger.error('Database connect failed, reason:', error);
      throw new ServerException(error);
    }
  }

  /**
   * Register all views.
   */
  private async registerViews() {
    // push it into
    this.views.push(...VIEWS.map(({ target }) => target));
    // call init
    VIEWS
      .forEach(({ target, prefix, instance }) => {
        /** Handler types on view. */
        const handlersOnView: HandlerType[] = Reflect.getMetadata(MetadataKey.Handler, target) || [];
        /** Routes on methods of this view. */
        const routes: Route[] = Object.getOwnPropertyNames(target.prototype)
          // exclude constructor & method must be decorated by method decorator
          .filter(name => name !== 'constructor' && Reflect.getMetadata(MetadataKey.Mapping, target.prototype, name))
          // map to a new array of Route
          .map<Route[]>(name => {
            const mapping: Mapping[] = Reflect.getMetadata(MetadataKey.Mapping, target.prototype, name);
            const handlersOnMethod: HandlerType[] = Reflect.getMetadata(MetadataKey.Handler, target.prototype, name) || [];
            const handlers: HandlerType[] = [...handlersOnMethod, ...handlersOnView];
            return mapping.map(v => {
              v.path = prefix + '/' + v.path;
              return { view: instance, handlers, mapping: v, name, target };
            });
          }).flat();
        // define metadata: key = MetadataKey.View, value = routes, on = class
        Reflect.defineMetadata(MetadataKey.View, routes, target);
        // set static properties
        target.prototype.logger = Logger.getLogger('rester');
        target.prototype.rester = this;
        // call view.init()
        try {
          typeof instance.init === 'function' && instance.init();
        } catch (error) {
          this.logger.warn(`View instance init method call failed: ${instance.name}`);
        }
      });
  }

  /**
   * Register all handlers & init each handler.
   */
  private async registerHandlers() {
    [
      ...this.handlers,
      ...new Set(
        this.views.map(
          view => {
            const routes: Route[] = Reflect.getMetadata(MetadataKey.View, view) || [];
            return routes.map(route => route.handlers).flat();
          },
        ).flat(),
      ),
    ].forEach(handler => handler.init(this));
    // freeze it to keep safe
    Object.freeze(this.handlers);
  }

  /**
   * Register all controller, after database connected.
   */
  private async registerControllers() {
    // inject logger & rester
    Injector.storage
      .forEach((value, key) => value.type === InjectedType.CONTROLLER && this.controllers.push(key));
    this.controllers.forEach(controller => {
      controller.prototype.logger = Logger.getLogger('rester');
      controller.prototype.rester = this;
    });
    // call init
    Injector
      .list()
      .filter(({ type }) => type === InjectedType.CONTROLLER)
      .map(({ instance }) => instance)
      .forEach(instance => {
        try {
          typeof instance.init === 'function' && instance.init();
        } catch (error) {
          this.logger.warn(`Controller instance init method call failed: ${instance.name}`);
        }
      });
  }

  /**
   * Register all servers.
   *
   * @param callback callback after listened.
   */
  private async registerServers() {
    for (const address of this.config.addresses) {
      const server = createHTTPServer(this.pool.process.bind(this.pool));
      this.servers.push(server);
      const { port, host } = address;
      const protocol = address.protocol === 'HTTP' ? 'http' : 'https';
      server.listen(port, host, () => this.logger.info(`Server online, listening on: ${protocol}://${host}:${port}`));
    }
  }

  /**
   * Reset all handlers.
   *
   * @returns this rester instance for chain call
   */
  resetHandlers(): Rester {
    this.handlers = [];
    return this;
  }

  /**
   * Add global handlers.
   *
   * @param handlers global handlers
   * @returns {Rester} rester instance
   */
  addHandlers(...handlers: HandlerType[]): Rester {
    this.handlers = [...this.handlers, ...handlers];
    return this;
  }

  /**
   * Reset all entities.
   *
   * @returns this rester instance for chain call
   */
  resetEntities(): Rester {
    for (const database of this.config.databases) {
      (database as any).entities = [];
    }
    return this;
  }

  /**
   * Add entities to special database.
   *
   * @param connectionName connection name for database
   * @param entities database entity
   * @returns {Rester} rester instance
   */
  addEntities<E extends typeof BaseEntity>(...entities: E[] | string[] | (E | string)[]): Rester {
    const connection = typeof entities[0] === 'string' ? entities[0] : 'default';
    typeof entities[0] === 'string' && entities.splice(0, 1);
    const config = this.config.databases
      .find(({ name }) => name === connection);
    if (!config) {
      throw new ServerException(`No such connection named ${connection}`);
    }
    (config as any)['entities'] = [...new Set([...(config.entities || []), ...entities])];
    return this;
  }

  /**
   * Bootstrap rester.
   *
   * @param callback callback after server started up
   */
  async bootstrap(callback?: (() => void | Promise<void>) | string): Promise<Rester> {
    await this.registerDatabases();
    await this.registerViews();
    await this.registerHandlers();
    await this.registerControllers();
    await this.registerServers();
    typeof callback === 'function' && await callback();
    typeof callback === 'string' && this.logger.info(callback);
    return this;
  }

}
