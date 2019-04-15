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

function baseService(method: PathMap) {
  return (path: string) => {
    return (target: any, name: string, descriptor: PropertyDescriptor) => {
      method.set(path, name);
    };
  };
}

export function Service(path: string = '') {
  return (target: any) => {
    // TODO: DI feature
    const service = new target();
    for (const method in Method) {
      if (TEMP.hasOwnProperty(method)) {
        const element = TEMP[method as Method];
        element.forEach((v, k) => {
          ROUTERMAP[method as Method].set(path + k, service[v].bind(service));
        });
        element.clear();
      }
    }
  };
}

export const Post = baseService(TEMP.POST);
export const Get = baseService(TEMP.GET);

function Session() {
  return (target: any, name: string, index: number) => {
    const paramsTypes: Array<Function> = Reflect.getMetadata('design:paramtypes', target, name);
    logger.debug(name, index, paramsTypes);
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
