import { Middleware } from 'koa';
import KoaRouter from 'koa-router';
import { AllPaths, RouterPaths } from '../type';
/**
 * Package KoaRouter.
 * @extends {KoaRouter} KoaRouter
 */
export declare class Router extends KoaRouter {
    /**
     * Generate router.
     * @param {AllPaths} allPaths All router paths.
     */
    constructor(allPaths?: AllPaths);
    /**
     * Load all router paths.
     * @param {AllPaths} paths All router pahts.
     * @returns {void} void.
     */
    loadAllPaths(paths: AllPaths): void;
    /**
     * Load Get Method Paths.
     * @param {RouterPaths} paths Get Mothod Paths.
     * @returns {void} void.
     */
    loadGetPaths(paths: RouterPaths): void;
    /**
     * Load Post Method Paths.
     * @param {RouterPaths} paths Post Mothod Paths.
     * @returns {void} void.
     */
    loadPostPaths(paths: RouterPaths): void;
    /**
     * Load Put Method Paths.
     * @param {RouterPaths} paths Put Mothod Paths.
     * @returns {void} void.
     */
    loadPutPaths(paths: RouterPaths): void;
    /**
     * @returns {Middleware} Middleware of router.
     */
    readonly ware: Middleware;
}
export default Router;
