export function promiseRace<T>(promises: Iterable<T | PromiseLike<T>>): Promise<Awaited<T>> {
  void promises
  throw new Error('Not implemented')
}
