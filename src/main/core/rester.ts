import { Logger } from '@iinfinity/logger';
import { ResterORM } from '@rester/orm';
import { MetadataKey } from '../constants';
import { loadResterConfig, ResterConfig } from '../core/rester.config';
import { ControllerType, HandlerType, ViewType } from '../decorators';
import { ServerException } from '../exceptions';
import { BaseHandler, ExceptionHandler, HandlerPool, LoggerHandler, ParameterHandler, RouterHandler, SchemaHandler } from '../handlers';
import { createHTTPServer, HTTP2Server, HTTPServer, HTTPSServer, Mapping, Route } from '../interfaces';
import { BaseController } from './base.controller';
import { BaseView } from './base.view';
import { ResterModule } from './rester.module';

export const DEFAULT_HANDLERS = [
  ExceptionHandler,
  SchemaHandler,
  RouterHandler,
  ParameterHandler,
  LoggerHandler,
];

export type ResterInitConfig = Partial<ResterConfig> & Partial<{
  handlers: typeof BaseHandler[],
  modules: ResterModule[],
}>;

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

  /** Modules. */
  public readonly modules: ResterModule[];
  /** View classes. */
  public readonly views: { target: ViewType, prefix: string, instance: BaseView }[];
  /** Controller classes. */
  public readonly controllers: { target: ControllerType, instance: BaseController }[];
  /** Rester ORM. */
  private orm: ResterORM;
  /** Handler types. */
  public handlers: HandlerType[];
  /** Logger instance. */
  public readonly logger: Logger;
  /** Handler pool. */
  private pool: HandlerPool;
  /** Node.js server. */
  public readonly servers: (HTTPServer | HTTP2Server | HTTPSServer)[];

  constructor({ handlers = DEFAULT_HANDLERS, modules = [], ...config }: ResterInitConfig = {}) {
    // modules
    this.modules = modules;
    // config
    this.config = loadResterConfig(config);
    this.modules
      .map(m => m.entities ?? [])
      .filter(entities => entities.length > 0)
      .forEach(entities => {
        const connection = typeof entities[0] === 'string' ? entities[0] : this.config.databases[0].database;
        typeof entities[0] === 'string' && entities.splice(0, 1);
        const config = this.config.databases
          .find(({ database }) => database === connection);
        if (!config) {
          throw new ServerException(`No such connection named ${connection}`);
        }
        (config as any)['entities'] = [...new Set([...(config.entities || []), ...entities])];
      });
    // views
    this.views = modules
      .map(m => m.views ?? [])
      .flat()
      .map(view => Reflect.getMetadata(MetadataKey.View, view))
      ?? [];
    // controllers
    this.controllers = modules
      .map(m => m.controllers ?? [])
      .flat()
      .map(controller => Reflect.getMetadata(MetadataKey.Controller, controller))
      ?? [];
    // orm
    this.orm = new ResterORM(this.config.databases);
    // handlers
    this.handlers = handlers;
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
    // servers
    this.servers = [];
  }

  /**
   * Register all databases or exception, before controller init.
   *
   * @throws {ServerException} throw a server exception
   */
  private async registerDatabases() {
    try {
      this.logger.info('Database connecting...');
      await this.orm.bootstrap();
      this.logger.info('Database connected');
    } catch (error) {
      this.logger.error('Database connect failed, reason:', error);
      throw new ServerException(error);
    }
  }

  /**
   * Register all views.
   */
  private async registerViews() {
    // call init
    this.views
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
        // define metadata: key = MetadataKey.Route, value = routes, on = class
        Reflect.defineMetadata(MetadataKey.Route, routes, target);
        // set static properties
        target.prototype.logger = Logger.getLogger('rester');
        target.prototype.rester = this;
        // call view.init()
        try {
          typeof instance.init === 'function' && instance.init();
        } catch (error) {
          this.logger.warn(`View instance init method call failed: ${instance.constructor.name}`);
        }
      });
    this.logger.info('Views initial succeed');
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
            const routes: Route[] = Reflect.getMetadata(MetadataKey.Route, view) || [];
            return routes.map(route => route.handlers).flat();
          },
        ).flat(),
      ),
    ].forEach(handler => handler.init(this));
    // freeze it to keep safe
    Object.freeze(this.handlers);
    this.logger.info('Handlers initial succeed');
  }

  /**
   * Register all controller, after database connected.
   */
  private async registerControllers() {
    // call init & inject properties
    this.controllers
      .forEach(({ target, instance }) => {
        target.prototype.logger = Logger.getLogger('rester');
        target.prototype.rester = this;
        try {
          typeof instance.init === 'function' && instance.init();
        } catch (error) {
          this.logger.warn(`Controller instance init method call failed: ${instance.constructor.name}`);
        }
      });
    this.logger.info('Controllers initial succeed');
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
    this.logger.info('Servers initial succeed');
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
