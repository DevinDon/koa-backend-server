import { logger } from '@iinfinity/logger';
import { Redion } from '@iinfinity/redion';
import { readFileSync } from 'fs';
import HTTP from 'http';
import HTTP2 from 'http2';
import HTTPS from 'https';
import Koa, { Middleware } from 'koa';
import KoaStatic from 'koa-static';
import { Middlewares, ServerConfig } from '../@types';
import { Database } from '../database';
import { Router } from '../middleware';

/**
 * Rester, a RESTful server.
 */
export class Server {

  /** Koa. */
  private application: Koa;
  /** Config. */
  private config: ServerConfig;
  /** Server. */
  private server: HTTP.Server | HTTP2.Http2SecureServer | HTTPS.Server;
  /** Session. */
  private session?: Redion;
  /** Router. */
  private router?: Router;
  /** Database. */
  private database?: Database;

  /**
   * Create a Rester Server.
   *
   * @param {ServerConfig} config Rester Server options.
   */
  constructor(config?: ServerConfig) {

    // Load config from profile.
    try {
      // Default in development mode, use `npm start prod` to enable production mode.
      const prod = Boolean(process.argv.find(v => v === 'prod'));
      logger.info(`Rester is on ${prod ? 'production' : 'development'} mode.`);
      const json: ServerConfig = JSON.parse(readFileSync(prod ? 'server.config.json' : 'server.config.dev.json').toString());
      // The profile will cover config.
      this.config = Object.assign({}, json, config);
      for (const key in this.config) {
        if (this.config.hasOwnProperty(key)) {
          Object.assign(this.config[key], json[key]);
        }
      }
    } catch (err) {
      logger.info(`Profile server.config.json not found or cannot be parse, disable it.`);
      this.config = config || {};
    }

    // Init Rester Server.
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
          logger.warn(`Unkoown portocol or unset portocol: ${this.config.address.portocol}, use default portocol HTTP.`);
          break;
      }
      this.app.proxy = Boolean(this.config.address.proxy);
    } else { // Default to HTTP.
      this.server = HTTP.createServer(this.application.callback());
      logger.info(`Use default portocol HTTP.`);
    }

    // Create database connection or not.
    if (this.config.database) {
      this.database = new Database(this.config.database);
    } else {
      logger.warn(`Database service not provided.`);
    }

    // Use session middleware or not.
    if (this.config.session) {
      this.session = new Redion(this.application, this.config.session);
      this.use({
        'Redion': this.session.ware
      });
    } else {
      logger.warn(`Session service not provided.`);
    }

    // Config router or not.
    if (this.config.router) {
      this.router = new Router(this.config.router);
      this.use({
        'Koa Router': this.router.ware
      });
      if (this.config.router.static && this.config.router.static.path) {
        this.use({
          'Koa Static': KoaStatic(this.config.router.static.path, this.config.router.static.options)
        });
        logger.info(`Static resource path: ${this.config.router.static.path}.`);
      } else {
        logger.info(`Static server service not provided.`);
      }
    } else {
      logger.warn(`Routing service not provided.`);
    }

    // Enable development / production mode.
    if (this.config.environment === 'prod') {
      logger.info('Enable production mode.');
    } else {
      logger.debug(`Enable development mode, set config.environment to 'prod' to enable production mode.`);
    }

  }

  /**
   * Use middlewares.
   *
   * @param {Middleware[]} middlewares Middlewares.
   * @returns {Server} This server.
   */
  public use(middlewares: Middlewares): Server {
    for (const name in middlewares) {
      if (middlewares.hasOwnProperty(name)) {
        const middleware = middlewares[name];
        logger.info(`Use middleware: ${name}.`);
        this.application.use(middleware);
      }
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
    if ((!this.database) || (this.database && await this.database.connect())) {
      this.server.listen(
        port = port || (this.config.address && this.config.address.port) || 8080,
        host = host || (this.config.address && this.config.address.host) || '0.0.0.0',
        () => logger.info(`Rester online, listens on ${host}:${port}.`)
      );
    }
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
