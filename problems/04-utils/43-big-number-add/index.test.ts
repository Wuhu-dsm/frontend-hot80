import { describe, it, expect } from 'vitest'
import { addBigNumber } from './index'

describe('addBigNumber', () => {
  it('大数相加', () => {
    expect(addBigNumber('999', '1')).toBe('1000')
    expect(addBigNumber('12345678901234567890', '98765432109876543210')).toBe(
      '111111111011111111100',
    )
  })
})
