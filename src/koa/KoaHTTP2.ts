import { createSecureServer, Http2SecureServer, SecureServerOptions } from 'http2';
import Koa from 'koa';
import { now } from '../util';

export class KoaHTTP2 extends Koa {

  constructor() {
    super();
  }

  listening(options: SecureServerOptions = {}, port: number = 443): Http2SecureServer {
    const server = createSecureServer(options, this.callback());
    return server.listen(port, () => console.log(`${now()}: HTTP/2 Koa Server online, port: ${port}`));
  }

}

export default KoaHTTP2;
