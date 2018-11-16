import HTTP from 'http';
import HTTP2 from 'http2';
import HTTPS from 'https';
import Koa, { Middleware } from 'koa';
import { now } from '../util';

/** Koa Server. */
export class Server {

  /** Koa. */
  private app: Koa;
  /** Server. */
  private server: HTTP.Server | HTTP2.Http2SecureServer | HTTPS.Server;

  /**
   * 创建一个指定类型的服务器.
   * @param type 服务器类型, HTTP | HTTPS | HTTP2.
   */
  constructor(type: 'HTTP' | 'HTTP2' | 'HTTPS' = 'HTTP', options?: HTTP2.ServerOptions | HTTPS.ServerOptions) {
    this.app = new Koa();
    switch (type) {
      case 'HTTP':
        this.server = HTTP.createServer(this.app.callback());
        break;
      case 'HTTP2':
        this.server = HTTP2.createSecureServer(<HTTP2.ServerOptions>options, this.app.callback());
        break;
      case 'HTTPS':
        this.server = HTTPS.createServer(<HTTPS.ServerOptions>options, this.app.callback());
        break;
      default:
        this.server = HTTP.createServer(this.app.callback());
        console.error(`No such server type: ${type}, use default HTTP server.`);
        break;
    }
  }

  /**
   * 使用 Koa 中间件.
   * @param middlewares Koa 中间件.
   */
  public use(...middlewares: Middleware[]): void {
    for (const middleware of middlewares) {
      this.app.use(middleware);
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

}

export default Server;
