import { SecureServerOptions } from 'http2';
import { ServerOptions } from 'https';
import KoaStatic from 'koa-static';
import { Options } from 'redisession';
import { ConnectionOptions } from 'typeorm';
import { AllPaths } from './router';

/** KBS address. */
export interface KBSAddress {
  /** KBS portocol. */
  portocol?: 'HTTP' | 'HTTPS' | 'HTTP2';
  /** KBS host. */
  host?: string;
  /** KBS port. */
  port?: number;
  /** KBS ssl options, only required in secure server (HTTPS or HTTP2). */
  ssl?: ServerOptions | SecureServerOptions;
}

/** KBS database connection, if undefined it will disable the typeorm connection. */
export type KBSDatabase = ConnectionOptions;

/** KBS router, if undefined it will disable the koa router. */
export interface KBSRouter {
  /** All paths of KBS router. */
  paths: AllPaths;
  /** Static files root dir path. */
  static?: {
    path: string;
    options?: KoaStatic.Options
  };
  /** API version, prefix of all paths. */
  version?: string;
}

/** RediSession options. */
export type KBSSession = Options;

/** KBS config. */
export interface KBSConfig {
  /** KBS address. */
  address?: KBSAddress;
  /** KBS database connection, if undefined it will disable the typeorm connection. */
  database?: KBSDatabase;
  /** KBS router, if undefined it will disable the koa router. */
  router?: KBSRouter;
  /** KBS session, if undefined it will disable the KBS session. */
  session?: KBSSession;
}
