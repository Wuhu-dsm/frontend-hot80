export function promiseAny<T>(promises: Iterable<T | PromiseLike<T>>): Promise<Awaited<T>> {
  void promises
  throw new Error('Not implemented')
}
