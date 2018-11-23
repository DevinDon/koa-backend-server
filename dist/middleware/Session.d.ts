import Koa, { Middleware } from 'koa';
import { opts } from 'koa-session';
/**
 * Package KoaSession.
 */
export declare class Session {
    private config;
    /** Session middleware. */
    private session;
    /**
     * Create a new session instance.
     * @param {Koa} app Koa instance.
     * @param {string[]} keys Koa.keys, default is ['default'].
     * @param {Partial<opts>} config Session config, default is { key: 'session', rolling: true }.
     */
    constructor(app: Koa, keys?: string[], config?: Partial<opts>);
    /**
     * @returns {Middleware} Middleware of session.
     */
    readonly ware: Middleware;
}
export default Session;
