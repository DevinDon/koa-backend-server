import { logger } from '@iinfinity/logger';
import { readFileSync } from 'fs';
import HTTP from 'http';
import HTTP2 from 'http2';
import HTTPS from 'https';
import Koa, { Middleware } from 'koa';
import KoaStatic from 'koa-static';
import { RediSession } from 'redisession';
import { KBSConfig } from '../@types';
import { Database } from '../database';
import { Router } from '../middleware';

/**
 * KBS, Koa Backend Server.
 */
export class Server {

  /** Koa. */
  private application: Koa;
  /** Config. */
  private config: KBSConfig;
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
   *
   * @param {KBSConfig} config KBS Server options.
   */
  constructor(config?: KBSConfig) {
    // Load config from profile.
    try {
      // Default in development mode, use `npm start prod` to enable production mode.
      const prod = Boolean(process.argv.find(v => v === 'prod'));
      logger.info(`Koa Backend Server is on ${prod ? 'production' : 'development'} mode.`);
      const json: KBSConfig = JSON.parse(readFileSync(prod ? 'server.config.json' : 'server.config.dev.json').toString());
      // The profile will cover config.
      this.config = Object.assign({}, json, config);
      for (const key in this.config) {
        if (this.config.hasOwnProperty(key)) {
          Object.assign(this.config[key], json[key]);
        }
      }
    } catch (err) {
      logger.info(`Profile server.config.json not found or cannot be parse, disable it. Detail: ${err}`);
      this.config = config || {};
    }
    // Init KBS.
    this.init();
  }

  /**
   * Init KBS.
   *
   * @returns {Promise<void>} Void.
   */
  private async init(): Promise<void> {

    this.application = new Koa();
    // Create server.
    if (this.config.address) { // Select portocol.
      switch (this.config.address.portocol) {
        case 'HTTP':
          this.server = HTTP.createServer(this.application.callback());
          break;
        case 'HTTP2':
          this.server = HTTP2.createSecureServer(this.config.address.ssl || {}, this.application.callback());
          break;
        case 'HTTPS':
          this.server = HTTPS.createServer(this.config.address.ssl || {}, this.application.callback());
          break;
        default:
          this.server = HTTP.createServer(this.application.callback());
          logger.warn(`Unkoown portocol or unset portocol: ${this.config.address.portocol}, use default portocol HTTP`);
          break;
      }
      this.app.proxy = Boolean(this.config.address.proxy);
    } else { // Default to HTTP.
      this.server = HTTP.createServer(this.application.callback());
      logger.info(`Use default portocol HTTP`);
    }

    // Create database connection or not.
    if (this.config.database) {
      this.database = new Database(this.config.database);
    } else {
      logger.warn(`Database not connected.`);
    }

    // Use session middleware or not.
    if (this.config.session) {
      this.session = new RediSession(this.application, this.config.session);
      this.use(this.session.ware);
    } else {
      logger.warn(`Session service not provided.`);
    }

    // Config router or not.
    if (this.config.router) {
      this.router = new Router(this.config.router.paths, this.config.router.version);
      this.use(this.router.ware);
      if (this.config.router.static && this.config.router.static.path) {
        this.use(KoaStatic(this.config.router.static.path, this.config.router.static.options));
        logger.info(`Static resource path: ${this.config.router.static.path}`);
      } else {
        logger.info(`Static server service not provided.`);
      }
    } else {
      logger.warn(`Routing service not provided.`);
    }

  }

  /**
   * Use middlewares.
   *
   * @param {Middleware[]} middlewares Middlewares.
   * @returns {Server} This server.
   */
  public use(...middlewares: Middleware[]): Server {
    for (const middleware of middlewares) {
      this.application.use(middleware);
      logger.info(`Use middleware: ${middleware.name || middleware.toString()}`);
    }
    return this;
  }

  /**
   * Listening on some where.
   *
   * @param {number} port Listening port, default to 8080.
   * @param {string} host The listening host, default to 0.0.0.0.
   * @returns {Promise<Server>} This server.
   */
  public async listen(host?: string, port?: number): Promise<Server> {
    if (this.database) {
      await this.database.connect();
    }
    this.server.listen(
      port = port || (this.config.address && this.config.address.port) || 8080,
      host = host || (this.config.address && this.config.address.host) || '0.0.0.0',
      () => logger.info(`Server online, address is ${host}:${port}`)
    );
    return this;
  }

  /**
   * @returns {Koa} This Koa instance.
   */
  public get app(): Koa {
    return this.application;
  }

}

export default Server;
