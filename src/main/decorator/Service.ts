import 'reflect-metadata';

import { logger } from '@iinfinity/logger';
import { Session } from '@iinfinity/redion';

enum Method {
  DELETE = 'DELETE',
  GET = 'GET',
  HEAD = 'HEAD',
  OPTIONS = 'OPTIONS',
  PATCH = 'PATCH',
  POST = 'POST',
  PUT = 'PUT'
}

type PathMap = Map<string, any>;

type RouterMap = {
  [key in Method]: PathMap;
};

const ROUTERMAP: RouterMap = {
  DELETE: new Map(),
  GET: new Map(),
  HEAD: new Map(),
  OPTIONS: new Map(),
  PATCH: new Map(),
  POST: new Map(),
  PUT: new Map()
};

const TEMP: RouterMap = {
  DELETE: new Map(),
  GET: new Map(),
  HEAD: new Map(),
  OPTIONS: new Map(),
  PATCH: new Map(),
  POST: new Map(),
  PUT: new Map()
};

export function Service(path: string = ''): ClassDecorator {
  return target => {
    Reflect.defineMetadata('ROUTER:PATH', path, target);
  };
}

function baseService(method: PathMap) {
  return (path: string): MethodDecorator => {
    return (target, key, descriptor) => {
      Reflect.defineMetadata('ROUTER:PATH', path, descriptor.value!);
      Reflect.defineMetadata('ROUTER:METHOD', method, descriptor.value!);
    };
  };
}

export const Post = baseService(TEMP.POST);
export const Get = baseService(TEMP.GET);

function Session(): ParameterDecorator {
  return (target, key, index) => {

  };
}

@Service('/user')
class UserService {

  private test: string;

  constructor() {
    this.test = 'test';
  }

  @Post('/login')
  login(
    @Session() session: Session
  ) {
    logger.info(`Login, ${this.test}.`);
    return true;
  }

  @Post('/logout')
  logout() {
    logger.info(`Logout, ${this.test}`);
    return true;
  }

}

@Service()
class MapService {

  @Get('/sign/in')
  signIn() {
    logger.info(`Sign in.`);
    return true;
  }

  @Get('/sign/up')
  signUp() {
    logger.info(`Sign up.`);
    return true;
  }

}

function routeTo(method: Method, path: string) {
  if (ROUTERMAP[method].has(path)) {
    return (ROUTERMAP[method].get(path) as Function)();
  } else {
    return { code: 404, message: `string ${path} not found.` };
  }
}

logger.debug(routeTo(Method.POST, '/user/login'));
