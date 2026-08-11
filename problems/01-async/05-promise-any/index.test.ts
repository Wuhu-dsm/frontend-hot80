import { describe, it, expect } from 'vitest'
import { promiseAny } from './index'

describe('promiseAny', () => {
  it('返回第一个成功值', async () => {
    const rejected = Promise.reject('a')
    rejected.catch(() => {})
    await expect(promiseAny([rejected, Promise.resolve('ok'), Promise.resolve('b')])).resolves.toBe(
      'ok',
    )
  })

  it('全部失败抛 AggregateError', async () => {
    const r1 = Promise.reject(1)
    const r2 = Promise.reject(2)
    r1.catch(() => {})
    r2.catch(() => {})
    await expect(promiseAny([r1, r2])).rejects.toBeInstanceOf(AggregateError)
  })
})
