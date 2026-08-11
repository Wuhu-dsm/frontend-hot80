import { describe, it, expect } from 'vitest'
import { promiseAllSettled } from './index'

describe('promiseAllSettled', () => {
  it('同时收集成功与失败', async () => {
    const rejected = Promise.reject('err')
    rejected.catch(() => {})
    const result = await promiseAllSettled([Promise.resolve(1), rejected])
    expect(result).toEqual([
      { status: 'fulfilled', value: 1 },
      { status: 'rejected', reason: 'err' },
    ])
  })
})
