export function mySetInterval(fn: () => void, delay: number): { clear: () => void } {
  void fn
  void delay
  throw new Error('Not implemented')
}

export function mySetTimeout(fn: () => void, delay: number): { clear: () => void } {
  void fn
  void delay
  throw new Error('Not implemented')
}
