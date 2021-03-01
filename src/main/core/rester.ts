import { Logger } from '@iinfinity/logger';
import { loadResterConfig, ResterConfig, ZoneConfig } from '../core/rester.config';
import { HandlerType, InjectedType, Injector } from '../decorators';
import { ServerException } from '../exceptions';
import { ExceptionHandler, HandlerPool, ParameterHandler, RouterHandler, SchemaHandler } from '../handlers';
import { createDatabaseConnections, createHTTPServer, DatabaseConnection, HTTP2Server, HTTPServer, HTTPSServer, MetadataKey, Route } from '../interfaces';

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

  /** Rester config. */
  public config: ResterConfig;

  /** Views in this rester instance. */
  public readonly views: Function[] = [];
  /** Typeorm connection. */
  private connections?: DatabaseConnection[] = [];
  /** Handler types. */
  public handlers: HandlerType[] = [ExceptionHandler, SchemaHandler, RouterHandler, ParameterHandler];
  /** Zone to storage something about this instance. */
  public zone: ZoneConfig;
  /** Logger instance. */
  public readonly logger: Logger;
  /** Handler pool. */
  private pool: HandlerPool;
  /** Node.js server. */
  private server: HTTPServer | HTTP2Server | HTTPSServer;

  constructor(inputConfig: Partial<ResterConfig> = {}) {
    // config
    this.config = loadResterConfig(inputConfig);
    // views
    // connections
    // handlers
    // zone
    this.zone = this.config.zone;
    // logger
    Logger.setLogger(new Logger({
      name: 'rester',
      level: this.config.logger.level,
      stdout: process.stdout,
      stderr: process.stderr,
      fileout: this.config.logger.outputLog,
      fileerr: this.config.logger.errorLog,
    }));
    this.logger = Logger.getLogger('rester')!;
    // handler pool
    this.pool = new HandlerPool(this);
    // server
    this.server = createHTTPServer(this.pool.process.bind(this.pool));
  }

  /**
   * Register all views.
   */
  private async registerViews() {
    Injector.storage
      .forEach((value, key) => value.type === InjectedType.VIEW && this.views.push(key));
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
   * Register all controller, after database connected.
   */
  private async registerControllers() {
    Injector
      .list()
      .filter(({ type }) => type === InjectedType.CONTROLLER)
      .map(({ instance }) => instance)
      .forEach(instance => {
        try {
          typeof instance.init === 'function' && instance.init();
        } catch (error) {
          this.logger.warn(`Instance init method call failed: ${instance.name}`);
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
      const { port, host } = address;
      const protocol = address.protocol === 'HTTP' ? 'http' : 'https';
      this.server.listen(port, host, async () => this.logger.info(`Server online, listening on: ${protocol}://${host}:${port}`));
    }
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
   * Add entities to special database.
   *
   * @param connectionName connection name for database
   * @param entities database entity
   * @returns {Rester} rester instance
   */
  addEntities(connectionName: string, ...entities: any[]): Rester {
    const config = this.config.databases
      .find(({ name }) => name === connectionName);
    if (!config) {
      throw new ServerException(`No such connection named ${connectionName}`);
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
    await this.registerViews();
    await this.registerHandlers();
    await this.registerDatabases();
    await this.registerControllers();
    await this.registerServers();
    typeof callback === 'function' && await callback();
    typeof callback === 'string' && this.logger.info(callback);
    return this;
  }

}