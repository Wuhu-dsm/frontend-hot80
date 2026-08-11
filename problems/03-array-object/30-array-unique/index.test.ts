import { describe, it, expect } from 'vitest'
import { unique } from './index'

describe('unique', () => {
  it('原始值去重', () => {
    expect(unique([1, 1, 2, 3, 2])).toEqual([1, 2, 3])
    expect(unique(['a', 'a', 'b'])).toEqual(['a', 'b'])
  })
})
