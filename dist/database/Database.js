"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const typeorm_1 = require("typeorm");
const sleep_promise_1 = __importDefault(require("sleep-promise"));
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
        /** Remaining retries, default is 5. */
        this.retries = 5;
    }
    /**
     * <async> Connect to database.
     * @returns {Promise<void>} This connection.
     */
    async connect() {
        try {
            this.con = await typeorm_1.createConnection(this.options);
        }
        catch (error) {
            console.error(`Database error: ${error}`);
            console.warn(`Remaining retries: ${this.retries}, in 10 seconds`);
            if (this.retries--) {
                await sleep_promise_1.default(10);
                this.connect();
            }
            else {
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
    get connection() {
        return this.con;
    }
}
exports.Database = Database;
exports.default = Database;
