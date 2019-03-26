"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const logger_1 = require("@iinfinity/logger");
const sleep_promise_1 = __importDefault(require("sleep-promise"));
const typeorm_1 = require("typeorm");
/**
 * Package database.
 */
class Database {
    /**
     * Create a database connection instance, then you should use connect methode to connect database.
     *
     * @param {ConnectionOptions} options Typeorm database connection options, in server.config.json or code.
     */
    constructor(options) {
        this.options = options;
        /** Remaining retries, default is 5. */
        this.retries = 10;
        /** Retry interval, second. */
        this.retryInterval = 10;
        this.con = typeorm_1.getConnectionManager().create(options);
    }
    /**
     * <async> Connect to database.
     *
     * @returns {Promise<boolean>} Success or not.
     */
    async connect() {
        try {
            logger_1.logger.info(`Connecting to database...`);
            await this.con.connect();
            logger_1.logger.info(`Database connected.`);
            return true;
        }
        catch (err) {
            if (--this.retries) {
                logger_1.logger.error(`Database connection error: ${err}.`);
                logger_1.logger.warn(`Database connection remaining retries: ${this.retries} times...`);
                await sleep_promise_1.default(this.retryInterval * 1000);
                return await this.connect();
            }
            else {
                logger_1.logger.error(`Database connection failed: ${err}.`);
                return false;
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
