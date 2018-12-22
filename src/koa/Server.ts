import HTTP from 'http';
import HTTP2 from 'http2';
import HTTPS from 'https';
import Koa, { Middleware } from 'koa';
import KoaStatic from 'koa-static';
import { RediSession } from 'redisession';
import { Database } from '../database';
import { Router } from '../middleware';
import { KBSConfig } from '../type';
import { now } from '../util';

/**
 * KBS, Koa Backend Server.
 */
export class Server {

  /** Koa. */
  private application: Koa;
  /** Server. */
  private server: HTTP.Server | HTTP2.Http2SecureServer | HTTPS.Server;
  /** Session. */
  private session?: RediSession;
  /** Router. */
  private router?: Router;
  /** Database. */
  private database?: Database;

  /**
   * Create a KBS, Koa Backend Server.
   * @param {KBSConfig} config KBS Server options.
   */
  constructor(private config: KBSConfig) {
    this.application = new Koa();
    switch (config.address.portocol) {
      case 'HTTP':
        this.server = HTTP.createServer(this.application.callback());
        break;
      case 'HTTP2':
        this.server = HTTP2.createSecureServer(config.address.ssl || {}, this.application.callback());
        break;
      case 'HTTPS':
        this.server = HTTPS.createServer(config.address.ssl || {}, this.application.callback());
        break;
      default:
        this.server = HTTP.createServer(this.application.callback());
        console.log(`${now()}\tNo such portocol or unset portocol: ${config.address.portocol}, use default portocol HTTP`);
        break;
    }
    if (config.database) {
      if (config.database.ormconfig) {
        this.database = new Database();
      } else if (config.database.options) {
        this.database = new Database(config.database.options);
      } else {
        console.warn(`There is no connection has been connected.`);
      }
    }
    if (config.session) {
      this.session = new RediSession(this.application, config.session);
      this.use(this.session.ware);
    }
    if (config.router) {
      this.router = new Router(config.router.paths, config.router.version);
      this.use(this.router.ware);
      if (config.router.static) {
        this.use(KoaStatic(config.router.static.path, config.router.static.options));
      }
    }
    // this.listen(config.address.host, config.address.port);
  }

  /**
   * Use middlewares.
   * @param {Middleware[]} middlewares Middlewares.
   * @returns {void} void.
   */
  public use(...middlewares: Middleware[]): void {
    for (const middleware of middlewares) {
      this.application.use(middleware);
      console.log(`${now()}\tUse middleware: ${middleware.name || middleware.toString()}`);
    }
  }

  /**
   * Listening on some where.
   * @param {number} port Listening port, default to 80.
   * @param {string} host The listening host, default to 0.0.0.0.
   * @returns {HTTP.Server | HTTP2.Http2SecureServer | HTTPS.Server} This server instance.
   */
  public listen(host?: string, port?: number): HTTP.Server | HTTP2.Http2SecureServer | HTTPS.Server {
    return this.server.listen(
      port = port || this.config.address.port || 80,
      host = host || this.config.address.host || '0.0.0.0',
      () => console.log(`${now()}\tServer online, address is ${host}:${port}`)
    );
  }

  /**
   * @returns {Koa} This Koa instance.
   */
  public get app(): Koa {
    return this.application;
  }

}

export default Server;
