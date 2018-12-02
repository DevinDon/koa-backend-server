import { AMiddleware, now, RouterPaths } from '../../src';
import { User } from '../entity';
import test from './test';

const index: AMiddleware = async (c, next) => {
  // const request = c.request.body;
  // const insert = await User.insert({ name: now(), password: 'any' });
  // const data = await User.find();
  c.body = {
    status: true,
    data: 'working'
  };
  next();
};

const test1: AMiddleware = async (c, next) => { c.body = { wtf: 'wtf???' }; next(); };

export const postPaths: RouterPaths = {
  '/test': {
    path: '/test',
    ware: test,
    cors: {
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Allow-Methods': ['POST', 'OPTIONS', 'GET'],
      'Access-Control-Allow-Origin': '*'
    }
  },
  'all': {
    path: /\/.*/,
    ware: index
  }
};

export default postPaths;
