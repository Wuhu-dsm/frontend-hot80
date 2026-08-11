export type Task<T> = () => Promise<T>

export async function asyncPool<T>(limit: number, tasks: Task<T>[]): Promise<T[]> {
  void limit
  void tasks
  throw new Error('Not implemented')
}
