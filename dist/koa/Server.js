"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const logger_1 = require("@iinfinity/logger");
const redion_1 = require("@iinfinity/redion");
const fs_1 = require("fs");
const http_1 = __importDefault(require("http"));
const http2_1 = __importDefault(require("http2"));
const https_1 = __importDefault(require("https"));
const koa_1 = __importDefault(require("koa"));
const koa_static_1 = __importDefault(require("koa-static"));
const database_1 = require("../database");
const middleware_1 = require("../middleware");
/**
 * Rester, a RESTful server.
 */
class Server {
    /**
     * Create a Rester Server.
     *
     * @param {ServerConfig} config Rester Server options.
     */
    constructor(config) {
        // Load config from profile.
        try {
            // Default in development mode, use `npm start prod` to enable production mode.
            const prod = Boolean(process.argv.find(v => v === 'prod'));
            logger_1.logger.info(`Koa Backend Server is on ${prod ? 'production' : 'development'} mode.`);
            const json = JSON.parse(fs_1.readFileSync(prod ? 'server.config.json' : 'server.config.dev.json').toString());
            // The profile will cover config.
            this.config = Object.assign({}, json, config);
            for (const key in this.config) {
                if (this.config.hasOwnProperty(key)) {
                    Object.assign(this.config[key], json[key]);
                }
            }
        }
        catch (err) {
            logger_1.logger.info(`Profile server.config.json not found or cannot be parse, disable it.`);
            this.config = config || {};
        }
        // Init Rester Server.
        this.init();
    }
    /**
     * Init Rester Server.
     *
     * @returns {Promise<void>} Void.
     */
    async init() {
        this.application = new koa_1.default();
        // Create server.
        if (this.config.address) { // Select portocol.
            switch (this.config.address.portocol) {
                case 'HTTP':
                    this.server = http_1.default.createServer(this.application.callback());
                    break;
                case 'HTTP2':
                    this.server = http2_1.default.createSecureServer(this.config.address.ssl || {}, this.application.callback());
                    break;
                case 'HTTPS':
                    this.server = https_1.default.createServer(this.config.address.ssl || {}, this.application.callback());
                    break;
                default:
                    this.server = http_1.default.createServer(this.application.callback());
                    logger_1.logger.warn(`Unkoown portocol or unset portocol: ${this.config.address.portocol}, use default portocol HTTP.`);
                    break;
            }
            this.app.proxy = Boolean(this.config.address.proxy);
        }
        else { // Default to HTTP.
            this.server = http_1.default.createServer(this.application.callback());
            logger_1.logger.info(`Use default portocol HTTP.`);
        }
        // Create database connection or not.
        if (this.config.database) {
            this.database = new database_1.Database(this.config.database);
        }
        else {
            logger_1.logger.warn(`Database not connected.`);
        }
        // Use session middleware or not.
        if (this.config.session) {
            this.session = new redion_1.Redion(this.application, this.config.session);
            this.use({
                'Redion': this.session.ware
            });
        }
        else {
            logger_1.logger.warn(`Session service not provided.`);
        }
        // Config router or not.
        if (this.config.router) {
            this.router = new middleware_1.Router(this.config.router);
            this.use({
                'Koa Router': this.router.ware
            });
            if (this.config.router.static && this.config.router.static.path) {
                this.use({
                    'Koa Static': koa_static_1.default(this.config.router.static.path, this.config.router.static.options)
                });
                logger_1.logger.info(`Static resource path: ${this.config.router.static.path} .`);
            }
            else {
                logger_1.logger.info(`Static server service not provided.`);
            }
        }
        else {
            logger_1.logger.warn(`Routing service not provided.`);
        }
        // Enable development / production mode.
        if (this.config.environment === 'prod') {
            logger_1.logger.info('Enable production mode.');
        }
        else {
            logger_1.logger.debug('Enable development mode.');
        }
    }
    /**
     * Use middlewares.
     *
     * @param {Middleware[]} middlewares Middlewares.
     * @returns {Server} This server.
     */
    use(middlewares) {
        for (const name in middlewares) {
            if (middlewares.hasOwnProperty(name)) {
                const middleware = middlewares[name];
                logger_1.logger.info(`Use middleware: ${name} .`);
                this.application.use(middleware);
            }
        }
        return this;
    }
    /**
     * Listening on some where.
     *
     * @param {number} port Listening port, default to 8080.
     * @param {string} host The listening host, default to 0.0.0.0.
     * @returns {Promise<Server>} This server.
     */
    async listen(host, port) {
        if ((!this.database) || (this.database && await this.database.connect())) {
            this.server.listen(port = port || (this.config.address && this.config.address.port) || 8080, host = host || (this.config.address && this.config.address.host) || '0.0.0.0', () => logger_1.logger.info(`Server online, address is ${host}:${port} .`));
        }
        return this;
    }
    /**
     * @returns {Koa} This Koa instance.
     */
    get app() {
        return this.application;
    }
}
exports.Server = Server;
exports.default = Server;
