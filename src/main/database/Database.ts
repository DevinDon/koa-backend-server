import { logger } from '@iinfinity/logger';
import sleep from 'sleep-promise';
import { Connection, ConnectionOptions, createConnection, getConnectionManager } from 'typeorm';

/**
 * Package database.
 */
export class Database {

  /** Default connection. */
  private con: Connection;
  /** Remaining retries, default is 5. */
  private retries = 10;
  /** Retry interval, second. */
  private retryInterval = 10;

  /**
   * Create a database connection instance, then you should use connect methode to connect database.
   *
   * @param {ConnectionOptions} options Typeorm database connection options, in server.config.json or code.
   */
  constructor(private options: ConnectionOptions) {
    this.con = getConnectionManager().create(options);
  }

  /**
   * <async> Connect to database.
   *
   * @returns {Promise<boolean>} Success or not.
   */
  public async connect(): Promise<boolean> {
    try {
      logger.info(`Connecting to database...`);
      await this.con.connect();
      logger.info(`Database connected.`);
      return true;
    } catch (err) {
      if (--this.retries) {
        logger.error(`Database connection error: ${err}.`);
        logger.warn(`Database connection remaining retries: ${this.retries} times...`);
        await sleep(this.retryInterval * 1000);
        return await this.connect();
      } else {
        logger.error(`Database connection failed: ${err}.`);
        return false;
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
