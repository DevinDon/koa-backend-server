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
  constructor(allPaths?: AllPaths, version?: string) {
    super();
    if (allPaths) {
      this.loadAllPaths(allPaths);
      console.log(`${now()}\tLoaded router paths`);
    }
    if (version) {
      this.prefix(`/${version}`);
      console.log(`${now()}\tAPI version: ${version}, now you can access your router paths with prefix /${version}`);
    }
  }

  /**
   * Load all router paths.
   * @param {AllPaths} paths All router pahts.
   * @returns {void} void.
   */
  public loadAllPaths(paths: AllPaths): void {
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
  public loadDeletePaths(paths: RouterPaths): void {
    for (const key in paths) {
      if (paths.hasOwnProperty(key)) {
        this.delete(key, paths[key]);
        console.log(`${now()}\tRegister Router Delete: ${key}`);
      }
    }
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
        console.log(`${now()}\tRegister Router GET: ${key}`);
      }
    }
  }

  /**
   * Load Head Method Paths.
   * @param {RouterPaths} paths Head Mothod Paths.
   * @returns {void} void.
   */
  public loadHeadPaths(paths: RouterPaths): void {
    for (const key in paths) {
      if (paths.hasOwnProperty(key)) {
        this.head(key, paths[key]);
        console.log(`${now()}\tRegister Router Head: ${key}`);
      }
    }
  }

  /**
   * Load Options Method Paths.
   * @param {RouterPaths} paths Options Mothod Paths.
   * @returns {void} void.
   */
  public loadOptionsPaths(paths: RouterPaths): void {
    for (const key in paths) {
      if (paths.hasOwnProperty(key)) {
        this.options(key, paths[key]);
        console.log(`${now()}\tRegister Router Options: ${key}`);
      }
    }
  }

  /**
   * Load Patch Method Paths.
   * @param {RouterPaths} paths Patch Mothod Paths.
   * @returns {void} void.
   */
  public loadPatchPaths(paths: RouterPaths): void {
    for (const key in paths) {
      if (paths.hasOwnProperty(key)) {
        this.patch(key, paths[key]);
        console.log(`${now()}\tRegister Router Patch: ${key}`);
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
        console.log(`${now()}\tRegister Router POST: ${key}`);
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
        console.log(`${now()}\tRegister Router PUT: ${key}`);
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
