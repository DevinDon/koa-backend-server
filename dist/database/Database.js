"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const typeorm_1 = require("typeorm");
/**
 * Package database.
 */
class Database {
    /**
     * Create a database connection instance, then you should use connect methode to connect database.
     * @param {ConnectionOptions} options Typeorm database connection options, in server.config.json or code.
     */
    constructor(options) {
        this.options = options;
    }
    /**
     * <async> Connect to database.
     * @returns {Promise<Connection>} This connection.
     */
    async connect() {
        return this.con = await typeorm_1.createConnection(this.options);
    }
    /**
     * @returns {Promise<Connection>} This connection.
     */
    get connection() {
        return this.con;
    }
}
exports.Database = Database;
exports.default = Database;
