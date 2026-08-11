export type SettledResult<T> =
  | { status: 'fulfilled'; value: T }
  | { status: 'rejected'; reason: unknown }

export function promiseAllSettled<T>(
  promises: Iterable<T | PromiseLike<T>>,
): Promise<SettledResult<Awaited<T>>[]> {
  void promises
  throw new Error('Not implemented')
}
