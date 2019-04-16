// import { RouterPaths, Rester, Option } from '@iinfinity/rester';
import { Option, Rester, RouterPaths } from '../../main'; // use above import statement in your workspace

/** Router path. */
const GET: RouterPaths = {
  '/ get index': {
    path: '/',
    ware: async (c, next) => {
      next();
      c.body = 'Hello, world!';
    }
  }
};

/** Simple option. */
const simpleConfig: Option = {
  router: {
    paths: { GET }
  }
};

const server = new Rester(simpleConfig);

server.listen();
