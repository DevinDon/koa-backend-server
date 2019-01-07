/// <reference types="node" />
import HTTP from 'http';
import HTTP2 from 'http2';
import HTTPS from 'https';
import Koa, { Middleware } from 'koa';
import { KBSConfig } from '../type';
/**
 * KBS, Koa Backend Server.
 */
export declare class Server {
    private config;
    /** Koa. */
    private application;
    /** Server. */
    private server;
    /** Session. */
    private session?;
    /** Router. */
    private router?;
    /** Database. */
    private database?;
    /**
     * Create a KBS, Koa Backend Server.
     * @param {KBSConfig} config KBS Server options.
     */
    constructor(config: KBSConfig);
    /**
     * Use middlewares.
     * @param {Middleware[]} middlewares Middlewares.
     * @returns {Server} This server.
     */
    use(...middlewares: Middleware[]): Server;
    /**
     * Listening on some where.
     * @param {number} port Listening port, default to 80.
     * @param {string} host The listening host, default to 0.0.0.0.
     * @returns {HTTP.Server | HTTP2.Http2SecureServer | HTTPS.Server} This server instance.
     */
    listen(host?: string, port?: number): HTTP.Server | HTTP2.Http2SecureServer | HTTPS.Server;
    /**
     * @returns {Koa} This Koa instance.
     */
    readonly app: Koa;
}
export default Server;
