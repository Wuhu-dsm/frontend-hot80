/** 错误示例思路：var + setTimeout 导致全是 n */
export function buggyLog(n: number): void {
  for (var i = 0; i < n; i++) {
    setTimeout(() => console.log(i), 0)
  }
}

/** 请实现正确版本 */
export function fixedLog(n: number): void {
  void n
  throw new Error('Not implemented')
}
