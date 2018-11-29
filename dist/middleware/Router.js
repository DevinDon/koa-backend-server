"use strict";
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
        if (allPaths) {
            this.loadAllPaths(allPaths);
            console.log(`${util_1.now()}\tLoaded router paths`);
        }
        if (version) {
            this.prefix(`/${version}`);
            console.log(`${util_1.now()}\tAPI version: ${version}, now you can access your router paths with prefix /${version}`);
        }
    }
    /**
     * Load all router paths.
     * @param {AllPaths} paths All router pahts.
     * @returns {void} void.
     */
    loadAllPaths(paths) {
        this.loadDeletePaths(paths.DELETE || {});
        this.loadGetPaths(paths.GET || {});
        this.loadHeadPaths(paths.HEAD || {});
        this.loadOptionsPaths(paths.OPTIONS || {});
        this.loadPatchPaths(paths.PATCH || {});
        this.loadPostPaths(paths.POST || {});
        this.loadPutPaths(paths.PUT || {});
    }
    /**
     * Load Delete Method Paths.
     * @param {RouterPaths} paths Delete Method Paths.
     * @returns {void} void.
     */
    loadDeletePaths(paths) {
        for (const key in paths) {
            if (paths.hasOwnProperty(key)) {
                this.delete(key, paths[key]);
                console.log(`${util_1.now()}\tRegister Router Delete: ${key}`);
            }
        }
    }
    /**
     * Load Get Method Paths.
     * @param {RouterPaths} paths Get Mothod Paths.
     * @returns {void} void.
     */
    loadGetPaths(paths) {
        for (const key in paths) {
            if (paths.hasOwnProperty(key)) {
                this.get(key, paths[key]);
                console.log(`${util_1.now()}\tRegister Router GET: ${key}`);
            }
        }
    }
    /**
     * Load Head Method Paths.
     * @param {RouterPaths} paths Head Mothod Paths.
     * @returns {void} void.
     */
    loadHeadPaths(paths) {
        for (const key in paths) {
            if (paths.hasOwnProperty(key)) {
                this.head(key, paths[key]);
                console.log(`${util_1.now()}\tRegister Router Head: ${key}`);
            }
        }
    }
    /**
     * Load Options Method Paths.
     * @param {RouterPaths} paths Options Mothod Paths.
     * @returns {void} void.
     */
    loadOptionsPaths(paths) {
        for (const key in paths) {
            if (paths.hasOwnProperty(key)) {
                this.options(key, paths[key]);
                console.log(`${util_1.now()}\tRegister Router Options: ${key}`);
            }
        }
    }
    /**
     * Load Patch Method Paths.
     * @param {RouterPaths} paths Patch Mothod Paths.
     * @returns {void} void.
     */
    loadPatchPaths(paths) {
        for (const key in paths) {
            if (paths.hasOwnProperty(key)) {
                this.patch(key, paths[key]);
                console.log(`${util_1.now()}\tRegister Router Patch: ${key}`);
            }
        }
    }
    /**
     * Load Post Method Paths.
     * @param {RouterPaths} paths Post Mothod Paths.
     * @returns {void} void.
     */
    loadPostPaths(paths) {
        for (const key in paths) {
            if (paths.hasOwnProperty(key)) {
                this.post(key, koa_body_1.default(), paths[key]);
                console.log(`${util_1.now()}\tRegister Router POST: ${key}`);
            }
        }
    }
    /**
     * Load Put Method Paths.
     * @param {RouterPaths} paths Put Mothod Paths.
     * @returns {void} void.
     */
    loadPutPaths(paths) {
        for (const key in paths) {
            if (paths.hasOwnProperty(key)) {
                this.post(key, paths[key]);
                console.log(`${util_1.now()}\tRegister Router PUT: ${key}`);
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
