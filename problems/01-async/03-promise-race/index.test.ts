import { describe, it, expect } from 'vitest'
import { promiseRace } from './index'

const delay = <T,>(value: T, ms: number, reject = false) =>
  new Promise<T>((res, rej) => setTimeout(() => (reject ? rej(value) : res(value)), ms))

describe('promiseRace', () => {
  it('返回最先完成的结果', async () => {
    await expect(promiseRace([delay('slow', 30), delay('fast', 5)])).resolves.toBe('fast')
  })

  it('最先失败也会 reject', async () => {
    const failed = delay(new Error('boom'), 5, true)
    failed.catch(() => {})
    await expect(promiseRace([failed, delay('ok', 30)])).rejects.toThrow('boom')
  })
})
