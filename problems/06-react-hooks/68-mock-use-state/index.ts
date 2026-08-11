export function resetHooks(): void {
  throw new Error('Not implemented')
}

export function myUseState<T>(initial: T): [T, (v: T | ((prev: T) => T)) => void] {
  void initial
  throw new Error('Not implemented')
}

export function renderWithHooks(fn: () => void): void {
  void fn
  throw new Error('Not implemented')
}
