import { Redion } from '@iinfinity/redion';
import { readFileSync } from 'fs';
import HTTP from 'http';
import HTTP2 from 'http2';
import HTTPS from 'https';
import Koa from 'koa';
import 'koa-body';
import KoaStatic from 'koa-static';
import { createConnection, createConnections } from 'typeorm';
import { logger } from '.';
import { Middlewares, Option } from './@types';
import { Router } from './middleware';

/**
 * Rester, a RESTful server.
 */
export class Rester {

  /** Application. */
  private application: Koa;
  /** Config. */
  private option: Option;
  /** Server. */
  private server: HTTP.Server | HTTP2.Http2SecureServer | HTTPS.Server;
  /** Session. */
  private session?: Redion;
  /** Router. */
  private router?: Router;

  /**
   * Create a Rester Server.
   *
   * @param {Option} option Rester server option.
   */
  constructor(option?: Option) {

    // Load config from profile.
    try {
      // Default in development mode, use `npm start prod` to enable production mode.
      const prod = Boolean(process.argv.find(v => v === 'prod'));
      logger.info(`Rester is on ${prod ? 'production' : 'development'} mode.`);
      const json: Option = JSON.parse(readFileSync(prod ? 'server.config.json' : 'server.config.dev.json').toString());
      // The profile will cover config.
      this.option = Object.assign({}, json, option);
      for (const key in this.option) {
        if (this.option.hasOwnProperty(key)) {
          Object.assign(this.option[key], json[key]);
        }
      }
    } catch (err) {
      logger.info(`Profile server.config.json not found or cannot be parse, disable it.`);
      this.option = option || {};
    }

    // Init Rester Server.
    this.application = new Koa();

    // Create server.
    if (this.option.address) { // Select portocol.
      switch (this.option.address.portocol) {
        case 'HTTP':
          this.server = HTTP.createServer(this.application.callback());
          break;
        case 'HTTP2':
          this.server = HTTP2.createSecureServer(this.option.address.ssl || {}, this.application.callback());
          break;
        case 'HTTPS':
          this.server = HTTPS.createServer(this.option.address.ssl || {}, this.application.callback());
          break;
        default:
          this.server = HTTP.createServer(this.application.callback());
          logger.warn(`Unkoown portocol or unset portocol: ${this.option.address.portocol}, use default portocol HTTP.`);
          break;
      }
      this.application.proxy = Boolean(this.option.address.proxy);
    } else { // Default to HTTP.
      this.server = HTTP.createServer(this.application.callback());
      logger.info(`Use default portocol HTTP.`);
    }

    // Create database connection or not.
    if (this.option.database) {
      if (this.option.database instanceof Array) {
        createConnections(this.option.database);
      } else {
        createConnection(this.option.database);
      }
    } else {
      logger.warn(`Database service not provided.`);
    }

    // Use session middleware or not.
    if (this.option.session) {
      this.session = new Redion(this.option.session);
      this.application.keys = this.option.session.secert;
      this.use({
        'Redion': this.session.ware
      });
    } else {
      logger.warn(`Session service not provided.`);
    }

    // Config router or not.
    if (this.option.router) {
      this.router = new Router(this.option.router);
      this.use({
        'Koa Router': this.router.ware
      });
      if (this.option.router.static && this.option.router.static.path) {
        this.use({
          'Koa Static': KoaStatic(this.option.router.static.path, this.option.router.static.option)
        });
        logger.info(`Static resource path: ${this.option.router.static.path}.`);
      } else {
        logger.info(`Static server service not provided.`);
      }
    } else {
      logger.warn(`Routing service not provided.`);
    }

    // Enable development / production mode.
    if (this.option.environment === 'prod') {
      logger.info('Enable production mode.');
    } else {
      logger.debug(`Enable development mode, set config.environment to 'prod' to enable production mode.`);
    }

  }

  /**
   * Use middlewares.
   *
   * @param {Middleware[]} middlewares Middlewares.
   * @returns {Rester} This server.
   */
  public use(middlewares: Middlewares): Rester {
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
   * @returns {Promise<Rester>} This server.
   */
  public async listen(host?: string, port?: number): Promise<Rester> {
    this.server.listen(
      port = port || (this.option.address && this.option.address.port) || 8080,
      host = host || (this.option.address && this.option.address.host) || '0.0.0.0',
      () => logger.info(`Rester online, listens on ${host}:${port}.`)
    );
    return this;
  }

  /**
   * @returns {Koa} The core instance, Koa.
   */
  public get core(): Koa {
    return this.application;
  }

}

export default Rester;
