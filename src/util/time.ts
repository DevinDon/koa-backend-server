
function formatWith2(n: number): string | number {
  return n < 10 ? '0' + n : n;
}

/**
 * 格式化时间, 输出标准字符串.
 * @param time 时间.
 */
export const formatTime = (time: Date) =>
  `${time.getFullYear()}.${formatWith2(time.getMonth() + 1)}.${formatWith2(time.getDate())} ${formatWith2(time.getHours())}:${formatWith2(time.getMinutes())}:${formatWith2(time.getSeconds())}`;

export const now = () => formatTime(new Date());
