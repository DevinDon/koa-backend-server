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
     * Create a KBS.
     * @param {KBSConfig} config KBS Server options, include:
     *
     * database?: ConnectionOptions; // Database connection, if undefined it will disable database connection.
     *
     * host?: string; // Listening host, default to 0.0.0.0.
     *
     * keys?: string[]; // Cookie & Session secret keys, if undefined it will disable session middleware.
     *
     * options?: ServerOptions | SecureServerOptions; // HTTPS / HTTP2 options, default to undefined.
     *
     * paths?: AllPaths; // Router paths, if undefined it will disable router middleware.
     *
     * port?: number; // Listening port, default to 80.
     *
     * type?: 'HTTP' | 'HTTPS' | 'HTTP2'; // Type of KBS, default to 'HTTP'.
     */
    constructor(config?: KBSConfig);
    /**
     * Use middlewares.
     * @param {Middleware[]} middlewares Middlewares.
     * @returns {void} void.
     */
    use(...middlewares: Middleware[]): void;
    /**
     * Listening on some where.
     * @param {number} port Listening port, default to 80.
     * @param {string} host The listening host, default to 0.0.0.0.
     * @returns {HTTP.Server | HTTP2.Http2SecureServer | HTTPS.Server} This server instance.
     */
    listen(port?: number, host?: string): HTTP.Server | HTTP2.Http2SecureServer | HTTPS.Server;
    /**
     * @returns {Koa} This Koa instance.
     */
    readonly app: Koa;
}
export default Server;
