"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const koa_body_1 = __importDefault(require("koa-body"));
const koa_router_1 = __importDefault(require("koa-router"));
const logger_1 = require("@iinfinity/logger");
/**
 * Package KoaRouter.
 *
 * @extends {KoaRouter} KoaRouter
 */
class Router extends koa_router_1.default {
    /**
     * Generate router.
     *
     * @param {AllPaths} allPaths All router paths.
     * @param {string} version API version prefix.
     */
    constructor(config) {
        super();
        this.config = config;
        if (config.version) {
            logger_1.logger.warn(`API version is deprecated, use accept header to instead.`);
        }
        if (config.prefix) {
            logger_1.logger.info(`Router prefix: ${config.prefix}, now you can access your router paths with prefix /${config.prefix} .`);
        }
        if (config.paths) {
            this.loadAllPaths(config.paths);
            logger_1.logger.info(`Loaded router paths.`);
        }
        else {
            logger_1.logger.warn(`There is no router path has been set, server may not work.`);
        }
    }
    /**
     * Generate CORS middleware.
     *
     * @param {CORS} options CORS options.
     * @param {boolean} isOPTIONS Is OPTIONS method or not.
     * @returns {Middleware} CORS middleware.
     */
    static setCORS(options, isOPTIONS = false) {
        return async (c, next) => {
            c.set({
                'Access-Control-Allow-Headers': options['Access-Control-Allow-Headers'],
                'Access-Control-Allow-Methods': options['Access-Control-Allow-Methods'].join(', '),
                'Access-Control-Allow-Origin': options['Access-Control-Allow-Origin']
            });
            if (isOPTIONS) {
                c.body = {};
            }
            await next();
        };
    }
    /**
     * Load all router paths.
     *
     * @param {AllPaths} paths All router pahts.
     * @returns {void} void.
     */
    loadAllPaths(paths) {
        this.loadPaths('DELETE', paths.DELETE || {});
        this.loadPaths('GET', paths.GET || {});
        this.loadPaths('HEAD', paths.HEAD || {});
        this.loadPaths('OPTIONS', paths.OPTIONS || {});
        this.loadPaths('PATCH', paths.PATCH || {});
        this.loadPaths('POST', paths.POST || {});
        this.loadPaths('PUT', paths.PUT || {});
    }
    /**
     * Load router paths of special method.
     *
     * @param {Methods} type Type of method.
     * @param {RouterPaths} paths Router paths.
     * @returns {void} void.
     */
    loadPaths(type, paths) {
        let action;
        const typeUpperCase = type.toUpperCase();
        switch (typeUpperCase) {
            case 'DELETE':
                action = this.delete.bind(this);
                break;
            case 'GET':
                action = this.get.bind(this);
                break;
            case 'HEAD':
                action = this.head.bind(this);
                break;
            case 'OPTIONS':
                action = this.options.bind(this);
                break;
            case 'PATCH':
                action = this.patch.bind(this);
                break;
            case 'POST':
                action = this.post.bind(this);
                break;
            case 'PUT':
                action = this.put.bind(this);
                break;
            default:
                logger_1.logger.warn(`Unknown method: ${typeUpperCase} .`);
                return;
        }
        for (const key in paths) {
            if (paths.hasOwnProperty(key)) {
                /** Router paths with string or RegExp. */
                let path = paths[key].path;
                /** Router prefix. */
                const prefix = (this.config.prefix && !paths[key].withoutPrefix) ? '/' + this.config.prefix : '';
                // If the path instanceof RegExp, slice reg and add the prefix to this reg.
                if (path instanceof RegExp) {
                    // path.source
                    path = RegExp(prefix + path.source);
                }
                else {
                    path = prefix + path;
                }
                // If CORS is true, set the same path of method OPTIONS.
                if (paths[key].cors) {
                    this.options(path, Router.setCORS(paths[key].cors, true));
                    // Never use KoaBody in OPTIONS and HEAD method
                    if (typeUpperCase === 'OPTIONS' || typeUpperCase === 'HEAD') {
                        action(path, paths[key].ware, Router.setCORS(paths[key].cors));
                    }
                    else {
                        action(path, koa_body_1.default(), paths[key].ware, Router.setCORS(paths[key].cors));
                    }
                    logger_1.logger.info(`Loaded ${typeUpperCase} path: ${path} with CORS .`);
                }
                else {
                    // Never use KoaBody in OPTIONS and HEAD method
                    if (typeUpperCase === 'OPTIONS' || typeUpperCase === 'HEAD') {
                        action(path, paths[key].ware);
                    }
                    else {
                        action(path, koa_body_1.default(), paths[key].ware);
                    }
                    logger_1.logger.info(`Loaded ${typeUpperCase} path: ${path} .`);
                }
            }
        }
    }
    /**
     * @returns {Middleware} Middleware of router.
     */
    get ware() {
        return this.routes();
    }
}
exports.Router = Router;
exports.default = Router;
