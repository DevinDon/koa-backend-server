"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * 将数字扩展为 2 位, 不足前补 0.
 * @param {number} n 数字.
 * @returns {string} 补全后的数字字符串.
 */
function formatWith2(n) {
    return (n < 10 ? '0' : '') + n;
}
/**
 * 格式化时间, 输出标准字符串.
 * @param {Date} time 时间.
 * @returns {string} 时间字符串.
 */
function formatTime(time) {
    return `${time.getFullYear()}.${formatWith2(time.getMonth() + 1)}.${formatWith2(time.getDate())} ${formatWith2(time.getHours())}:${formatWith2(time.getMinutes())}:${formatWith2(time.getSeconds())}`;
}
exports.formatTime = formatTime;
/**
 * 返回当前时间, 格式为: hh:mm:ss.
 * @returns {string} 时间字符串.
 */
function now() {
    return formatTime(new Date());
}
exports.now = now;
