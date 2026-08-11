import { describe, it, expect } from 'vitest'
import { myNew, myInstanceof } from './index'

describe('new/instanceof', () => {
  class Person {
    name: string
    constructor(name: string) {
      this.name = name
    }
  }

  it('myNew', () => {
    const p = myNew(Person, 'Tom')
    expect(p.name).toBe('Tom')
    expect(p instanceof Person).toBe(true)
  })

  it('myInstanceof', () => {
    const p = new Person('A')
    expect(myInstanceof(p, Person)).toBe(true)
    expect(myInstanceof(p, Array)).toBe(false)
  })
})
