import { describe, it, expect } from 'vitest'
import { formatTime } from './index'

describe('formatTime', () => {
  it('格式化', () => {
    const d = new Date('2024-01-02T03:04:05')
    expect(formatTime(d, 'YYYY-MM-DD HH:mm:ss')).toBe('2024-01-02 03:04:05')
  })
})
