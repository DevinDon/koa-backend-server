import { AllPaths, Server } from '../src';
import postPaths from './post';

const database: boolean = false;

const keys: string[] = ['your', 'secret', 'keys'];

const paths: AllPaths = {
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
  type,
  version: 'v1'
});
