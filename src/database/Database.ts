import { Connection, ConnectionOptions, createConnection } from 'typeorm';

/**
 * Package database.
 */
export class Database {

  /** Default connection. */
  private con: Connection;

  /**
   * Create a database connection instance, then you should use connect methode to connect database.
   * @param {ConnectionOptions} options Typeorm database connection options, in server.config.json or code.
   */
  constructor(private options: ConnectionOptions) { }

  /**
   * <async> Connect to database.
   * @returns {Promise<Connection>} This connection.
   */
  public async connect(): Promise<Connection> {
    return this.con = await createConnection(this.options);
  }

  /**
   * @returns {Promise<Connection>} This connection.
   */
  public get connection(): Connection {
    return this.con;
  }

}

export default Database;
