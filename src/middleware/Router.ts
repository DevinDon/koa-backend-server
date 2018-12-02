import { Middleware } from 'koa';
import KoaBody from 'koa-body';
import KoaRouter from 'koa-router';
import { AllPaths, AMiddleware, CORS, Methods, RouterPaths } from '../type';
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
  constructor(
    allPaths?: AllPaths,
    private version?: string
  ) {
    super();
    if (version) {
      console.log(`${now()}\tAPI version: ${version}, now you can access your router paths with prefix /${version}`);
    } else {
      console.warn(`${now()}\tThere is no version has been set.`);
    }
    if (allPaths) {
      this.loadAllPaths(allPaths);
      console.log(`${now()}\tLoaded router paths`);
    } else {
      console.warn(`${now()}\tThere is no router path has been set.`);
    }
  }

  public static cors(options: CORS, isOpt = false): AMiddleware {
    return async (c, next) => {
      c.set({
        'Access-Control-Allow-Headers': options['Access-Control-Allow-Headers'],
        'Access-Control-Allow-Methods': options['Access-Control-Allow-Methods'].join(', '),
        'Access-Control-Allow-Origin': options['Access-Control-Allow-Origin']
      });
      if (isOpt) {
        c.body = {};
      }
      next();
    };
  }

  /**
   * Load all router paths.
   * @param {AllPaths} paths All router pahts.
   * @returns {void} void.
   */
  public loadAllPaths(paths: AllPaths): void {
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
  public loadPaths(type: Methods, paths: RouterPaths): void {
    let action: any;
    switch (type.toUpperCase()) {
      case 'DELETE': action = this.delete.bind(this); break;
      case 'GET': action = this.get.bind(this); break;
      case 'HEAD': action = this.head.bind(this); break;
      case 'OPTIONS': action = this.options.bind(this); break;
      case 'PATCH': action = this.patch.bind(this); break;
      case 'POST': action = this.post.bind(this); break;
      case 'PUT': action = this.put.bind(this); break;
      default: console.warn(`${now()}\tUnknown method: ${type.toUpperCase()}`); return;
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
        } else {
          path = prefix + path;
        }
        // If CORS is true, set the same path of method OPTIONS.
        if (paths[key].cors) {
          this.options(path, Router.cors(paths[key].cors as CORS, true) as any);
          // console.log(`${now()}\tLoaded OPTIONS path: ${path} with CORS`);
          action(path, KoaBody(), paths[key].ware, Router.cors(paths[key].cors as CORS) as any);
          console.log(`${now()}\tLoaded ${type.toUpperCase()} path: ${path} with CORS`);
        } else {
          action(path, KoaBody(), paths[key].ware);
          console.log(`${now()}\tLoaded ${type.toUpperCase()} path: ${path}`);
        }
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
