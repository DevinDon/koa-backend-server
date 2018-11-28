import { Connection, ConnectionOptions } from 'typeorm';
/**
 * Package database.
 */
export declare class Database {
    /** Default connection. */
    private con;
    /**
     * Create a database connection instance.
     * @param {ConnectionOptions} options Typeorm database connection options.
     */
    constructor(options?: ConnectionOptions);
    /**
     * @returns {Promise<Connection>} This connection with promise.
     */
    readonly connection: Promise<Connection>;
}
export default Database;
