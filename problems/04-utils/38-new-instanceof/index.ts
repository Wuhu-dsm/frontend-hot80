export function myNew<T extends new (...args: any[]) => any>(
  Ctor: T,
  ...args: ConstructorParameters<T>
): InstanceType<T> {
  void Ctor
  void args
  throw new Error('Not implemented')
}

export function myInstanceof(obj: unknown, Ctor: Function): boolean {
  void obj
  void Ctor
  throw new Error('Not implemented')
}
