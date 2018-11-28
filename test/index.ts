import { AllPaths, Server } from '../dist';
import { User } from './entity';
import postPaths from './post';

const database: boolean = true;
const host: string = 'localhost';
const keys: string[] = ['your', 'secret', 'keys'];
const paths: AllPaths = {
  GET: {
    '/': async (c, next) => {
      const result = User.find();
      c.body = {
        status: result ? true : false,
        data: result
      };
      next();
    }
  },
  POST: postPaths
};
const port: number = 8080;
const type: 'HTTP' | 'HTTPS' | 'HTTP2' = 'HTTP';

const server: Server = new Server({
  database,
  host,
  keys,
  paths,
  port,
  type
});
