import { Context } from 'koa';
import { Middleware } from 'koa-compose';
import { IMiddleware } from 'koa-router';

/** Middleware<Context> 缩写. */
export type Ware = Middleware<Context>;

/** Router Middleware. */
export type IWare = IMiddleware;

/** 路径名: 路径处理方式. */
export interface RouterPaths {
  [index: string]: IMiddleware;
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
