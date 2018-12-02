import { SecureServerOptions } from 'http2';
import { ServerOptions } from 'https';
import { ConnectionOptions } from 'typeorm';
import { AllPaths } from './router';

/** KBS config. */
export interface KBSConfig {
  /** KBS address. */
  address: {
    /** KBS portocol. */
    portocol: 'HTTP' | 'HTTPS' | 'HTTP2';
    /** KBS host. */
    host?: string;
    /** KBS port. */
    port?: number;
    /** KBS ssl options, only need in secure server (HTTPS and HTTP2). */
    ssl?: ServerOptions | SecureServerOptions;
  };
  /** KBS database connection, if undefined it will disable the typeorm connection. */
  database?: {
    /** Use the ormconfig.json file to connect database. */
    ormconfig?: boolean;
    /** Use your own options to connect database. */
    options?: ConnectionOptions;
  };
  /** KBS router, if undefined it will disable the koa router. */
  router?: {
    /** All paths of KBS router. */
    paths: AllPaths;
    /** API version, prefix of all paths. */
    version?: string;
  };
  /** KBS session, if undefined it will disable the koa session. */
  session?: {
    /** KBS session keys, encrypted cookies. */
    keys: string[];
  };
}
