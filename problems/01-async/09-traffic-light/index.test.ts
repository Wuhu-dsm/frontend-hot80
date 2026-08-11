import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { createTrafficLight } from './index'

describe('createTrafficLight', () => {
  beforeEach(() => vi.useFakeTimers())
  afterEach(() => vi.useRealTimers())

  it('按红绿黄顺序循环', async () => {
    const onChange = vi.fn()
    const light = createTrafficLight({ red: 1000, green: 1000, yellow: 1000, onChange })
    light.start()
    expect(onChange).toHaveBeenCalledWith('red')
    await vi.advanceTimersByTimeAsync(1000)
    expect(onChange).toHaveBeenCalledWith('green')
    await vi.advanceTimersByTimeAsync(1000)
    expect(onChange).toHaveBeenCalledWith('yellow')
    light.stop()
  })
})
