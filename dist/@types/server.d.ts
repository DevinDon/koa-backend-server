/// <reference types="node" />
import { SecureServerOptions } from 'http2';
import { ServerOptions } from 'https';
import KoaStatic from 'koa-static';
import { Options } from '@iinfinity/redion';
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
    /** Koa application is in proxy mode or not. */
    proxy?: boolean;
}
/** KBS database connection, if undefined it will disable the typeorm connection. */
export declare type KBSDatabase = ConnectionOptions;
/** KBS router, if undefined it will disable the koa router. */
export interface KBSRouter {
    /** All paths of KBS router. */
    paths: AllPaths;
    /** Static files root dir path. */
    static?: {
        path: string;
        options?: KoaStatic.Options;
    };
    /** Deprecated, use accept header to instead. API version, prefix of all paths. */
    version?: string;
}
/** RediSession options. */
export declare type KBSSession = Options;
/** KBS config. */
export interface KBSConfig {
    [index: string]: any;
    /** KBS address. */
    address?: KBSAddress;
    /** KBS database connection, if undefined it will disable the typeorm connection. */
    database?: KBSDatabase;
    /** KBS router, if undefined it will disable the koa router. */
    router?: KBSRouter;
    /** KBS session, if undefined it will disable the KBS session. */
    session?: KBSSession;
}
