// import { Option as RedionOption } from '@iinfinity/redion';
import { SecureServerOptions } from 'http2';
import { ServerOptions } from 'https';
import { ConnectionOptions } from 'typeorm';

/** Rester Server address. */
export interface AddressOption {
  /** Rester Server portocol. */
  portocol?: 'HTTP' | 'HTTPS' | 'HTTP2';
  /** Rester Server host. */
  host?: string;
  /** Rester Server port. */
  port?: number;
  /** Rester Server ssl option, only required in secure server (HTTPS or HTTP2). */
  ssl?: ServerOptions | SecureServerOptions;
  /** Koa application is in proxy mode or not. */
  proxy?: boolean;
}

/** Rester Server database connection, if undefined it will disable the typeorm connection. */
export type DatabaseOption = ConnectionOptions | ConnectionOptions[];

/** Rester Server router, if undefined it will disable the koa router. */
export interface RouterOption {
  /** Router prefix. */
  prefix?: string;
  /** Static files root dir path. */
  static?: {
    path: string;
    option?: any
  };
}

/** RediSession option. */
export type SessionOption = any;

/** Rester Server option. */
export interface Option {
  [index: string]: any;
  /** Rester Server address. */
  address?: AddressOption;
  /** Rester Server database connection, if undefined it will disable the typeorm connection. */
  database?: DatabaseOption;
  /** Rester Server router, if undefined it will disable the koa router. */
  router?: RouterOption;
  /** Rester Server session, if undefined it will disable the Rester Server session. */
  session?: SessionOption;
  /** Enviroument: development or production. */
  environment?: 'dev' | 'prod';
}

/** Middleware with name. */
// export interface Middlewares {
//   [index: string]: Middleware;
// }
