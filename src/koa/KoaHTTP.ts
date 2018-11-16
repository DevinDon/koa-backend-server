import { createServer, Server } from 'http';
import Koa from 'koa';
import { now } from '../util';

export class KoaHTTP extends Koa {

  constructor() {
    super();
  }

  listening(port: number = 80): Server {
    const server = createServer(this.callback());
    return server.listen(port, () => console.log(`${now()}: HTTP Koa Server online, port: ${port}`));
  }

}

export default KoaHTTP;
