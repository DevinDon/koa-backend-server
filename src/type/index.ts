import { IMiddleware } from 'koa-router';
import { Middleware } from 'koa-compose';
import { Files } from 'formidable';
import { Context, Request } from 'koa';
import { ServerOptions } from 'https';
import { SecureServerOptions } from 'http2';

/** Router path 中间件, 包含 Session 和 Post data. */
export type AMiddleware = Middleware<AContext>;

interface AContext extends Context {
  request: ARequest;
}

interface ARequest extends Request {
  body: any;
  files: Files;
}

/** KBS config. */
export interface KBSConfig {
  /** Type of KBS, default to 'HTTP'. */
  type?: 'HTTP' | 'HTTPS' | 'HTTP2';
  /** Cookie & Session secret keys. */
  keys?: string[];
  /** HTTPS / HTTP2 options. */
  options?: ServerOptions | SecureServerOptions;
  /** Router paths. */
  paths?: AllPaths;
  /** Port. */
  port?: number;
  /** Host. */
  host?: string;
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
