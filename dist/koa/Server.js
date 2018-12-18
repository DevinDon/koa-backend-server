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
const database_1 = require("../database");
const middleware_1 = require("../middleware");
const util_1 = require("../util");
/**
 * KBS, Koa Backend Server.
 */
class Server {
    /**
     * Create a KBS.
     * @param {KBSConfig} config KBS Server options, include:
     *
     * database?: ConnectionOptions | boolean; // Database connection, if undefined it will disable database connection;
     * if true, it will use ormconfig.json to create connection;
     * if ConnectionOptions, it will use your own config to create connection.
     *
     * host?: string; // Listening host, default to 0.0.0.0.
     *
     * keys?: string[]; // Cookie & Session secret keys, if undefined it will disable session middleware.
     *
     * options?: ServerOptions | SecureServerOptions; // HTTPS / HTTP2 options, default to undefined.
     *
     * paths?: AllPaths; // Router paths, if undefined it will disable router middleware.
     *
     * port?: number; // Listening port, default to 80.
     *
     * type?: 'HTTP' | 'HTTPS' | 'HTTP2'; // Type of KBS, default to 'HTTP'.
     *
     * version?: string; // API version.
     */
    constructor(config) {
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
                console.warn(`There is no connection has been connected.`);
            }
        }
        if (config.session) {
            this.session = new middleware_1.Session(this.application, config.session.keys);
            this.use(this.session.ware);
        }
        if (config.router) {
            this.router = new middleware_1.Router(config.router.paths, config.router.version);
            this.use(this.router.ware);
            if (config.router.static) {
                this.use(koa_static_1.default(config.router.static.path, config.router.static.options));
            }
        }
        this.listen(config.address.host, config.address.port);
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
    listen(host = '0.0.0.0', port = 80) {
        return this.server.listen(port, host, () => console.log(`${util_1.now()}\tServer online, address is ${host}:${port}`));
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
