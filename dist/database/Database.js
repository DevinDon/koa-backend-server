"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const typeorm_1 = require("typeorm");
/**
 * Package database.
 */
class Database {
    /**
     * Create a database connection instance.
     * @param {ConnectionOptions} options Typeorm database connection options.
     */
    constructor(options) {
        this.con = typeorm_1.createConnection(options);
    }
    /**
     * @returns {Promise<Connection>} This connection with promise.
     */
    get connection() {
        return this.con;
    }
}
exports.Database = Database;
exports.default = Database;
