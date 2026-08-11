import { describe, it, expect } from 'vitest'
import { formatThousand } from './index'

describe('formatThousand', () => {
  it('整数与小数', () => {
    expect(formatThousand(1234567)).toBe('1,234,567')
    expect(formatThousand(1234567.89)).toBe('1,234,567.89')
  })
})
