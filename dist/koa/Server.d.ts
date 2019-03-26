import Koa from 'koa';
import { Middlewares, ServerConfig } from '../@types';
/**
 * Rester, a RESTful server.
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
     * Create a Rester Server.
     *
     * @param {ServerConfig} config Rester Server options.
     */
    constructor(config?: ServerConfig);
    /**
     * Use middlewares.
     *
     * @param {Middleware[]} middlewares Middlewares.
     * @returns {Server} This server.
     */
    use(middlewares: Middlewares): Server;
    /**
     * Listening on some where.
     *
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
