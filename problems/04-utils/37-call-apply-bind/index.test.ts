import { describe, it, expect } from 'vitest'
import { myCall, myApply, myBind } from './index'

describe('call/apply/bind', () => {
  function greet(this: { name: string }, punct: string) {
    return this.name + punct
  }

  it('call/apply', () => {
    expect(myCall(greet, { name: 'A' }, '!')).toBe('A!')
    expect(myApply(greet, { name: 'B' }, ['?'])).toBe('B?')
  })

  it('bind', () => {
    const bound = myBind(greet, { name: 'C' }, '!')
    expect(bound()).toBe('C!')
  })
})
