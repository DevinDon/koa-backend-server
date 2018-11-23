"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const koa_session_1 = __importDefault(require("koa-session"));
/**
 * Package KoaSession.
 */
class Session {
    /**
     * Create a new session instance.
     * @param {Koa} app Koa instance.
     * @param {string[]} keys Koa.keys, default is ['default'].
     * @param {Partial<opts>} config Session config, default is { key: 'session', rolling: true }.
     */
    constructor(app, keys = ['default'], config = { key: 'session', rolling: true }) {
        this.config = config;
        this.session = koa_session_1.default(config, app);
        app.keys = keys;
    }
    /**
     * @returns {Middleware} Middleware of session.
     */
    get ware() {
        return this.session;
    }
}
exports.Session = Session;
exports.default = Session;
