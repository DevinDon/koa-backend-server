import { Connection, ConnectionOptions, createConnection } from 'typeorm';
import sleep from 'sleep-promise';

/**
 * Package database.
 */
export class Database {

  /** Default connection. */
  private con: Connection;
  /** Remaining retries, default is 5. */
  private retries = 5;

  /**
   * Create a database connection instance, then you should use connect methode to connect database.
   * @param {ConnectionOptions} options Typeorm database connection options, in server.config.json or code.
   */
  constructor(private options: ConnectionOptions) { }

  /**
   * <async> Connect to database.
   * @returns {Promise<void>} This connection.
   */
  public async connect(): Promise<void> {
    try {
      this.con = await createConnection(this.options);
    } catch (error) {
      console.error(`Database error: ${error}`);
      console.warn(`Remaining retries: ${this.retries}, in 10 seconds`);
      if (this.retries--) {
        await sleep(10);
        this.connect();
      } else {
        throw {
          type: 'database',
          error
        };
      }
    }
  }

  /**
   * @returns {Promise<Connection>} This connection.
   */
  public get connection(): Connection {
    return this.con;
  }

}

export default Database;
