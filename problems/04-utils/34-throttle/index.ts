export function throttle<T extends (...args: any[]) => any>(
  fn: T,
  wait: number,
): (...args: Parameters<T>) => void {
  void fn
  void wait
  throw new Error('Not implemented')
}
