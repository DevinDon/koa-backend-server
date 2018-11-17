import Koa, { Middleware } from 'koa';
import KoaSession, { opts } from 'koa-session';

export class Session {

  /** Session middleware. */
  private session: Middleware;

  /**
   * Create a new session instance.
   * @param app Koa instance.
   * @param keys Koa.keys, default is ['default'].
   * @param config Session config, default is { key: 'session', rolling: true }.
   */
  constructor(
    app: Koa,
    keys: string[] = ['default'],
    private config: Partial<opts> = { key: 'session', rolling: true }
  ) {
    this.session = KoaSession(config, app);
    app.keys = keys;
  }

  public get ware(): Middleware {
    return this.session;
  }

}

export default Session;
