export type Resolve<T> = (value: T | PromiseLike<T>) => void
export type Reject = (reason?: unknown) => void
export type Executor<T> = (resolve: Resolve<T>, reject: Reject) => void

export class MyPromise<T = unknown> {
  constructor(executor: Executor<T>) {
    // TODO: 实现 Promise
    void executor
    throw new Error('Not implemented')
  }

  then<TResult1 = T, TResult2 = never>(
    onFulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | null,
    onRejected?: ((reason: unknown) => TResult2 | PromiseLike<TResult2>) | null,
  ): MyPromise<TResult1 | TResult2> {
    void onFulfilled
    void onRejected
    throw new Error('Not implemented')
  }

  catch<TResult = never>(
    onRejected?: ((reason: unknown) => TResult | PromiseLike<TResult>) | null,
  ): MyPromise<T | TResult> {
    void onRejected
    throw new Error('Not implemented')
  }

  finally(onFinally?: (() => void) | null): MyPromise<T> {
    void onFinally
    throw new Error('Not implemented')
  }
}
