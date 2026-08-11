import { describe, it, expect } from 'vitest'
import { inherit } from './index'

describe('inherit', () => {
  it('寄生组合继承', () => {
    function Parent(this: any, name: string) {
      this.name = name
    }
    Parent.prototype.say = function () {
      return this.name
    }
    function Child(this: any, name: string, age: number) {
      Parent.call(this, name)
      this.age = age
    }
    inherit(Child, Parent)
    const c = new (Child as any)('A', 18)
    expect(c.say()).toBe('A')
    expect(c instanceof Parent).toBe(true)
    expect(Child.prototype.constructor).toBe(Child)
  })
})
