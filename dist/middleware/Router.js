"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const koa_body_1 = __importDefault(require("koa-body"));
const koa_router_1 = __importDefault(require("koa-router"));
const util_1 = require("../util");
/**
 * Package KoaRouter.
 * @extends {KoaRouter} KoaRouter
 */
class Router extends koa_router_1.default {
    /**
     * Generate router.
     * @param {AllPaths} allPaths All router paths.
     */
    constructor(allPaths, version) {
        super();
        this.version = version;
        if (version) {
            console.log(`${util_1.now()}\tAPI version: ${version}, now you can access your router paths with prefix /${version}`);
        }
        else {
            console.warn(`${util_1.now()}\tThere is no version has been set.`);
        }
        if (allPaths) {
            this.loadAllPaths(allPaths);
            console.log(`${util_1.now()}\tLoaded router paths`);
        }
        else {
            console.warn(`${util_1.now()}\tThere is no router path has been set.`);
        }
    }
    static cors(options) {
        return (c, next) => __awaiter(this, void 0, void 0, function* () {
            c.set({
                'Access-Control-Allow-Headers': options['Access-Control-Allow-Headers'],
                'Access-Control-Allow-Methods': options['Access-Control-Allow-Methods'].join(', '),
                'Access-Control-Allow-Origin': options['Access-Control-Allow-Origin']
            });
            next();
        });
    }
    /**
     * Load all router paths.
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
     * @param {Methods} type Type of method.
     * @param {RouterPaths} paths Router paths.
     * @returns {void} void
     */
    loadPaths(type, paths) {
        let action;
        switch (type.toUpperCase()) {
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
                console.warn(`${util_1.now()}\tUnknown method: ${type.toUpperCase()}`);
                return;
        }
        for (const key in paths) {
            if (paths.hasOwnProperty(key)) {
                /** Router paths with string or RegExp. */
                let path = paths[key].path;
                /** API version prefix. */
                const prefix = this.version ? '/' + this.version : '';
                // If the path instanceof RegExp, slice reg and add the prefix to this reg.
                if (path instanceof RegExp) {
                    path = RegExp(prefix + String(path).slice(1, -1));
                }
                else {
                    path = prefix + path;
                }
                // If CORS is true, set the same path of method OPTIONS.
                if (paths[key].cors) {
                    this.options(path, Router.cors(paths[key].cors));
                    console.log(`${util_1.now()}\tLoaded OPTIONS path: ${path} with CORS`);
                }
                action(path, koa_body_1.default(), paths[key].ware, Router.cors(paths[key].cors));
                console.log(`${util_1.now()}\tLoaded ${type.toUpperCase()} path: ${path}`);
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
