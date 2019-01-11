import { Connection, ConnectionOptions } from 'typeorm';
/**
 * Package database.
 */
export declare class Database {
    private options;
    /** Default connection. */
    private con;
    /**
     * Create a database connection instance, then you should use connect methode to connect database.
     * @param {ConnectionOptions} options Typeorm database connection options, in server.config.json or code.
     */
    constructor(options: ConnectionOptions);
    /**
     * <async> Connect to database.
     * @returns {Promise<Connection>} This connection.
     */
    connect(): Promise<Connection>;
    /**
     * @returns {Promise<Connection>} This connection.
     */
    readonly connection: Connection;
}
export default Database;
