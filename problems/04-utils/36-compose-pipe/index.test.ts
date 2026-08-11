import { describe, it, expect } from 'vitest'
import { compose, pipe } from './index'

describe('compose/pipe', () => {
  const double = (x: number) => x * 2
  const add1 = (x: number) => x + 1

  it('compose 右到左', () => {
    expect(compose(double, add1)(1)).toBe(4)
  })
  it('pipe 左到右', () => {
    expect(pipe(add1, double)(1)).toBe(4)
  })
})
