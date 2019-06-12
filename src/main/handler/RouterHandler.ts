import { Mapping, MetadataKey, Method, Route } from '../@types';
import { CONTROLLERS } from '../decorator';
import { HTTP404Exception } from '../Exception';
import { BaseHandler } from './BaseHandler';

export class RouterHandler extends BaseHandler {

  /** Special path in router. `Map.get(''); Map.set('%');` */
  private static SpecialPath = { regexp: /{{(.+)}}/, route: '', variable: '%' };

  /** Core router. `Map<Method, Map>` */
  private static router: Map<string, any> = new Map();

  /**
   * Format mapping, it will **not** modify raw mapping.
   *
   * @param {Mapping} mapping Request mapping, include method & path.
   * @returns {Mapping} Formatted mapping.
   */
  static format(mapping: Mapping): Mapping {
    // mapping has already formatted
    if (mapping.pathArray) {
      return mapping;
    }
    /** Mapping result. */
    const result: any = {};
    result.method = mapping.method.toUpperCase();
    const temp = mapping.path.split('?');
    result.path = RouterHandler.formatPath(temp[0]);
    result.pathArray = RouterHandler.formatToPathArray(result.method, result.path);
    if (temp[1]) {
      result.query = temp[1];
      result.queryObject = {};
      result.query.split('&')
        .forEach((v: any) => {
          const kv = v.split('=');
          result.queryObject![kv[0]] = decodeURIComponent(kv[1]);
        });
    }
    return result;
  }

  /**
   * Format mapping, it will **modify** raw mapping.
   *
   * @param {Mapping} mapping Request mapping, include method & path.
   * @returns {Mapping} Formatted mapping.
   */
  static formatAndModify(mapping: Mapping): Mapping {
    // mapping has already formatted
    if (mapping.pathArray) {
      return mapping;
    }
    // method to upper case
    mapping.method = mapping.method.toUpperCase() as Method;
    // split with `?`, path & query
    const temp = mapping.path.split('?');
    // format requset path
    mapping.path = RouterHandler.formatPath(temp[0]);
    // format to path array
    mapping.pathArray = RouterHandler.formatToPathArray(mapping.method, mapping.path);
    // if query string exist
    if (temp[1]) {
      mapping.query = temp[1];
      mapping.queryObject = {};
      mapping.query.split('&')
        .forEach(v => {
          const kv = v.split('=');
          mapping.queryObject![kv[0]] = decodeURIComponent(kv[1]);
        });
    }
    return mapping;
  }

  /**
   * Format route path.
   *
   * First, `replace(/\/+/g, '/')`
   *
   * And then, `replace(/\/+$/, '')`
   *
   * Example:
   *
   * Input: `//abc//def/`
   * Output: `/abc/def`
   *
   * Input: `///`
   * Output: `/`
   *
   * @param {string} path Request path, without query.
   */
  static formatPath(path: string): string {
    return path.replace(/\/+/g, '/').replace(/(.+)\/$/, '$1');
  }

  /**
   * Format mapping to array.
   *
   * @param {Method} method Request method.
   * @param {string} path Request path, without query & should be formatted.
   * @returns {string[]} Formatted array.
   */
  static formatToPathArray(method: Method, path: string): string[] {
    return (method + path).split('/').filter(v => v.length > 0);
  }

  /**
   * Get special route.
   *
   * @param {Mapping} mapping Mapping information.
   * @returns Route. If not found, return undefined.
   */
  static get(mapping: Mapping, router = RouterHandler.router): Route | undefined {
    /** Special route, maybe undefined(not found). */
    let route: Route | undefined;
    // format mapping to array
    RouterHandler.formatAndModify(mapping).pathArray!
      // foreach & get router / route
      .every((v, i, a) => {
        // if string path doesn't exist, try to get variable path
        router = router.get(v) || router.get(RouterHandler.SpecialPath.variable);
        // if match end, return the route
        if (a.length === i + 1) {
          route = router && router.get(RouterHandler.SpecialPath.route);
        }
        // if router is undefined, break
        return Boolean(router);
      });
    return route;
  }

  /**
   * Set mapping to core router.
   *
   * @param {Route} route Route.
   * @throws If the path already has a route, throw an error.
   */
  static set(route: Route, router: Map<string, any> = RouterHandler.router): Map<string, any> {
    // format mapping
    RouterHandler.formatAndModify(route.mapping).pathArray!
      // foreach & get router / route
      .forEach((v, i, a) => {
        // if router variable, get & set it
        if (RouterHandler.SpecialPath.regexp.test(v)) {
          router = router.get(RouterHandler.SpecialPath.variable) || router.set(RouterHandler.SpecialPath.variable, new Map()).get(RouterHandler.SpecialPath.variable);
        } else {
          // if router has key of `v`, get it; else set `v` & get it
          router = router.get(v) || router.set(v, new Map()).get(v);
        }
        // if match end, set the route
        if (a.length === i + 1) {
          if (router.has(RouterHandler.SpecialPath.route)) { // duplicate route
            throw new Error(`Path ${route.mapping.path} already has route.`);
          } else {
            router.set(RouterHandler.SpecialPath.route, route);
          }
        }
      });
    return router;
  }

  /**
   * Create a new RouterHandler.
   *
   * If router is empty, try to get route in CONTROLLERS.
   */
  constructor() {
    super();
    if (RouterHandler.router.size === 0) {
      for (const controller of CONTROLLERS) {
        const routes: Route[] = Reflect.getMetadata(MetadataKey.Controller, controller) || [];
        routes.forEach(route => RouterHandler.set(route));
      }
    }
  }

  /**
   * Router handle method.
   *
   * @param {Next<T>} next Next function, to go to next handler.
   * @returns {Promise<T>} Result for this handler.
   * @throws {HTTP404Exception} Not found exception.
   */
  handle(next: () => Promise<any>): Promise<any> {
    this.route = RouterHandler.get({ method: this.request.method as Method, path: this.request.url! })!;
    if (this.route) {
      return next();
    }
    throw new HTTP404Exception(`Can't ${this.request.method} ${this.request.url}`);
  }

}