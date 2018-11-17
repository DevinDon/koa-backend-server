import { IMiddleware } from 'koa-router';
import { Middleware } from 'koa-compose';
import { Files } from 'formidable';
import { Context, Request } from 'koa';

export type AMiddleware = Middleware<AContext>;

interface AContext extends Context {
  request: ARequest;
}

interface ARequest extends Request {
  body: any;
  files: Files;
}

/** 路径名: 路径处理方式. */
export interface RouterPaths {
  [index: string]: IMiddleware | AMiddleware | any;
}

/** 所有的路由路径. */
export interface AllPaths {
  DELETE?: RouterPaths;
  GET?: RouterPaths;
  HEAD?: RouterPaths;
  OPTIONS?: RouterPaths;
  PATCH?: RouterPaths;
  POST?: RouterPaths;
  PUT?: RouterPaths;
}
