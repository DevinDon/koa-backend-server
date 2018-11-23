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
    constructor(allPaths = {}) {
        super();
        this.loadAllPaths(allPaths);
    }
    /**
     * Load all router paths.
     * @param {AllPaths} paths All router pahts.
     * @returns {void} void.
     */
    loadAllPaths(paths) {
        this.loadGetPaths(paths.GET || {});
        this.loadPostPaths(paths.POST || {});
        this.loadPutPaths(paths.PUT || {});
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
                console.log(`${util_1.now()}: Register Router GET: ${key}`);
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
                console.log(`${util_1.now()}: Register Router POST: ${key}`);
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
                console.log(`${util_1.now()}: Register Router PUT: ${key}`);
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
