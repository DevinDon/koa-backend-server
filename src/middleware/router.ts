import KoaBody from 'koa-body';
import Router from 'koa-router';
import { RouterPaths, AllPaths } from '../type';
import { now } from '../util';

export class KoaRouter extends Router {

  constructor(
    allPaths: AllPaths = {}
  ) {
    super();
    this.loadGetPaths(allPaths.GET || {});
    this.loadPostPaths(allPaths.POST || {});
    this.loadPutPaths(allPaths.PUT || {});
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

}

export default KoaRouter;
