import { AllPaths, Server } from '../dist';
import { User } from './entity';
import postPaths from './post';

const database: boolean = true;

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

const host: string = 'localhost';
const port: number = 80;
const type: 'HTTP' | 'HTTPS' | 'HTTP2' = 'HTTP';

const server: Server = new Server({
  database,
  host,
  keys,
  paths,
  port,
  type
});
