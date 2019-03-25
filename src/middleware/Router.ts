import { Middleware } from 'koa';
import KoaBody from 'koa-body';
import KoaRouter from 'koa-router';
import { AllPaths, CORS, Methods, RouterPaths } from '../@types';
import { now } from '../util';
import { logger } from '@iinfinity/logger';

/**
 * Package KoaRouter.
 *
 * @extends {KoaRouter} KoaRouter
 */
export class Router extends KoaRouter {

  /**
   * Generate CORS middleware.
   *
   * @param {CORS} options CORS options.
   * @param {boolean} isOPTIONS Is OPTIONS method or not.
   * @returns {Middleware} CORS middleware.
   */
  public static setCORS(options: CORS, isOPTIONS: boolean = false): Middleware {
    return async (c, next) => {
      c.set({
        'Access-Control-Allow-Headers': options['Access-Control-Allow-Headers'],
        'Access-Control-Allow-Methods': options['Access-Control-Allow-Methods'].join(', '),
        'Access-Control-Allow-Origin': options['Access-Control-Allow-Origin']
      });
      if (isOPTIONS) {
        c.body = {};
      }
      await next();
    };
  }

  /**
   * Generate router.
   *
   * @param {AllPaths} allPaths All router paths.
   * @param {string} version API version prefix.
   */
  constructor(
    allPaths?: AllPaths,
    private version?: string
  ) {
    super();
    if (version) {
      logger.warn(`API version is deprecated, use accept header to instead.`)
      logger.warn(`API version: ${version}, now you can access your router paths with prefix /${version}`);
    }
    if (allPaths) {
      this.loadAllPaths(allPaths);
      logger.info(`Loaded router paths`);
    } else {
      logger.warn(`There is no router path has been set.`);
    }
  }

  /**
   * Load all router paths.
   *
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
   *
   * @param {Methods} type Type of method.
   * @param {RouterPaths} paths Router paths.
   * @returns {void} void.
   */
  public loadPaths(type: Methods, paths: RouterPaths): void {
    let action: any;
    const typeUpperCase = type.toUpperCase();
    switch (typeUpperCase) {
      case 'DELETE': action = this.delete.bind(this); break;
      case 'GET': action = this.get.bind(this); break;
      case 'HEAD': action = this.head.bind(this); break;
      case 'OPTIONS': action = this.options.bind(this); break;
      case 'PATCH': action = this.patch.bind(this); break;
      case 'POST': action = this.post.bind(this); break;
      case 'PUT': action = this.put.bind(this); break;
      default: logger.warn(`Unknown method: ${typeUpperCase}`); return;
    }
    for (const key in paths) {
      if (paths.hasOwnProperty(key)) {
        /** Router paths with string or RegExp. */
        let path = paths[key].path;
        /** API version prefix. */
        const prefix = (this.version && !paths[key].withoutPrefix) ? '/' + this.version : '';
        // If the path instanceof RegExp, slice reg and add the prefix to this reg.
        if (path instanceof RegExp) {
          // path.source
          path = RegExp(prefix + path.source);
        } else {
          path = prefix + path;
        }
        // If CORS is true, set the same path of method OPTIONS.
        if (paths[key].cors) {
          this.options(path, Router.setCORS(paths[key].cors as CORS, true) as any);
          // Never use KoaBody in OPTIONS and HEAD method
          if (typeUpperCase === 'OPTIONS' || typeUpperCase === 'HEAD') {
            action(path, paths[key].ware, Router.setCORS(paths[key].cors as CORS));
          } else {
            action(path, KoaBody(), paths[key].ware, Router.setCORS(paths[key].cors as CORS));
          }
          logger.info(`Loaded ${typeUpperCase} path: ${path} with CORS`);
        } else {
          // Never use KoaBody in OPTIONS and HEAD method
          if (typeUpperCase === 'OPTIONS' || typeUpperCase === 'HEAD') {
            action(path, paths[key].ware);
          } else {
            action(path, KoaBody(), paths[key].ware);
          }
          logger.info(`Loaded ${typeUpperCase} path: ${path}`);
        }
      }
    }
  }

  /**
   * @returns {Middleware} Middleware of router.
   */
  public get ware(): Middleware {
    return this.routes() as Middleware;
  }

}

export default Router;
