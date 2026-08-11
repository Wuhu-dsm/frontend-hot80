import { describe, it, expect } from 'vitest'
import { myMap, myFilter, myReduce } from './index'

describe('array methods', () => {
  it('map/filter/reduce', () => {
    expect(myMap([1, 2], (x) => x * 2)).toEqual([2, 4])
    expect(myFilter([1, 2, 3], (x) => x > 1)).toEqual([2, 3])
    expect(myReduce([1, 2, 3], (a, b) => a + b, 0)).toBe(6)
  })
})
