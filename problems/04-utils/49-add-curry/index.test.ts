import { describe, it, expect } from 'vitest'
import { add } from './index'

describe('add curry', () => {
  it('无限累加', () => {
    expect(add(1)(2)(3)()).toBe(6)
    expect(add(1)(2)(3)(4)()).toBe(10)
  })
})
