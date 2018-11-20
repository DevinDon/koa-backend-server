import { Middleware } from 'koa';
import KoaBody from 'koa-body';
import KoaRouter from 'koa-router';
import { AllPaths, RouterPaths } from '../type';
import { now } from '../util';

export class Router extends KoaRouter {

  constructor(
    allPaths: AllPaths = {}
  ) {
    super();
    this.loadAllPaths(allPaths);
  }

  /**
   * Load all router paths.
   * @param paths All router pahts.
   */
  public loadAllPaths(paths: AllPaths) {
    this.loadGetPaths(paths.GET || {});
    this.loadPostPaths(paths.POST || {});
    this.loadPutPaths(paths.PUT || {});
  }

  /**
   * Load Get Method Paths.
   * @param paths Get Mothod Paths.
   */
  public loadGetPaths(paths: RouterPaths) {
    for (const key in paths) {
      if (paths.hasOwnProperty(key)) {
        this.get(key, paths[key]);
        console.log(`${now()}: Register Router GET: ${key}`);
      }
    }
  }

  /**
   * Load Post Method Paths.
   * @param paths Post Mothod Paths.
   */
  public loadPostPaths(paths: RouterPaths) {
    for (const key in paths) {
      if (paths.hasOwnProperty(key)) {
        this.post(key, KoaBody(), paths[key]);
        console.log(`${now()}: Register Router POST: ${key}`);
      }
    }
  }

  /**
   * Load Put Method Paths.
   * @param paths Put Mothod Paths.
   */
  public loadPutPaths(paths: RouterPaths) {
    for (const key in paths) {
      if (paths.hasOwnProperty(key)) {
        this.post(key, paths[key]);
        console.log(`${now()}: Register Router PUT: ${key}`);
      }
    }
  }

  public get ware(): Middleware {
    return this.routes();
  }

}

export default Router;
