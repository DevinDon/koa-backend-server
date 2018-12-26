"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = __importDefault(require("http"));
const http2_1 = __importDefault(require("http2"));
const https_1 = __importDefault(require("https"));
const koa_1 = __importDefault(require("koa"));
const koa_static_1 = __importDefault(require("koa-static"));
const redisession_1 = require("redisession");
const database_1 = require("../database");
const middleware_1 = require("../middleware");
const util_1 = require("../util");
/**
 * KBS, Koa Backend Server.
 */
class Server {
    /**
     * Create a KBS, Koa Backend Server.
     * @param {KBSConfig} config KBS Server options.
     */
    constructor(config) {
        this.config = config;
        this.application = new koa_1.default();
        switch (config.address.portocol) {
            case 'HTTP':
                this.server = http_1.default.createServer(this.application.callback());
                break;
            case 'HTTP2':
                this.server = http2_1.default.createSecureServer(config.address.ssl || {}, this.application.callback());
                break;
            case 'HTTPS':
                this.server = https_1.default.createServer(config.address.ssl || {}, this.application.callback());
                break;
            default:
                this.server = http_1.default.createServer(this.application.callback());
                console.log(`${util_1.now()}\tNo such portocol or unset portocol: ${config.address.portocol}, use default portocol HTTP`);
                break;
        }
        if (config.database) {
            if (config.database.ormconfig) {
                this.database = new database_1.Database();
            }
            else if (config.database.options) {
                this.database = new database_1.Database(config.database.options);
            }
            else {
                console.warn(`${util_1.now()}\tThere is no database connection has been connected.`);
            }
        }
        if (config.session) {
            this.session = new redisession_1.RediSession(this.application, config.session);
            this.use(this.session.ware);
        }
        if (config.router) {
            this.router = new middleware_1.Router(config.router.paths, config.router.version);
            this.use(this.router.ware);
            if (config.router.static) {
                this.use(koa_static_1.default(config.router.static.path, config.router.static.options));
                console.log(`${util_1.now()}\tStatic resource path: ${config.router.static.path}`);
            }
        }
    }
    /**
     * Use middlewares.
     * @param {Middleware[]} middlewares Middlewares.
     * @returns {void} void.
     */
    use(...middlewares) {
        for (const middleware of middlewares) {
            this.application.use(middleware);
            console.log(`${util_1.now()}\tUse middleware: ${middleware.name || middleware.toString()}`);
        }
    }
    /**
     * Listening on some where.
     * @param {number} port Listening port, default to 80.
     * @param {string} host The listening host, default to 0.0.0.0.
     * @returns {HTTP.Server | HTTP2.Http2SecureServer | HTTPS.Server} This server instance.
     */
    listen(host, port) {
        return this.server.listen(port = port || this.config.address.port || 80, host = host || this.config.address.host || '0.0.0.0', () => console.log(`${util_1.now()}\tServer online, address is ${host}:${port}`));
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
