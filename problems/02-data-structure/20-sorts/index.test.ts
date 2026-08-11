import { describe, it, expect } from 'vitest'
import { bubbleSort, quickSort, mergeSort, heapSort } from './index'

const cases = [
  [],
  [1],
  [3, 1, 2],
  [5, 4, 3, 2, 1],
  [1, 2, 3],
]

describe('sorts', () => {
  for (const fn of [bubbleSort, quickSort, mergeSort, heapSort]) {
    it(fn.name, () => {
      for (const c of cases) {
        expect(fn([...c])).toEqual([...c].sort((a, b) => a - b))
      }
    })
  }
})
