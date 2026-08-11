import { describe, it, expect } from 'vitest'
import { extractHtmlText } from './index'

describe('extractHtmlText', () => {
  it('提取文本', () => {
    expect(extractHtmlText('<div>hello <b>world</b></div>')).toBe('hello world')
  })
})
