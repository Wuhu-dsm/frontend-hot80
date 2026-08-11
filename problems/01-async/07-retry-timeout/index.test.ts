import { describe, it, expect, vi } from 'vitest'
import { retry } from './index'

describe('retry', () => {
  it('成功则直接返回', async () => {
    await expect(retry(async () => 1, { retries: 2, timeout: 100 })).resolves.toBe(1)
  })

  it('失败后重试直至成功', async () => {
    let n = 0
    const fn = vi.fn(async () => {
      n++
      if (n < 3) throw new Error('fail')
      return 'ok'
    })
    await expect(retry(fn, { retries: 3, timeout: 100, delay: 0 })).resolves.toBe('ok')
    expect(fn).toHaveBeenCalledTimes(3)
  })

  it('超时会失败', async () => {
    await expect(
      retry(async () => new Promise(() => {}), { retries: 0, timeout: 20 }),
    ).rejects.toThrow(/timeout/i)
  })
})
