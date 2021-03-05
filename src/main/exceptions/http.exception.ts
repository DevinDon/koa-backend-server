/**
 * Base HTTPException class.
 *
 * @property {number} code HTTP status code.
 * @property {string | undefined} message Message to show.
 * @property {T} content Content.
 */
export class HTTPException<T = any> extends Error {

  constructor(
    public code: number,
    public message: string = 'HTTP Exception',
    public content?: T,
  ) {
    super(message);
    this.code = isNaN(+code) ? 500 : +code;
  }

}
