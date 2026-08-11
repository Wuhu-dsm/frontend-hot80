export interface UseRequestResult<T> {
  data: T | undefined
  loading: boolean
  error: Error | undefined
  run: (...args: any[]) => Promise<T>
}

export function useRequest<T>(
  service: (...args: any[]) => Promise<T>,
  options?: { manual?: boolean },
): UseRequestResult<T> {
  void service
  void options
  throw new Error('Not implemented')
}
