import { describe, it, expect, vi } from 'vitest'
import { sleep } from './index'

describe('sleep', () => {
  it('等待指定时间', async () => {
    vi.useFakeTimers()
    const p = sleep(100)
    vi.advanceTimersByTime(100)
    await expect(p).resolves.toBeUndefined()
    vi.useRealTimers()
  })
})
