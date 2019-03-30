import { RouterPaths, Server, ServerConfig } from '../../main'; // Replace it with '@iinfinity/rester' on your workspace.

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
