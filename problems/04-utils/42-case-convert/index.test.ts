import { describe, it, expect } from 'vitest'
import { toCamelCase, toSnakeCase, toKebabCase } from './index'

describe('case convert', () => {
  it('互转', () => {
    expect(toCamelCase('hello_world-test')).toBe('helloWorldTest')
    expect(toSnakeCase('helloWorldTest')).toBe('hello_world_test')
    expect(toKebabCase('helloWorldTest')).toBe('hello-world-test')
  })
})
