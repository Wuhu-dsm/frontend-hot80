import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { fixedLog } from './index'

describe('fixedLog', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.spyOn(console, 'log').mockImplementation(() => {})
  })
  afterEach(() => {
    vi.useRealTimers()
    vi.restoreAllMocks()
  })

  it('打印正确索引', async () => {
    fixedLog(3)
    await vi.runAllTimersAsync()
    expect(vi.mocked(console.log).mock.calls.map((c) => c[0])).toEqual([0, 1, 2])
  })
})
