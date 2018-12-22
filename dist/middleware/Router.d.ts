import { Middleware } from 'koa';
import KoaRouter from 'koa-router';
import { AllPaths, CORS, Methods, RouterPaths } from '../type';
/**
 * Package KoaRouter.
 * @extends {KoaRouter} KoaRouter
 */
export declare class Router extends KoaRouter {
    private version?;
    /**
     * Generate router.
     * @param {AllPaths} allPaths All router paths.
     * @param {string} version API version prefix.
     */
    constructor(allPaths?: AllPaths, version?: string | undefined);
    /**
     * Generate CORS middleware.
     * @param {CORS} options CORS options.
     * @param {boolean} isOPTIONS Is OPTIONS method or not.
     * @returns {Middleware} CORS middleware.
     */
    static CORS(options: CORS, isOPTIONS?: boolean): Middleware;
    /**
     * Load all router paths.
     * @param {AllPaths} paths All router pahts.
     * @returns {void} void.
     */
    loadAllPaths(paths: AllPaths): void;
    /**
     * Load router paths of special method.
     * @param {Methods} type Type of method.
     * @param {RouterPaths} paths Router paths.
     * @returns {void} void.
     */
    loadPaths(type: Methods, paths: RouterPaths): void;
    /**
     * @returns {Middleware} Middleware of router.
     */
    readonly ware: Middleware;
}
export default Router;
