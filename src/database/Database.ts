import { Connection, createConnection, ConnectionOptions } from 'typeorm';

/**
 * Package database.
 */
export class Database {

  /** Default connection. */
  private con: Promise<Connection>;

  /**
   * Create a database connection instance.
   * @param {ConnectionOptions} options Typeorm database connection options.
   */
  constructor(options?: ConnectionOptions) {
    if (options) {
      this.con = createConnection(options);
    } else {
      this.con = createConnection();
    }
  }

  /**
   * @returns {Promise<Connection>} This connection with promise.
   */
  public get connection(): Promise<Connection> {
    return this.con;
  }

}

export default Database;
