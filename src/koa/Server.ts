import HTTP from 'http';
import HTTP2 from 'http2';
import HTTPS from 'https';
import Koa, { Middleware } from 'koa';
import { now } from '../util';
import { Router, Session } from '../middleware';
import { AllPaths } from '../type';

/** Koa Server. */
export class Server {

  /** Koa. */
  private application: Koa;
  /** Server. */
  private server: HTTP.Server | HTTP2.Http2SecureServer | HTTPS.Server;

  /**
   * 创建一个指定类型的服务器.
   * @param type 服务器类型, HTTP | HTTPS | HTTP2.
   */
  constructor(type: 'HTTP' | 'HTTP2' | 'HTTPS' = 'HTTP', options?: HTTP2.ServerOptions | HTTPS.ServerOptions) {
    this.application = new Koa();
    switch (type) {
      case 'HTTP':
        this.server = HTTP.createServer(this.application.callback());
        break;
      case 'HTTP2':
        this.server = HTTP2.createSecureServer(<HTTP2.ServerOptions>options, this.application.callback());
        break;
      case 'HTTPS':
        this.server = HTTPS.createServer(<HTTPS.ServerOptions>options, this.application.callback());
        break;
      default:
        this.server = HTTP.createServer(this.application.callback());
        console.error(`No such server type: ${type}, use default HTTP server.`);
        break;
    }
  }

  /**
   * Default setting.
   * @param paths Router paths.
   * @param keys Session Key.
   * @param port HTTP(2/S) port.
   */
  public default(paths: AllPaths = {}, keys: string[] = ['default'], port: number = 80): Server {
    const session = new Session(this.application, keys);
    const router = new Router(paths);
    this.use(session.ware, router.ware);
    this.listen(port);
    return this;
  }

  /**
   * 使用 Koa 中间件.
   * @param middlewares Koa 中间件.
   */
  public use(...middlewares: Middleware[]): void {
    for (const middleware of middlewares) {
      this.application.use(middleware);
      console.log(`${now()}: Use middleware: ${middleware.name || middleware.toString()}.`);
    }
  }

  /**
   * 服务器开启监听.
   * @param port 监听端口.
   * @param host 监听主机, 默认为 localhost.
   * @returns 返回该服务器实例.
   */
  public listen(port: number, host: string = 'localhost'): HTTP.Server | HTTP2.Http2SecureServer | HTTPS.Server {
    return this.server.listen(port, host, () => console.log(`${now()}: Server online, address is ${host}:${port}.`));
  }


  public get app(): Koa {
    return this.application;
  }


}

export default Server;
