import { describe, it, expect } from 'vitest'
import { countVisits } from './index'

describe('countVisits', () => {
  it('统计次数', () => {
    expect(countVisits('aab')).toEqual({ a: 2, b: 1 })
  })
})
