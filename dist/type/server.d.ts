/// <reference types="node" />
import { SecureServerOptions } from 'http2';
import { ServerOptions } from 'https';
import KoaStatic from 'koa-static';
import { Options } from 'redisession';
import { ConnectionOptions } from 'typeorm';
import { AllPaths } from './router';
/** RediSession options. */
export declare type KBSSession = Options;
/** KBS address. */
export interface KBSAddress {
    /** KBS portocol. */
    portocol: 'HTTP' | 'HTTPS' | 'HTTP2';
    /** KBS host. */
    host?: string;
    /** KBS port. */
    port?: number;
    /** KBS ssl options, only need in secure server (HTTPS and HTTP2). */
    ssl?: ServerOptions | SecureServerOptions;
}
/** KBS database connection, if undefined it will disable the typeorm connection. */
export interface KBSDatabase {
    /** Use the ormconfig.json file to connect database. */
    ormconfig?: boolean;
    /** Use your own options to connect database. */
    options?: ConnectionOptions;
}
/** KBS router, if undefined it will disable the koa router. */
export interface KBSRouter {
    /** All paths of KBS router. */
    paths: AllPaths;
    /** Static files root dir path. */
    static?: {
        path: string;
        options?: KoaStatic.Options;
    };
    /** API version, prefix of all paths. */
    version?: string;
}
/** KBS config. */
export interface KBSConfig {
    /** KBS address. */
    address: KBSAddress;
    /** KBS database connection, if undefined it will disable the typeorm connection. */
    database?: KBSDatabase;
    /** KBS router, if undefined it will disable the koa router. */
    router?: KBSRouter;
    /** KBS session, if undefined it will disable the koa session. */
    session?: KBSSession;
}
