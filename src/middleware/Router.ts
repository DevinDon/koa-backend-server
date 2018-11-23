import { Middleware } from 'koa';
import KoaBody from 'koa-body';
import KoaRouter from 'koa-router';
import { AllPaths, RouterPaths } from '../type';
import { now } from '../util';

/**
 * Package KoaRouter.
 * @extends {KoaRouter} KoaRouter
 */
export class Router extends KoaRouter {

  /**
   * Generate router.
   * @param {AllPaths} allPaths All router paths.
   */
  constructor(allPaths: AllPaths = {}) {
    super();
    this.loadAllPaths(allPaths);
  }

  /**
   * Load all router paths.
   * @param {AllPaths} paths All router pahts.
   * @returns {void} void.
   */
  public loadAllPaths(paths: AllPaths): void {
    this.loadGetPaths(paths.GET || {});
    this.loadPostPaths(paths.POST || {});
    this.loadPutPaths(paths.PUT || {});
  }

  /**
   * Load Get Method Paths.
   * @param {RouterPaths} paths Get Mothod Paths.
   * @returns {void} void.
   */
  public loadGetPaths(paths: RouterPaths): void {
    for (const key in paths) {
      if (paths.hasOwnProperty(key)) {
        this.get(key, paths[key]);
        console.log(`${now()}: Register Router GET: ${key}`);
      }
    }
  }

  /**
   * Load Post Method Paths.
   * @param {RouterPaths} paths Post Mothod Paths.
   * @returns {void} void.
   */
  public loadPostPaths(paths: RouterPaths): void {
    for (const key in paths) {
      if (paths.hasOwnProperty(key)) {
        this.post(key, KoaBody(), paths[key]);
        console.log(`${now()}: Register Router POST: ${key}`);
      }
    }
  }

  /**
   * Load Put Method Paths.
   * @param {RouterPaths} paths Put Mothod Paths.
   * @returns {void} void.
   */
  public loadPutPaths(paths: RouterPaths): void {
    for (const key in paths) {
      if (paths.hasOwnProperty(key)) {
        this.post(key, paths[key]);
        console.log(`${now()}: Register Router PUT: ${key}`);
      }
    }
  }

  /**
   * @returns {Middleware} Middleware of router.
   */
  public get ware(): Middleware {
    return this.routes();
  }

}

export default Router;
