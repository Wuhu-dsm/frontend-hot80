import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { CodingMan } from './index'

describe('CodingMan', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.spyOn(console, 'log').mockImplementation(() => {})
  })
  afterEach(() => {
    vi.useRealTimers()
    vi.restoreAllMocks()
  })

  it('基础问候', async () => {
    CodingMan('Pete')
    await vi.runAllTimersAsync()
    expect(console.log).toHaveBeenCalledWith('Hi! This is Pete!')
  })

  it('支持 sleep 与 eat', async () => {
    CodingMan('Pete').sleep(1).eat('dinner')
    await vi.runAllTimersAsync()
    expect(console.log).toHaveBeenCalledWith('Wake up after 1')
    expect(console.log).toHaveBeenCalledWith('Eat dinner~')
  })

  it('sleepFirst 优先执行', async () => {
    CodingMan('Pete').sleepFirst(1).eat('dinner')
    await vi.advanceTimersByTimeAsync(0)
    expect(console.log).not.toHaveBeenCalledWith('Hi! This is Pete!')
    await vi.runAllTimersAsync()
    const logs = vi.mocked(console.log).mock.calls.map((c) => c[0])
    expect(logs[0]).toBe('Wake up after 1')
    expect(logs).toContain('Hi! This is Pete!')
  })
})
