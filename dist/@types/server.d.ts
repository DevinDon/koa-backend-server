/// <reference types="node" />
import { Options } from '@iinfinity/redion';
import { SecureServerOptions } from 'http2';
import { ServerOptions } from 'https';
import { Middleware } from 'koa';
import KoaStatic from 'koa-static';
import { ConnectionOptions } from 'typeorm';
import { AllPaths } from './router';
/** Rester Server address. */
export interface AddressConfig {
    /** Rester Server portocol. */
    portocol?: 'HTTP' | 'HTTPS' | 'HTTP2';
    /** Rester Server host. */
    host?: string;
    /** Rester Server port. */
    port?: number;
    /** Rester Server ssl options, only required in secure server (HTTPS or HTTP2). */
    ssl?: ServerOptions | SecureServerOptions;
    /** Koa application is in proxy mode or not. */
    proxy?: boolean;
}
/** Rester Server database connection, if undefined it will disable the typeorm connection. */
export declare type DatabaseConfig = ConnectionOptions;
/** Rester Server router, if undefined it will disable the koa router. */
export interface RouterConfig {
    /** All paths of Rester Server router. */
    paths: AllPaths;
    /** Router prefix. */
    prefix?: string;
    /** Static files root dir path. */
    static?: {
        path: string;
        options?: KoaStatic.Options;
    };
    /**
     * API version, prefix of all paths.
     * @deprecated Use accept header to instead. It will be changed in future.
     */
    version?: string;
}
/** RediSession options. */
export declare type SessionConfig = Options;
/** Rester Server config. */
export interface ServerConfig {
    [index: string]: any;
    /** Rester Server address. */
    address?: AddressConfig;
    /** Rester Server database connection, if undefined it will disable the typeorm connection. */
    database?: DatabaseConfig;
    /** Rester Server router, if undefined it will disable the koa router. */
    router?: RouterConfig;
    /** Rester Server session, if undefined it will disable the Rester Server session. */
    session?: SessionConfig;
    /** Enviroument: development or production. */
    environment?: 'dev' | 'prod';
}
/** Middleware with name. */
export interface Middlewares {
    [index: string]: Middleware;
}
