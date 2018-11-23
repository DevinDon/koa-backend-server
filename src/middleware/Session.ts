import Koa, { Middleware } from 'koa';
import KoaSession, { opts } from 'koa-session';

/**
 * Package KoaSession.
 */
export class Session {

  /** Session middleware. */
  private session: Middleware;

  /**
   * Create a new session instance.
   * @param {Koa} app Koa instance.
   * @param {string[]} keys Koa.keys, default is ['default'].
   * @param {Partial<opts>} config Session config, default is { key: 'session', rolling: true }.
   */
  constructor(
    app: Koa,
    keys: string[] = ['default'],
    private config: Partial<opts> = { key: 'session', rolling: true }
  ) {
    this.session = KoaSession(config, app);
    app.keys = keys;
  }

  /**
   * @returns {Middleware} Middleware of session.
   */
  public get ware(): Middleware {
    return this.session;
  }

}

export default Session;
