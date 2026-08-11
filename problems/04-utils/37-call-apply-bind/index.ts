export function myCall<T extends (...args: any[]) => any>(
  fn: T,
  thisArg: unknown,
  ...args: Parameters<T>
): ReturnType<T> {
  void fn
  void thisArg
  void args
  throw new Error('Not implemented')
}

export function myApply<T extends (...args: any[]) => any>(
  fn: T,
  thisArg: unknown,
  args: Parameters<T> | unknown[] = [],
): ReturnType<T> {
  void fn
  void thisArg
  void args
  throw new Error('Not implemented')
}

export function myBind<T extends (...args: any[]) => any>(
  fn: T,
  thisArg: unknown,
  ...args: any[]
): (...rest: any[]) => ReturnType<T> {
  void fn
  void thisArg
  void args
  throw new Error('Not implemented')
}
