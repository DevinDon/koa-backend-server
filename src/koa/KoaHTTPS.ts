import { createServer, Server, ServerOptions } from 'https';
import Koa from 'koa';
import { now } from '../util';

export class KoaHTTPS extends Koa {

  constructor() {
    super();
  }

  listening(options: ServerOptions = {}, port: number = 443): Server {
    const server = createServer(options, this.callback());
    return server.listen(port, () => console.log(`${now()}: HTTPS Koa Server online, port: ${port}`));
  }

}

export default KoaHTTPS;
