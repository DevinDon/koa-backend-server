import { readFileSync } from 'fs';
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

    try {
      // Load config from profile.
      const json: KBSConfig = JSON.parse(readFileSync('server.config.json').toString());
      // The profile will cover config.
      config = Object.assign({}, config, json);
    } catch (err) {
      console.log(`${now()}\tProfile server.config.json not found or cannot be parse, disable it, detail: ${err}`);
    }

    // Create server.
    if (config.address) { // Select portocol.
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
          console.log(`${now()}\tUnkoown portocol or unset portocol: ${config.address.portocol}, use default portocol HTTP`);
          break;
      }
    } else { // Default to HTTP.
      this.server = HTTP.createServer(this.application.callback());
      console.log(`${now()}\tUse default portocol HTTP`);
    }

    // Create database connection or not.
    if (config.database) {
      this.database = new Database(config.database.options);
      console.log(`${now()}\tDatabase connected.`);
    } else {
      console.log(`${now()}\tDatabase not connected.`);
    }

    // Use session middleware or not.
    if (config.session) {
      this.session = new RediSession(this.application, config.session);
      this.use(this.session.ware);
    } else {
      console.log(`${now()}\tSession service not provided.`);
    }

    // Config router or not.
    if (config.router) {
      this.router = new Router(config.router.paths, config.router.version);
      this.use(this.router.ware);
      if (config.router.static && config.router.static.path) {
        this.use(KoaStatic(config.router.static.path, config.router.static.options));
        console.log(`${now()}\tStatic resource path: ${config.router.static.path}`);
      } else {
        console.log(`${now()}\tStatic server service not provided.`);
      }
    } else {
      console.warn(`${now()}\tRouting service not provided.`);
    }
  }

  /**
   * Use middlewares.
   * @param {Middleware[]} middlewares Middlewares.
   * @returns {Server} This server.
   */
  public use(...middlewares: Middleware[]): Server {
    for (const middleware of middlewares) {
      this.application.use(middleware);
      console.log(`${now()}\tUse middleware: ${middleware.name || middleware.toString()}`);
    }
    return this;
  }

  /**
   * Listening on some where.
   * @param {number} port Listening port, default to 80.
   * @param {string} host The listening host, default to 0.0.0.0.
   * @returns {HTTP.Server | HTTP2.Http2SecureServer | HTTPS.Server} This server instance.
   */
  public listen(host?: string, port?: number): HTTP.Server | HTTP2.Http2SecureServer | HTTPS.Server {
    return this.server.listen(
      port = port || (this.config.address && this.config.address.port) || 80,
      host = host || (this.config.address && this.config.address.host) || '0.0.0.0',
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
