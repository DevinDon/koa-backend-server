import { Method } from './@types';
import { HandlerType } from './decorator';

/**
 * Mapping, with method & path.
 */
export interface Mapping {
  method: Method;
  path: string;
  pathArray?: string[];
  query?: string;
  queryObject?: { [index: string]: string };
}

/**
 * Route.
 *
 * - Controller instance.
 * - Mapping
 *  - Method
 *  - Path
 * - Function name
 * - Target
 */
export interface Route {
  controller: any;
  handlerTypes: HandlerType[];
  mapping: Mapping;
  name: string;
  target: Function;
}

/**
 * Router.
 *
 * Route is a single, basic unit.
 *
 * Routes is a set of route.
 *
 * Router is a module to control all routes.
 */
export class Router {

  /** Special path in router. `Map.get(''); Map.set('%');` */
  private static SpecialPath = { regexp: /{{(.+)}}/, route: '', variable: '%' };

  /** Core router. `Map<Method, Map>` */
  private router: Map<Method, Map<string, any>> = new Map();

  /**
   * Format mapping, it will **modify** raw mapping.
   *
   * @param {Mapping} mapping Request mapping, include method & path.
   * @returns {Mapping} Formatted mapping.
   */
  static format(mapping: Mapping): Mapping {
    // mapping has already formatted
    if (mapping.pathArray) {
      return mapping;
    }
    // method to upper case
    mapping.method = mapping.method.toUpperCase() as Method;
    // split with `?`, path & query
    const temp = mapping.path.split('?');
    // format requset path
    mapping.path = Router.formatPath(temp[0]);
    // format to path array
    mapping.pathArray = Router.formatToPathArray(mapping.method, mapping.path);
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
  get(mapping: Mapping): Route | undefined {
    /** Current router. */
    let router: Map<string, any> = this.router;
    /** Special route, maybe undefined(not found). */
    let route: Route | undefined;
    // format mapping to array
    Router.format(mapping).pathArray!
      // foreach & get router / route
      .every((v, i, a) => {
        // if string path doesn't exist, try to get variable path
        router = router.get(v) || router.get(Router.SpecialPath.variable);
        // if match end, return the route
        if (a.length === i + 1) {
          route = router && router.get(Router.SpecialPath.route);
        }
        return router;
      });
    return route;
  }

  /**
   * Set mapping to core router.
   *
   * @param {Route} route Route.
   * @throws If the path already has a route, throw an error.
   */
  set(route: Route): Route {
    /** Current router. */
    let router: Map<string, any> = this.router;
    // format mapping
    Router.format(route.mapping).pathArray!
      // foreach & get router / route
      .forEach((v, i, a) => {
        // if router variable, get & set it
        if (Router.SpecialPath.regexp.test(v)) {
          router = router.get(Router.SpecialPath.variable) || router.set(Router.SpecialPath.variable, new Map()).get(Router.SpecialPath.variable);
        } else {
          // if router has key of `v`, get it; else set `v` & get it
          router = router.get(v) || router.set(v, new Map()).get(v);
        }
        // if match end, set the route
        if (a.length === i + 1) {
          if (router.has(Router.SpecialPath.route)) { // duplicate route
            throw new Error(`Path ${route.mapping.path} already has route.`);
          } else {
            router.set(Router.SpecialPath.route, route);
          }
        }
      });
    return route;
  }

}
