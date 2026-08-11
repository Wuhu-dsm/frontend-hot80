import { describe, it, expect, vi } from 'vitest'
import { MyPromise } from './index'

describe('MyPromise', () => {
  it('同步 resolve', async () => {
    const p = new MyPromise<number>((resolve) => resolve(1))
    await expect(p).resolves.toBe(1)
  })

  it('异步 resolve', async () => {
    const p = new MyPromise<string>((resolve) => {
      setTimeout(() => resolve('ok'), 10)
    })
    await expect(p).resolves.toBe('ok')
  })

  it('reject 后可 catch', async () => {
    const p = new MyPromise((_, reject) => reject(new Error('fail')))
    await expect(p).rejects.toThrow('fail')
  })

  it('支持 then 链式', async () => {
    const result = await new MyPromise<number>((resolve) => resolve(1))
      .then((v) => v + 1)
      .then((v) => String(v))
    expect(result).toBe('2')
  })

  it('finally 一定会执行', async () => {
    const spy = vi.fn()
    await new MyPromise<number>((resolve) => resolve(1)).finally(spy)
    expect(spy).toHaveBeenCalled()
  })
})
