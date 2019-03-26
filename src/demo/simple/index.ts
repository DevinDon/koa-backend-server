import { Server, ServerConfig, RouterPaths } from '../../../dist';

const GET: RouterPaths = {
  '/ get index': {
    path: '/',
    ware: async (c, next) => {
      next();
      c.body = 'Hello, world!';
    }
  }
};

/** Simple config. */
const simpleConfig: ServerConfig = {
  router: {
    paths: { GET }
  }
};

const server = new Server(simpleConfig);

server.listen();
