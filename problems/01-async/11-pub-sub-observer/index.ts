export type Handler = (...args: unknown[]) => void

export class EventEmitter {
  on(event: string, handler: Handler): void {
    void event
    void handler
    throw new Error('Not implemented')
  }
  off(event: string, handler: Handler): void {
    void event
    void handler
    throw new Error('Not implemented')
  }
  emit(event: string, ...args: unknown[]): void {
    void event
    void args
    throw new Error('Not implemented')
  }
  once(event: string, handler: Handler): void {
    void event
    void handler
    throw new Error('Not implemented')
  }
}

export interface Observer<T> {
  update(data: T): void
}

export class Subject<T> {
  subscribe(observer: Observer<T>): void {
    void observer
    throw new Error('Not implemented')
  }
  unsubscribe(observer: Observer<T>): void {
    void observer
    throw new Error('Not implemented')
  }
  notify(data: T): void {
    void data
    throw new Error('Not implemented')
  }
}
