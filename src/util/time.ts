/**
 * 将数字扩展为 2 位, 不足前补 0.
 * @param n 数字.
 */
function formatWith2(n: number): string | number {
  return n < 10 ? '0' + n : n;
}

/**
 * 格式化时间, 输出标准字符串.
 * @param time 时间.
 */
export const formatTime = (time: Date) =>
  `${time.getFullYear()}.${formatWith2(time.getMonth() + 1)}.${formatWith2(time.getDate())} ${formatWith2(time.getHours())}:${formatWith2(time.getMinutes())}:${formatWith2(time.getSeconds())}`;

/**
 * 返回当前时间, 格式为: hh:mm:ss.
 */
export const now = () => formatTime(new Date());
