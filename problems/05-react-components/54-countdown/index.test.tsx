import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, act } from '@testing-library/react'
import { CountDown } from './index'

describe('CountDown', () => {
  beforeEach(() => vi.useFakeTimers())
  afterEach(() => vi.useRealTimers())

  it('倒计时到 0', () => {
    const onEnd = vi.fn()
    render(<CountDown seconds={2} onEnd={onEnd} />)
    expect(screen.getByTestId('countdown')).toHaveTextContent('2')
    act(() => {
      vi.advanceTimersByTime(1000)
    })
    expect(screen.getByTestId('countdown')).toHaveTextContent('1')
    act(() => {
      vi.advanceTimersByTime(1000)
    })
    expect(screen.getByTestId('countdown')).toHaveTextContent('0')
    expect(onEnd).toHaveBeenCalled()
  })
})
