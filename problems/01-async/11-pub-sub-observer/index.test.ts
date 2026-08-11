import { describe, it, expect, vi } from 'vitest'
import { EventEmitter, Subject } from './index'

describe('EventEmitter', () => {
  it('on/emit/off', () => {
    const em = new EventEmitter()
    const fn = vi.fn()
    em.on('a', fn)
    em.emit('a', 1)
    expect(fn).toHaveBeenCalledWith(1)
    em.off('a', fn)
    em.emit('a', 2)
    expect(fn).toHaveBeenCalledTimes(1)
  })

  it('once 只触发一次', () => {
    const em = new EventEmitter()
    const fn = vi.fn()
    em.once('a', fn)
    em.emit('a')
    em.emit('a')
    expect(fn).toHaveBeenCalledTimes(1)
  })
})

describe('Subject', () => {
  it('通知所有观察者', () => {
    const s = new Subject<number>()
    const o1 = { update: vi.fn() }
    const o2 = { update: vi.fn() }
    s.subscribe(o1)
    s.subscribe(o2)
    s.notify(9)
    expect(o1.update).toHaveBeenCalledWith(9)
    expect(o2.update).toHaveBeenCalledWith(9)
  })
})
