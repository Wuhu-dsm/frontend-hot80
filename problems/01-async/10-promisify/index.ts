export type NodeCallback<T> = (err: Error | null, result?: T) => void

export function promisify<TArgs extends unknown[], TResult>(
  fn: (...args: [...TArgs, NodeCallback<TResult>]) => void,
): (...args: TArgs) => Promise<TResult> {
  void fn
  throw new Error('Not implemented')
}
