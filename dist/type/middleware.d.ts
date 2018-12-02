/// <reference types="koa-router" />
/// <reference types="koa-session" />
import { Files } from 'formidable';
import { Context, Request } from 'koa';
import { Middleware } from 'koa-compose';
/** Router path 中间件, 包含 Session 和 Post data. */
export declare type AMiddleware = Middleware<AContext>;
interface AContext extends Context {
    request: ARequest;
}
interface ARequest extends Request {
    body: any;
    files: Files;
}
export {};
