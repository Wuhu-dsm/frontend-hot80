export function debounce<T extends (...args: any[]) => any>(
  fn: T,
  wait: number,
): ((...args: Parameters<T>) => void) & { cancel: () => void } {
  void fn
  void wait
  throw new Error('Not implemented')
}
