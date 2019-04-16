import { delay } from '@iinfinity/delay';
import { Connection, ConnectionOptions, getConnectionManager } from 'typeorm';
import { logger } from '..';

/**
 * Database connection.
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
   * @param {ConnectionOptions} option Typeorm database connection options.
   */
  constructor(option: ConnectionOptions) {
    this.con = getConnectionManager().create(option);
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
        await delay(this.retryInterval * 1000);
        return this.connect();
      } else {
        logger.error(`Database connection failed: ${err}.`);
        return false;
      }
    }
  }

  /**
   * @returns {Connection} This connection.
   */
  public get connection(): Connection {
    return this.con;
  }

}

export default Database;
