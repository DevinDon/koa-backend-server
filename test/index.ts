import { Server } from '../dist';
import postPaths from './post';

const server = new Server({
  router: {
    paths: {
      POST: postPaths
    },
    version: 'v1'
  }
});

// Start listening.
server.listen();
