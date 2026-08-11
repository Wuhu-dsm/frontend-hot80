export type MyPick<T, K extends keyof T> = {
  // TODO
  [P in K]: T[P]
}

export type MyOmit<T, K extends keyof T> = {
  // TODO: 可用 Exclude
  [P in Exclude<keyof T, K>]: T[P]
}

export function pick<T extends object, K extends keyof T>(obj: T, keys: K[]): MyPick<T, K> {
  void obj
  void keys
  throw new Error('Not implemented')
}

export function omit<T extends object, K extends keyof T>(obj: T, keys: K[]): MyOmit<T, K> {
  void obj
  void keys
  throw new Error('Not implemented')
}
