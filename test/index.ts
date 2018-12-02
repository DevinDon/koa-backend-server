import { AllPaths, Server } from '../src';
import postPaths from './post';

const server = new Server({
  address: {
    portocol: 'HTTP'
  },
  // database: {
  //   ormconfig: true
  // },
  router: {
    paths: {
      POST: postPaths
    },
    version: 'v1'
  },
  session: {
    keys: ['test', 'keys']
  }
});
