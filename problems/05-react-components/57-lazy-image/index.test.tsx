import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { LazyImage } from './index'

describe('LazyImage', () => {
  beforeEach(() => {
    // 简易 mock：立即触发回调
    vi.stubGlobal(
      'IntersectionObserver',
      class {
        cb: IntersectionObserverCallback
        constructor(cb: IntersectionObserverCallback) {
          this.cb = cb
        }
        observe(el: Element) {
          this.cb([{ isIntersecting: true, target: el } as IntersectionObserverEntry], this as any)
        }
        unobserve() {}
        disconnect() {}
      },
    )
  })

  it('进入视口后加载', () => {
    render(<LazyImage src="https://example.com/a.png" alt="demo" placeholder="about:blank" />)
    expect(screen.getByAltText('demo')).toHaveAttribute('src', 'https://example.com/a.png')
  })
})
