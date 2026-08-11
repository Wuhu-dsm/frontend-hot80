export interface RetryOptions {
  retries: number
  timeout: number
  delay?: number
}

export async function retry<T>(fn: () => Promise<T>, options: RetryOptions): Promise<T> {
  void fn
  void options
  throw new Error('Not implemented')
}
