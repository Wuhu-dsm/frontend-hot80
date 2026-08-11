export function compose(...fns: Array<(...args: any[]) => any>): (...args: any[]) => any {
  void fns
  throw new Error('Not implemented')
}

export function pipe(...fns: Array<(...args: any[]) => any>): (...args: any[]) => any {
  void fns
  throw new Error('Not implemented')
}
