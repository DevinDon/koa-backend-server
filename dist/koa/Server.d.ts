import Koa, { Middleware } from 'koa';
import { KBSConfig } from '../@types';
/**
 * KBS, Koa Backend Server.
 */
export declare class Server {
    /** Koa. */
    private application;
    /** Config. */
    private config;
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
    constructor(config?: KBSConfig);
    /**
     * Init KBS.
     * @returns {Promise<void>} Void.
     */
    private init;
    /**
     * Use middlewares.
     * @param {Middleware[]} middlewares Middlewares.
     * @returns {Server} This server.
     */
    use(...middlewares: Middleware[]): Server;
    /**
     * Listening on some where.
     * @param {number} port Listening port, default to 8080.
     * @param {string} host The listening host, default to 0.0.0.0.
     * @returns {Promise<Server>} This server.
     */
    listen(host?: string, port?: number): Promise<Server>;
    /**
     * @returns {Koa} This Koa instance.
     */
    readonly app: Koa;
}
export default Server;
