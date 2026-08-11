export function myMap<T, U>(arr: T[], fn: (item: T, index: number, array: T[]) => U): U[] {
  void arr
  void fn
  throw new Error('Not implemented')
}

export function myFilter<T>(arr: T[], fn: (item: T, index: number, array: T[]) => unknown): T[] {
  void arr
  void fn
  throw new Error('Not implemented')
}

export function myReduce<T, U>(
  arr: T[],
  fn: (acc: U, item: T, index: number, array: T[]) => U,
  init: U,
): U {
  void arr
  void fn
  void init
  throw new Error('Not implemented')
}
