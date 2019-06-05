import { Method } from './@types';

/**
 * Mapping, with method & path.
 */
export interface Mapping {
  method: Method;
  path: string;
  array: string[];
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
  private static router: Map<Method, Map<string, any>> = new Map();

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
   * @param {string} path Mapping path.
   */
  private static formatPath(path: string): string {
    return path.replace(/\/+/g, '/').replace(/(.+)\/$/, '$1');
  }

  /**
   * Format mapping to array.
   *
   * @param {Mapping} mapping Mapping.
   * @returns {string[]} Formatted array.
   */
  public static formatToPathArray(mapping: Mapping): string[] {
    return (mapping.method + Router.formatPath(mapping.path)).split('/').filter(v => v.length > 0);
  }

  /**
   * Get special route.
   *
   * @param {Mapping} mapping Mapping information.
   * @returns Route. If not found, return undefined.
   */
  static get(mapping: Mapping): Route | undefined {
    try {
      /** Current router. */
      let router: Map<string, any> = Router.router;
      /** Special route, maybe undefined(not found). */
      let route: Route | undefined;
      // format mapping to array
      Router.formatToPathArray(mapping)
        // foreach & get router / route
        .forEach((v, i, a) => {
          // if string path doesn't exist, try to get variable path
          router = router.get(v) || router.get(Router.SpecialPath.variable);
          // if match end, return the route
          if (a.length === i + 1) {
            route = router.get(Router.SpecialPath.route);
          }
        });
      return route;
    } catch (exception) { // catch route not found exception
      console.log(`Route '${mapping.method}${mapping.path}' not found, ${exception}.`);
      return undefined;
    }
  }

  /**
   * Set mapping to core router.
   *
   * @param {Route} route Route.
   * @throws If the path already has a route, throw an error.
   */
  static set(route: Route): Route {
    /** Current router. */
    let router: Map<string, any> = Router.router;
    // format path
    route.mapping.path = Router.formatPath(route.mapping.path);
    // format mapping to array
    route.mapping.pathArray = Router.formatToPathArray(route.mapping);
    // foreach & get router / route
    route.mapping.pathArray
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
          router.set(Router.SpecialPath.route, route);
        }
      });
    // return route
    return route;
  }

}
