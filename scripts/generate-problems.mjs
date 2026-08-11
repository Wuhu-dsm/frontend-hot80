import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(__dirname, '..')
const problemsRoot = path.join(root, 'problems')

/** @typedef {{ slug: string, title: string, difficulty?: string, desc: string, stubs: Record<string, string>, tests: string, extras?: Record<string, string> }} Problem */

/** @type {Record<string, { id: string, name: string, env: string, problems: Problem[] }>} */
const categories = {
  '01-async': {
    id: '01-async',
    name: '异步与设计模式',
    env: 'node + vitest',
    problems: [
      {
        slug: '01-promise',
        title: 'Promise 完整实现',
        desc: `实现一个符合 Promise/A+ 基本行为的 MyPromise 类。

## 要求
- 支持 \`new MyPromise((resolve, reject) => {})\`
- 支持 \`then\` / \`catch\` / \`finally\` 链式调用
- 支持状态：pending / fulfilled / rejected，且只能变更一次
- 支持异步 resolve/reject
- 支持 then 回调返回新 Promise 的穿透与错误冒泡`,
        stubs: {
          'index.ts': `export type Resolve<T> = (value: T | PromiseLike<T>) => void
export type Reject = (reason?: unknown) => void
export type Executor<T> = (resolve: Resolve<T>, reject: Reject) => void

export class MyPromise<T = unknown> {
  constructor(executor: Executor<T>) {
    // TODO: 实现 Promise
    void executor
    throw new Error('Not implemented')
  }

  then<TResult1 = T, TResult2 = never>(
    onFulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | null,
    onRejected?: ((reason: unknown) => TResult2 | PromiseLike<TResult2>) | null,
  ): MyPromise<TResult1 | TResult2> {
    void onFulfilled
    void onRejected
    throw new Error('Not implemented')
  }

  catch<TResult = never>(
    onRejected?: ((reason: unknown) => TResult | PromiseLike<TResult>) | null,
  ): MyPromise<T | TResult> {
    void onRejected
    throw new Error('Not implemented')
  }

  finally(onFinally?: (() => void) | null): MyPromise<T> {
    void onFinally
    throw new Error('Not implemented')
  }
}
`,
          'index.test.ts': `import { describe, it, expect, vi } from 'vitest'
import { MyPromise } from './index'

describe('MyPromise', () => {
  it('同步 resolve', async () => {
    const p = new MyPromise<number>((resolve) => resolve(1))
    await expect(p).resolves.toBe(1)
  })

  it('异步 resolve', async () => {
    const p = new MyPromise<string>((resolve) => {
      setTimeout(() => resolve('ok'), 10)
    })
    await expect(p).resolves.toBe('ok')
  })

  it('reject 后可 catch', async () => {
    const p = new MyPromise((_, reject) => reject(new Error('fail')))
    await expect(p).rejects.toThrow('fail')
  })

  it('支持 then 链式', async () => {
    const result = await new MyPromise<number>((resolve) => resolve(1))
      .then((v) => v + 1)
      .then((v) => String(v))
    expect(result).toBe('2')
  })

  it('finally 一定会执行', async () => {
    const spy = vi.fn()
    await new MyPromise<number>((resolve) => resolve(1)).finally(spy)
    expect(spy).toHaveBeenCalled()
  })
})
`,
        },
        tests: '',
      },
      {
        slug: '02-promise-all',
        title: 'Promise.all',
        desc: `实现 \`promiseAll\`，行为对齐 \`Promise.all\`。

## 要求
- 全部成功时按输入顺序返回结果数组
- 任一失败立即 reject
- 空数组立即 resolve 为 \`[]\``,
        stubs: {
          'index.ts': `export function promiseAll<T>(promises: Iterable<T | PromiseLike<T>>): Promise<Awaited<T>[]> {
  // TODO
  void promises
  throw new Error('Not implemented')
}
`,
          'index.test.ts': `import { describe, it, expect } from 'vitest'
import { promiseAll } from './index'

describe('promiseAll', () => {
  it('全部成功按顺序返回', async () => {
    const result = await promiseAll([
      Promise.resolve(1),
      Promise.resolve(2),
      3,
    ])
    expect(result).toEqual([1, 2, 3])
  })

  it('空数组', async () => {
    await expect(promiseAll([])).resolves.toEqual([])
  })

  it('任一失败则失败', async () => {
    await expect(
      promiseAll([Promise.resolve(1), Promise.reject(new Error('x'))]),
    ).rejects.toThrow('x')
  })
})
`,
        },
        tests: '',
      },
      {
        slug: '03-promise-race',
        title: 'Promise.race',
        desc: `实现 \`promiseRace\`，行为对齐 \`Promise.race\`：谁先 settle 就采用谁的结果。`,
        stubs: {
          'index.ts': `export function promiseRace<T>(promises: Iterable<T | PromiseLike<T>>): Promise<Awaited<T>> {
  void promises
  throw new Error('Not implemented')
}
`,
          'index.test.ts': `import { describe, it, expect } from 'vitest'
import { promiseRace } from './index'

const delay = <T,>(value: T, ms: number, reject = false) =>
  new Promise<T>((res, rej) => setTimeout(() => (reject ? rej(value) : res(value)), ms))

describe('promiseRace', () => {
  it('返回最先完成的结果', async () => {
    await expect(promiseRace([delay('slow', 30), delay('fast', 5)])).resolves.toBe('fast')
  })

  it('最先失败也会 reject', async () => {
    await expect(promiseRace([delay(new Error('boom'), 5, true), delay('ok', 30)])).rejects.toThrow('boom')
  })
})
`,
        },
        tests: '',
      },
      {
        slug: '04-promise-allsettled',
        title: 'Promise.allSettled',
        desc: `实现 \`promiseAllSettled\`，等待全部完成后返回 \`{status,value/reason}\` 数组。`,
        stubs: {
          'index.ts': `export type SettledResult<T> =
  | { status: 'fulfilled'; value: T }
  | { status: 'rejected'; reason: unknown }

export function promiseAllSettled<T>(
  promises: Iterable<T | PromiseLike<T>>,
): Promise<SettledResult<Awaited<T>>[]> {
  void promises
  throw new Error('Not implemented')
}
`,
          'index.test.ts': `import { describe, it, expect } from 'vitest'
import { promiseAllSettled } from './index'

describe('promiseAllSettled', () => {
  it('同时收集成功与失败', async () => {
    const result = await promiseAllSettled([
      Promise.resolve(1),
      Promise.reject('err'),
    ])
    expect(result).toEqual([
      { status: 'fulfilled', value: 1 },
      { status: 'rejected', reason: 'err' },
    ])
  })
})
`,
        },
        tests: '',
      },
      {
        slug: '05-promise-any',
        title: 'Promise.any',
        desc: `实现 \`promiseAny\`：任一成功即返回；全部失败则抛 AggregateError。`,
        stubs: {
          'index.ts': `export function promiseAny<T>(promises: Iterable<T | PromiseLike<T>>): Promise<Awaited<T>> {
  void promises
  throw new Error('Not implemented')
}
`,
          'index.test.ts': `import { describe, it, expect } from 'vitest'
import { promiseAny } from './index'

describe('promiseAny', () => {
  it('返回第一个成功值', async () => {
    await expect(
      promiseAny([Promise.reject('a'), Promise.resolve('ok'), Promise.resolve('b')]),
    ).resolves.toBe('ok')
  })

  it('全部失败抛 AggregateError', async () => {
    await expect(promiseAny([Promise.reject(1), Promise.reject(2)])).rejects.toBeInstanceOf(
      AggregateError,
    )
  })
})
`,
        },
        tests: '',
      },
      {
        slug: '06-concurrency-control',
        title: '并发控制',
        desc: `实现 \`asyncPool(limit, tasks)\`：限制同时运行的异步任务数量。

## 要求
- \`limit\` 为最大并发数
- \`tasks\` 为返回 Promise 的函数数组
- 结果按任务原始顺序返回`,
        stubs: {
          'index.ts': `export type Task<T> = () => Promise<T>

export async function asyncPool<T>(limit: number, tasks: Task<T>[]): Promise<T[]> {
  void limit
  void tasks
  throw new Error('Not implemented')
}
`,
          'index.test.ts': `import { describe, it, expect, vi } from 'vitest'
import { asyncPool } from './index'

describe('asyncPool', () => {
  it('限制并发并按序返回', async () => {
    let running = 0
    let maxRunning = 0
    const make = (v: number, ms: number) => async () => {
      running++
      maxRunning = Math.max(maxRunning, running)
      await new Promise((r) => setTimeout(r, ms))
      running--
      return v
    }
    const result = await asyncPool(2, [make(1, 30), make(2, 10), make(3, 10)])
    expect(result).toEqual([1, 2, 3])
    expect(maxRunning).toBeLessThanOrEqual(2)
  })
})
`,
        },
        tests: '',
      },
      {
        slug: '07-retry-timeout',
        title: 'retry 重试 + 超时控制',
        desc: `实现 \`retry(fn, options)\`：
- \`retries\`: 失败后最多再试次数
- \`timeout\`: 单次执行超时（ms）
- \`delay\`: 重试间隔（可选）`,
        stubs: {
          'index.ts': `export interface RetryOptions {
  retries: number
  timeout: number
  delay?: number
}

export async function retry<T>(fn: () => Promise<T>, options: RetryOptions): Promise<T> {
  void fn
  void options
  throw new Error('Not implemented')
}
`,
          'index.test.ts': `import { describe, it, expect, vi } from 'vitest'
import { retry } from './index'

describe('retry', () => {
  it('成功则直接返回', async () => {
    await expect(retry(async () => 1, { retries: 2, timeout: 100 })).resolves.toBe(1)
  })

  it('失败后重试直至成功', async () => {
    let n = 0
    const fn = vi.fn(async () => {
      n++
      if (n < 3) throw new Error('fail')
      return 'ok'
    })
    await expect(retry(fn, { retries: 3, timeout: 100, delay: 0 })).resolves.toBe('ok')
    expect(fn).toHaveBeenCalledTimes(3)
  })

  it('超时会失败', async () => {
    await expect(
      retry(async () => new Promise(() => {}), { retries: 0, timeout: 20 }),
    ).rejects.toThrow()
  })
})
`,
        },
        tests: '',
      },
      {
        slug: '08-sleep',
        title: 'sleep',
        desc: `实现 \`sleep(ms)\`：返回在指定毫秒后 resolve 的 Promise。`,
        stubs: {
          'index.ts': `export function sleep(ms: number): Promise<void> {
  void ms
  throw new Error('Not implemented')
}
`,
          'index.test.ts': `import { describe, it, expect, vi } from 'vitest'
import { sleep } from './index'

describe('sleep', () => {
  it('等待指定时间', async () => {
    vi.useFakeTimers()
    const p = sleep(100)
    vi.advanceTimersByTime(100)
    await expect(p).resolves.toBeUndefined()
    vi.useRealTimers()
  })
})
`,
        },
        tests: '',
      },
      {
        slug: '09-traffic-light',
        title: '红绿灯循环',
        desc: `实现红绿灯循环：红灯 N 秒 → 绿灯 N 秒 → 黄灯 N 秒，循环执行，并支持停止。

可用回调或日志记录当前灯色变化。`,
        stubs: {
          'index.ts': `export type Light = 'red' | 'green' | 'yellow'

export interface TrafficLightOptions {
  red: number
  green: number
  yellow: number
  onChange: (light: Light) => void
}

export function createTrafficLight(options: TrafficLightOptions): { start: () => void; stop: () => void } {
  void options
  throw new Error('Not implemented')
}
`,
          'index.test.ts': `import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { createTrafficLight } from './index'

describe('createTrafficLight', () => {
  beforeEach(() => vi.useFakeTimers())
  afterEach(() => vi.useRealTimers())

  it('按红绿黄顺序循环', async () => {
    const onChange = vi.fn()
    const light = createTrafficLight({ red: 1000, green: 1000, yellow: 1000, onChange })
    light.start()
    expect(onChange).toHaveBeenCalledWith('red')
    await vi.advanceTimersByTimeAsync(1000)
    expect(onChange).toHaveBeenCalledWith('green')
    await vi.advanceTimersByTimeAsync(1000)
    expect(onChange).toHaveBeenCalledWith('yellow')
    light.stop()
  })
})
`,
        },
        tests: '',
      },
      {
        slug: '10-promisify',
        title: 'Promisify',
        desc: `实现 \`promisify(fn)\`：将 Node 风格 \`(err, result) => void\` 回调函数转为返回 Promise 的函数。`,
        stubs: {
          'index.ts': `export type NodeCallback<T> = (err: Error | null, result?: T) => void

export function promisify<TArgs extends unknown[], TResult>(
  fn: (...args: [...TArgs, NodeCallback<TResult>]) => void,
): (...args: TArgs) => Promise<TResult> {
  void fn
  throw new Error('Not implemented')
}
`,
          'index.test.ts': `import { describe, it, expect } from 'vitest'
import { promisify } from './index'

describe('promisify', () => {
  it('成功转 resolve', async () => {
    const read = (path: string, cb: (err: Error | null, data?: string) => void) => {
      cb(null, path + '!data')
    }
    const readAsync = promisify(read)
    await expect(readAsync('/a')).resolves.toBe('/a!data')
  })

  it('错误转 reject', async () => {
    const fail = (_: string, cb: (err: Error | null) => void) => cb(new Error('boom'))
    await expect(promisify(fail)('x')).rejects.toThrow('boom')
  })
})
`,
        },
        tests: '',
      },
      {
        slug: '11-pub-sub-observer',
        title: '发布订阅 + 观察者模式',
        desc: `分别实现：
1. 发布订阅 EventEmitter：\`on/off/emit/once\`
2. 观察者模式：Subject 维护观察者列表，状态变化时通知`,
        stubs: {
          'index.ts': `export type Handler = (...args: unknown[]) => void

export class EventEmitter {
  on(event: string, handler: Handler): void {
    void event
    void handler
    throw new Error('Not implemented')
  }
  off(event: string, handler: Handler): void {
    void event
    void handler
    throw new Error('Not implemented')
  }
  emit(event: string, ...args: unknown[]): void {
    void event
    void args
    throw new Error('Not implemented')
  }
  once(event: string, handler: Handler): void {
    void event
    void handler
    throw new Error('Not implemented')
  }
}

export interface Observer<T> {
  update(data: T): void
}

export class Subject<T> {
  subscribe(observer: Observer<T>): void {
    void observer
    throw new Error('Not implemented')
  }
  unsubscribe(observer: Observer<T>): void {
    void observer
    throw new Error('Not implemented')
  }
  notify(data: T): void {
    void data
    throw new Error('Not implemented')
  }
}
`,
          'index.test.ts': `import { describe, it, expect, vi } from 'vitest'
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
`,
        },
        tests: '',
      },
      {
        slug: '12-coding-man',
        title: 'CodingMan',
        desc: `实现可链式调用的 CodingMan：

\`\`\`ts
CodingMan('Pete')
// 输出: Hi! This is Pete!

CodingMan('Pete').sleep(3).eat('dinner')
// Hi! This is Pete!
// 等待 3 秒
// Wake up after 3
// Eat dinner~

CodingMan('Pete').eat('dinner').eat('supper')
CodingMan('Pete').sleepFirst(2).eat('dinner')
\`\`\`

要求支持 \`eat\` / \`sleep\` / \`sleepFirst\` 链式调用与任务队列。`,
        stubs: {
          'index.ts': `export interface CodingManInstance {
  eat(food: string): CodingManInstance
  sleep(seconds: number): CodingManInstance
  sleepFirst(seconds: number): CodingManInstance
}

export function CodingMan(name: string): CodingManInstance {
  void name
  throw new Error('Not implemented')
}
`,
          'index.test.ts': `import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { CodingMan } from './index'

describe('CodingMan', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.spyOn(console, 'log').mockImplementation(() => {})
  })
  afterEach(() => {
    vi.useRealTimers()
    vi.restoreAllMocks()
  })

  it('基础问候', async () => {
    CodingMan('Pete')
    await vi.runAllTimersAsync()
    expect(console.log).toHaveBeenCalledWith('Hi! This is Pete!')
  })

  it('支持 sleep 与 eat', async () => {
    CodingMan('Pete').sleep(1).eat('dinner')
    await vi.runAllTimersAsync()
    expect(console.log).toHaveBeenCalledWith('Wake up after 1')
    expect(console.log).toHaveBeenCalledWith('Eat dinner~')
  })

  it('sleepFirst 优先执行', async () => {
    CodingMan('Pete').sleepFirst(1).eat('dinner')
    await vi.advanceTimersByTimeAsync(0)
    expect(console.log).not.toHaveBeenCalledWith('Hi! This is Pete!')
    await vi.runAllTimersAsync()
    const logs = vi.mocked(console.log).mock.calls.map((c) => c[0])
    expect(logs[0]).toBe('Wake up after 1')
    expect(logs).toContain('Hi! This is Pete!')
  })
})
`,
        },
        tests: '',
      },
    ],
  },
  '02-data-structure': {
    id: '02-data-structure',
    name: '数据结构相关',
    env: 'node + vitest（DOM 题使用 jsdom）',
    problems: [
      {
        slug: '13-array-to-tree',
        title: '数组转树',
        desc: `将扁平数组（含 id / parentId）转换为树结构。`,
        stubs: {
          'index.ts': `export interface FlatNode {
  id: number | string
  parentId: number | string | null
  [key: string]: unknown
}

export interface TreeNode extends FlatNode {
  children?: TreeNode[]
}

export function arrayToTree(list: FlatNode[], rootParentId: FlatNode['parentId'] = null): TreeNode[] {
  void list
  void rootParentId
  throw new Error('Not implemented')
}
`,
          'index.test.ts': `import { describe, it, expect } from 'vitest'
import { arrayToTree } from './index'

describe('arrayToTree', () => {
  it('构建树', () => {
    const list = [
      { id: 1, parentId: null, name: 'a' },
      { id: 2, parentId: 1, name: 'b' },
      { id: 3, parentId: 1, name: 'c' },
      { id: 4, parentId: 2, name: 'd' },
    ]
    const tree = arrayToTree(list)
    expect(tree).toHaveLength(1)
    expect(tree[0].children?.map((n) => n.id)).toEqual([2, 3])
    expect(tree[0].children?.[0].children?.[0].id).toBe(4)
  })
})
`,
        },
        tests: '',
      },
      {
        slug: '14-tree-to-array',
        title: '树转数组',
        desc: `将树结构拍平为含 parentId 的数组。`,
        stubs: {
          'index.ts': `export interface TreeNode {
  id: number | string
  children?: TreeNode[]
  [key: string]: unknown
}

export interface FlatNode {
  id: number | string
  parentId: number | string | null
  [key: string]: unknown
}

export function treeToArray(tree: TreeNode[]): FlatNode[] {
  void tree
  throw new Error('Not implemented')
}
`,
          'index.test.ts': `import { describe, it, expect } from 'vitest'
import { treeToArray } from './index'

describe('treeToArray', () => {
  it('拍平树', () => {
    const tree = [
      {
        id: 1,
        name: 'a',
        children: [{ id: 2, name: 'b', children: [{ id: 4, name: 'd' }] }, { id: 3, name: 'c' }],
      },
    ]
    const list = treeToArray(tree)
    expect(list.find((n) => n.id === 1)?.parentId).toBeNull()
    expect(list.find((n) => n.id === 2)?.parentId).toBe(1)
    expect(list.find((n) => n.id === 4)?.parentId).toBe(2)
  })
})
`,
        },
        tests: '',
      },
      {
        slug: '15-path-to-tree',
        title: '路径字符串转树',
        desc: `将路径字符串数组（如 \`a/b/c\`）转换为树。`,
        stubs: {
          'index.ts': `export interface PathTreeNode {
  name: string
  children: PathTreeNode[]
}

export function pathToTree(paths: string[]): PathTreeNode[] {
  void paths
  throw new Error('Not implemented')
}
`,
          'index.test.ts': `import { describe, it, expect } from 'vitest'
import { pathToTree } from './index'

describe('pathToTree', () => {
  it('路径转树', () => {
    const tree = pathToTree(['a/b/c', 'a/b/d', 'a/e'])
    expect(tree).toHaveLength(1)
    expect(tree[0].name).toBe('a')
    expect(tree[0].children.map((n) => n.name).sort()).toEqual(['b', 'e'])
  })
})
`,
        },
        tests: '',
      },
      {
        slug: '16-indent-to-tree',
        title: '按缩进构造树',
        desc: `根据缩进层级（空格或 tab）将文本行构造成树。`,
        stubs: {
          'index.ts': `export interface IndentNode {
  name: string
  children: IndentNode[]
}

export function indentToTree(text: string): IndentNode[] {
  void text
  throw new Error('Not implemented')
}
`,
          'index.test.ts': `import { describe, it, expect } from 'vitest'
import { indentToTree } from './index'

describe('indentToTree', () => {
  it('按缩进建树', () => {
    const text = \`a
  b
    c
  d
e\`
    const tree = indentToTree(text)
    expect(tree.map((n) => n.name)).toEqual(['a', 'e'])
    expect(tree[0].children.map((n) => n.name)).toEqual(['b', 'd'])
    expect(tree[0].children[0].children[0].name).toBe('c')
  })
}
`,
        },
        tests: '',
      },
      {
        slug: '17-binary-tree-traverse',
        title: '二叉树遍历',
        desc: `实现二叉树的前序 / 中序 / 后序 / 层序遍历（递归或迭代均可，建议都掌握）。`,
        stubs: {
          'index.ts': `export interface TreeNode {
  val: number
  left: TreeNode | null
  right: TreeNode | null
}

export function preorder(root: TreeNode | null): number[] {
  void root
  throw new Error('Not implemented')
}
export function inorder(root: TreeNode | null): number[] {
  void root
  throw new Error('Not implemented')
}
export function postorder(root: TreeNode | null): number[] {
  void root
  throw new Error('Not implemented')
}
export function levelOrder(root: TreeNode | null): number[][] {
  void root
  throw new Error('Not implemented')
}
`,
          'index.test.ts': `import { describe, it, expect } from 'vitest'
import { preorder, inorder, postorder, levelOrder, type TreeNode } from './index'

const tree: TreeNode = {
  val: 1,
  left: { val: 2, left: { val: 4, left: null, right: null }, right: { val: 5, left: null, right: null } },
  right: { val: 3, left: null, right: null },
}

describe('binary tree traverse', () => {
  it('前中后层序', () => {
    expect(preorder(tree)).toEqual([1, 2, 4, 5, 3])
    expect(inorder(tree)).toEqual([4, 2, 5, 1, 3])
    expect(postorder(tree)).toEqual([4, 5, 2, 3, 1])
    expect(levelOrder(tree)).toEqual([[1], [2, 3], [4, 5]])
  })
})
`,
        },
        tests: '',
      },
      {
        slug: '18-dom-tree-traverse',
        title: 'DOM 树遍历',
        desc: `实现 DOM 树的深度优先与广度优先遍历，返回节点 tagName 列表。`,
        stubs: {
          'index.ts': `export function dfsTraverse(root: Element): string[] {
  void root
  throw new Error('Not implemented')
}

export function bfsTraverse(root: Element): string[] {
  void root
  throw new Error('Not implemented')
}
`,
          'index.test.ts': `import { describe, it, expect } from 'vitest'
import { dfsTraverse, bfsTraverse } from './index'

describe('DOM traverse', () => {
  it('dfs/bfs', () => {
    document.body.innerHTML = \`
      <div id="root">
        <span><i></i></span>
        <p></p>
      </div>
    \`
    const root = document.querySelector('#root')!
    expect(dfsTraverse(root).map((t) => t.toUpperCase())).toEqual(['DIV', 'SPAN', 'I', 'P'])
    expect(bfsTraverse(root).map((t) => t.toUpperCase())).toEqual(['DIV', 'SPAN', 'P', 'I'])
  })
}
`,
        },
        tests: '',
      },
      {
        slug: '19-lru-cache',
        title: 'LRU 缓存',
        desc: `实现 LRU Cache：\`get\` / \`put\`，容量满时淘汰最久未使用的键。建议 Map 或双向链表 + HashMap。`,
        stubs: {
          'index.ts': `export class LRUCache {
  constructor(private capacity: number) {
    void capacity
  }

  get(key: number): number {
    void key
    throw new Error('Not implemented')
  }

  put(key: number, value: number): void {
    void key
    void value
    throw new Error('Not implemented')
  }
}
`,
          'index.test.ts': `import { describe, it, expect } from 'vitest'
import { LRUCache } from './index'

describe('LRUCache', () => {
  it('基本淘汰', () => {
    const cache = new LRUCache(2)
    cache.put(1, 1)
    cache.put(2, 2)
    expect(cache.get(1)).toBe(1)
    cache.put(3, 3)
    expect(cache.get(2)).toBe(-1)
    cache.put(4, 4)
    expect(cache.get(1)).toBe(-1)
    expect(cache.get(3)).toBe(3)
    expect(cache.get(4)).toBe(4)
  })
})
`,
        },
        tests: '',
      },
      {
        slug: '20-sorts',
        title: '四大排序',
        desc: `实现冒泡、快排、归并、堆排序（任选稳定实现），输入数字数组，返回升序新数组或原地排序均可，但测试期望返回排序后的数组。`,
        stubs: {
          'index.ts': `export function bubbleSort(arr: number[]): number[] {
  void arr
  throw new Error('Not implemented')
}
export function quickSort(arr: number[]): number[] {
  void arr
  throw new Error('Not implemented')
}
export function mergeSort(arr: number[]): number[] {
  void arr
  throw new Error('Not implemented')
}
export function heapSort(arr: number[]): number[] {
  void arr
  throw new Error('Not implemented')
}
`,
          'index.test.ts': `import { describe, it, expect } from 'vitest'
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
`,
        },
        tests: '',
      },
      {
        slug: '21-course-schedule',
        title: '课程表（图的环检测）',
        desc: `给定课程数 \`numCourses\` 与先修关系 \`prerequisites\`（\`[ai, bi]\` 表示修 ai 前必须修 bi），判断是否可能修完所有课程（检测有向图是否有环）。`,
        stubs: {
          'index.ts': `export function canFinish(numCourses: number, prerequisites: number[][]): boolean {
  void numCourses
  void prerequisites
  throw new Error('Not implemented')
}
`,
          'index.test.ts': `import { describe, it, expect } from 'vitest'
import { canFinish } from './index'

describe('canFinish', () => {
  it('无环可完成', () => {
    expect(canFinish(2, [[1, 0]])).toBe(true)
  })
  it('有环不可完成', () => {
    expect(canFinish(2, [[1, 0], [0, 1]])).toBe(false)
  })
})
`,
        },
        tests: '',
      },
      {
        slug: '22-path-sum',
        title: '路径总和',
        desc: `判断二叉树中是否存在根到叶子路径，节点值之和等于 targetSum。`,
        stubs: {
          'index.ts': `export interface TreeNode {
  val: number
  left: TreeNode | null
  right: TreeNode | null
}

export function hasPathSum(root: TreeNode | null, targetSum: number): boolean {
  void root
  void targetSum
  throw new Error('Not implemented')
}
`,
          'index.test.ts': `import { describe, it, expect } from 'vitest'
import { hasPathSum, type TreeNode } from './index'

describe('hasPathSum', () => {
  it('存在路径', () => {
    const root: TreeNode = {
      val: 5,
      left: {
        val: 4,
        left: { val: 11, left: { val: 7, left: null, right: null }, right: { val: 2, left: null, right: null } },
        right: null,
      },
      right: {
        val: 8,
        left: { val: 13, left: null, right: null },
        right: { val: 4, left: null, right: { val: 1, left: null, right: null } },
      },
    }
    expect(hasPathSum(root, 22)).toBe(true)
  })

  it('空树', () => {
    expect(hasPathSum(null, 0)).toBe(false)
  })
})
`,
        },
        tests: '',
      },
    ],
  },
  '03-array-object': {
    id: '03-array-object',
    name: '数组与对象',
    env: 'node + vitest',
    problems: [
      {
        slug: '23-deep-clone',
        title: '深拷贝',
        desc: `实现深拷贝，至少支持：普通对象/数组、Date、RegExp、Map/Set、循环引用。`,
        stubs: {
          'index.ts': `export function deepClone<T>(value: T): T {
  void value
  throw new Error('Not implemented')
}
`,
          'index.test.ts': `import { describe, it, expect } from 'vitest'
import { deepClone } from './index'

describe('deepClone', () => {
  it('深拷贝对象与数组', () => {
    const obj = { a: 1, b: { c: [2, 3] } }
    const cloned = deepClone(obj)
    expect(cloned).toEqual(obj)
    expect(cloned).not.toBe(obj)
    expect(cloned.b).not.toBe(obj.b)
  })

  it('处理循环引用', () => {
    const obj: any = { a: 1 }
    obj.self = obj
    const cloned = deepClone(obj)
    expect(cloned.self).toBe(cloned)
  })

  it('Date / RegExp', () => {
    const obj = { d: new Date('2020-01-01'), r: /ab/gi }
    const cloned = deepClone(obj)
    expect(cloned.d).toEqual(obj.d)
    expect(cloned.d).not.toBe(obj.d)
    expect(cloned.r).toEqual(obj.r)
    expect(cloned.r).not.toBe(obj.r)
  })
})
`,
        },
        tests: '',
      },
      {
        slug: '24-deep-equal',
        title: '深度比较 deepEqual',
        desc: `实现 \`deepEqual(a, b)\`，比较对象/数组深层相等。`,
        stubs: {
          'index.ts': `export function deepEqual(a: unknown, b: unknown): boolean {
  void a
  void b
  throw new Error('Not implemented')
}
`,
          'index.test.ts': `import { describe, it, expect } from 'vitest'
import { deepEqual } from './index'

describe('deepEqual', () => {
  it('基本相等', () => {
    expect(deepEqual({ a: [1, 2] }, { a: [1, 2] })).toBe(true)
    expect(deepEqual({ a: 1 }, { a: 2 })).toBe(false)
  })
})
`,
        },
        tests: '',
      },
      {
        slug: '25-lodash-get',
        title: 'lodash get',
        desc: `实现 \`get(object, path, defaultValue)\`，path 支持 \`'a.b[0].c'\` 与 \`['a','b',0,'c']\`。`,
        stubs: {
          'index.ts': `export function get(object: unknown, path: string | Array<string | number>, defaultValue?: unknown): unknown {
  void object
  void path
  void defaultValue
  throw new Error('Not implemented')
}
`,
          'index.test.ts': `import { describe, it, expect } from 'vitest'
import { get } from './index'

describe('get', () => {
  const obj = { a: { b: [{ c: 3 }] } }
  it('点路径与数组路径', () => {
    expect(get(obj, 'a.b[0].c')).toBe(3)
    expect(get(obj, ['a', 'b', 0, 'c'])).toBe(3)
  })
  it('默认值', () => {
    expect(get(obj, 'a.x', 9)).toBe(9)
  })
})
`,
        },
        tests: '',
      },
      {
        slug: '26-lodash-set',
        title: 'lodash set',
        desc: `实现 \`set(object, path, value)\`，沿路径设置值，中间不存在则创建。`,
        stubs: {
          'index.ts': `export function set(
  object: Record<string, unknown>,
  path: string | Array<string | number>,
  value: unknown,
): Record<string, unknown> {
  void object
  void path
  void value
  throw new Error('Not implemented')
}
`,
          'index.test.ts': `import { describe, it, expect } from 'vitest'
import { set } from './index'

describe('set', () => {
  it('设置深层路径', () => {
    const obj: Record<string, unknown> = {}
    set(obj, 'a.b[0].c', 3)
    expect(obj).toEqual({ a: { b: [{ c: 3 }] } })
  })
})
`,
        },
        tests: '',
      },
      {
        slug: '27-get-type',
        title: 'getType 类型判断',
        desc: `实现精确类型判断，返回如 \`'string' | 'array' | 'null' | 'date'\` 等小写类型名。`,
        stubs: {
          'index.ts': `export function getType(value: unknown): string {
  void value
  throw new Error('Not implemented')
}
`,
          'index.test.ts': `import { describe, it, expect } from 'vitest'
import { getType } from './index'

describe('getType', () => {
  it('常见类型', () => {
    expect(getType(null)).toBe('null')
    expect(getType([])).toBe('array')
    expect(getType(new Date())).toBe('date')
    expect(getType(/a/)).toBe('regexp')
    expect(getType(1)).toBe('number')
  })
})
`,
        },
        tests: '',
      },
      {
        slug: '28-array-flat',
        title: '数组扁平化 flat',
        desc: `实现 \`flat(arr, depth = 1)\`，支持指定深度，\`Infinity\` 完全扁平。`,
        stubs: {
          'index.ts': `export function flat(arr: unknown[], depth = 1): unknown[] {
  void arr
  void depth
  throw new Error('Not implemented')
}
`,
          'index.test.ts': `import { describe, it, expect } from 'vitest'
import { flat } from './index'

describe('flat', () => {
  it('默认 depth=1', () => {
    expect(flat([1, [2, [3]]])).toEqual([1, 2, [3]])
  })
  it('Infinity', () => {
    expect(flat([1, [2, [3]]], Infinity)).toEqual([1, 2, 3])
  })
})
`,
        },
        tests: '',
      },
      {
        slug: '29-flatten-object',
        title: '对象扁平化 flattenObj',
        desc: `将嵌套对象扁平化为 \`{ 'a.b.c': 1 }\` 形式。`,
        stubs: {
          'index.ts': `export function flattenObj(obj: Record<string, unknown>, prefix = ''): Record<string, unknown> {
  void obj
  void prefix
  throw new Error('Not implemented')
}
`,
          'index.test.ts': `import { describe, it, expect } from 'vitest'
import { flattenObj } from './index'

describe('flattenObj', () => {
  it('扁平化', () => {
    expect(flattenObj({ a: { b: { c: 1 }, d: 2 } })).toEqual({ 'a.b.c': 1, 'a.d': 2 })
  })
})
`,
        },
        tests: '',
      },
      {
        slug: '30-array-unique',
        title: '数组去重',
        desc: `实现数组去重，至少支持原始值；可选支持对象（可按 JSON 或自定义 key）。`,
        stubs: {
          'index.ts': `export function unique<T>(arr: T[]): T[] {
  void arr
  throw new Error('Not implemented')
}
`,
          'index.test.ts': `import { describe, it, expect } from 'vitest'
import { unique } from './index'

describe('unique', () => {
  it('原始值去重', () => {
    expect(unique([1, 1, 2, 3, 2])).toEqual([1, 2, 3])
    expect(unique(['a', 'a', 'b'])).toEqual(['a', 'b'])
  })
})
`,
        },
        tests: '',
      },
      {
        slug: '31-array-methods',
        title: '数组方法实现（map/filter/reduce）',
        desc: `手写 \`myMap\` / \`myFilter\` / \`myReduce\`，行为对齐原生方法（挂载到原型或独立函数均可，本项目用独立函数）。`,
        stubs: {
          'index.ts': `export function myMap<T, U>(arr: T[], fn: (item: T, index: number, array: T[]) => U): U[] {
  void arr
  void fn
  throw new Error('Not implemented')
}

export function myFilter<T>(arr: T[], fn: (item: T, index: number, array: T[]) => unknown): T[] {
  void arr
  void fn
  throw new Error('Not implemented')
}

export function myReduce<T, U>(
  arr: T[],
  fn: (acc: U, item: T, index: number, array: T[]) => U,
  init: U,
): U {
  void arr
  void fn
  void init
  throw new Error('Not implemented')
}
`,
          'index.test.ts': `import { describe, it, expect } from 'vitest'
import { myMap, myFilter, myReduce } from './index'

describe('array methods', () => {
  it('map/filter/reduce', () => {
    expect(myMap([1, 2], (x) => x * 2)).toEqual([2, 4])
    expect(myFilter([1, 2, 3], (x) => x > 1)).toEqual([2, 3])
    expect(myReduce([1, 2, 3], (a, b) => a + b, 0)).toBe(6)
  })
})
`,
        },
        tests: '',
      },
      {
        slug: '32-omit-pick',
        title: 'Omit / Pick（JS + TS 类型）',
        desc: `实现运行时 \`pick\` / \`omit\`，并补充 TS 工具类型 \`MyPick\` / \`MyOmit\`。`,
        stubs: {
          'index.ts': `export type MyPick<T, K extends keyof T> = {
  // TODO
  [P in K]: T[P]
}

export type MyOmit<T, K extends keyof T> = {
  // TODO: 可用 Exclude
  [P in Exclude<keyof T, K>]: T[P]
}

export function pick<T extends object, K extends keyof T>(obj: T, keys: K[]): MyPick<T, K> {
  void obj
  void keys
  throw new Error('Not implemented')
}

export function omit<T extends object, K extends keyof T>(obj: T, keys: K[]): MyOmit<T, K> {
  void obj
  void keys
  throw new Error('Not implemented')
}
`,
          'index.test.ts': `import { describe, it, expect } from 'vitest'
import { pick, omit } from './index'

describe('pick/omit', () => {
  const obj = { a: 1, b: 2, c: 3 }
  it('pick', () => {
    expect(pick(obj, ['a', 'c'])).toEqual({ a: 1, c: 3 })
  })
  it('omit', () => {
    expect(omit(obj, ['b'])).toEqual({ a: 1, c: 3 })
  })
})
`,
        },
        tests: '',
      },
    ],
  },
  '04-utils': {
    id: '04-utils',
    name: '工具函数',
    env: 'node + vitest（Cookie/HTML 题使用 jsdom）',
    problems: [
      {
        slug: '33-debounce',
        title: '防抖 debounce',
        desc: `实现 debounce，支持 \`leading\` / \`trailing\`（至少实现 trailing；有余力可加 cancel）。`,
        stubs: {
          'index.ts': `export function debounce<T extends (...args: any[]) => any>(
  fn: T,
  wait: number,
): ((...args: Parameters<T>) => void) & { cancel: () => void } {
  void fn
  void wait
  throw new Error('Not implemented')
}
`,
          'index.test.ts': `import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { debounce } from './index'

describe('debounce', () => {
  beforeEach(() => vi.useFakeTimers())
  afterEach(() => vi.useRealTimers())

  it('只执行最后一次', () => {
    const fn = vi.fn()
    const d = debounce(fn, 100)
    d(1)
    d(2)
    d(3)
    vi.advanceTimersByTime(100)
    expect(fn).toHaveBeenCalledTimes(1)
    expect(fn).toHaveBeenCalledWith(3)
  })
})
`,
        },
        tests: '',
      },
      {
        slug: '34-throttle',
        title: '节流 throttle',
        desc: `实现 throttle，在 wait 时间内最多执行一次。`,
        stubs: {
          'index.ts': `export function throttle<T extends (...args: any[]) => any>(
  fn: T,
  wait: number,
): (...args: Parameters<T>) => void {
  void fn
  void wait
  throw new Error('Not implemented')
}
`,
          'index.test.ts': `import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { throttle } from './index'

describe('throttle', () => {
  beforeEach(() => vi.useFakeTimers())
  afterEach(() => vi.useRealTimers())

  it('间隔内只执行一次', () => {
    const fn = vi.fn()
    const t = throttle(fn, 100)
    t(1)
    t(2)
    expect(fn).toHaveBeenCalledTimes(1)
    vi.advanceTimersByTime(100)
    t(3)
    expect(fn).toHaveBeenCalledTimes(2)
  })
})
`,
        },
        tests: '',
      },
      {
        slug: '35-curry',
        title: '柯里化 curry',
        desc: `实现函数柯里化：\`curry(fn)(a)(b)(c)\` 与 \`curry(fn)(a, b)(c)\` 均可。`,
        stubs: {
          'index.ts': `export function curry(fn: (...args: any[]) => any): any {
  void fn
  throw new Error('Not implemented')
}
`,
          'index.test.ts': `import { describe, it, expect } from 'vitest'
import { curry } from './index'

describe('curry', () => {
  it('分步传参', () => {
    const add = (a: number, b: number, c: number) => a + b + c
    const curried = curry(add)
    expect(curried(1)(2)(3)).toBe(6)
    expect(curried(1, 2)(3)).toBe(6)
  })
})
`,
        },
        tests: '',
      },
      {
        slug: '36-compose-pipe',
        title: 'compose / pipe',
        desc: `实现 \`compose\`（从右到左）与 \`pipe\`（从左到右）。`,
        stubs: {
          'index.ts': `export function compose(...fns: Array<(...args: any[]) => any>): (...args: any[]) => any {
  void fns
  throw new Error('Not implemented')
}

export function pipe(...fns: Array<(...args: any[]) => any>): (...args: any[]) => any {
  void fns
  throw new Error('Not implemented')
}
`,
          'index.test.ts': `import { describe, it, expect } from 'vitest'
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
`,
        },
        tests: '',
      },
      {
        slug: '37-call-apply-bind',
        title: 'call / apply / bind',
        desc: `手写 \`myCall\` / \`myApply\` / \`myBind\`（可扩展 Function.prototype，或导出独立函数）。`,
        stubs: {
          'index.ts': `export function myCall<T extends (...args: any[]) => any>(
  fn: T,
  thisArg: unknown,
  ...args: Parameters<T>
): ReturnType<T> {
  void fn
  void thisArg
  void args
  throw new Error('Not implemented')
}

export function myApply<T extends (...args: any[]) => any>(
  fn: T,
  thisArg: unknown,
  args: Parameters<T> | unknown[] = [],
): ReturnType<T> {
  void fn
  void thisArg
  void args
  throw new Error('Not implemented')
}

export function myBind<T extends (...args: any[]) => any>(
  fn: T,
  thisArg: unknown,
  ...args: any[]
): (...rest: any[]) => ReturnType<T> {
  void fn
  void thisArg
  void args
  throw new Error('Not implemented')
}
`,
          'index.test.ts': `import { describe, it, expect } from 'vitest'
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
`,
        },
        tests: '',
      },
      {
        slug: '38-new-instanceof',
        title: 'new / instanceof',
        desc: `手写 \`myNew\` 与 \`myInstanceof\`。`,
        stubs: {
          'index.ts': `export function myNew<T extends new (...args: any[]) => any>(
  Ctor: T,
  ...args: ConstructorParameters<T>
): InstanceType<T> {
  void Ctor
  void args
  throw new Error('Not implemented')
}

export function myInstanceof(obj: unknown, Ctor: Function): boolean {
  void obj
  void Ctor
  throw new Error('Not implemented')
}
`,
          'index.test.ts': `import { describe, it, expect } from 'vitest'
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
`,
        },
        tests: '',
      },
      {
        slug: '39-inherit',
        title: '继承',
        desc: `实现寄生组合式继承 \`inherit(Child, Parent)\`，使 Child 继承 Parent 原型方法且正确连接构造函数。`,
        stubs: {
          'index.ts': `export function inherit(Child: Function, Parent: Function): void {
  void Child
  void Parent
  throw new Error('Not implemented')
}
`,
          'index.test.ts': `import { describe, it, expect } from 'vitest'
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
`,
        },
        tests: '',
      },
      {
        slug: '40-thousand-separator',
        title: '千分位格式化',
        desc: `将数字格式化为千分位字符串，如 \`1234567.89 -> '1,234,567.89'\`。`,
        stubs: {
          'index.ts': `export function formatThousand(num: number | string): string {
  void num
  throw new Error('Not implemented')
}
`,
          'index.test.ts': `import { describe, it, expect } from 'vitest'
import { formatThousand } from './index'

describe('formatThousand', () => {
  it('整数与小数', () => {
    expect(formatThousand(1234567)).toBe('1,234,567')
    expect(formatThousand(1234567.89)).toBe('1,234,567.89')
  })
})
`,
        },
        tests: '',
      },
      {
        slug: '41-parse-url',
        title: 'URL 解析',
        desc: `解析 URL，返回协议、host、path、hash、query 对象等。`,
        stubs: {
          'index.ts': `export interface ParsedURL {
  protocol: string
  host: string
  pathname: string
  hash: string
  query: Record<string, string>
}

export function parseURL(url: string): ParsedURL {
  void url
  throw new Error('Not implemented')
}
`,
          'index.test.ts': `import { describe, it, expect } from 'vitest'
import { parseURL } from './index'

describe('parseURL', () => {
  it('解析 query 与 hash', () => {
    const r = parseURL('https://example.com/a/b?x=1&y=2#hash')
    expect(r.protocol).toBe('https:')
    expect(r.host).toBe('example.com')
    expect(r.pathname).toBe('/a/b')
    expect(r.query).toEqual({ x: '1', y: '2' })
    expect(r.hash).toBe('#hash')
  })
})
`,
        },
        tests: '',
      },
      {
        slug: '42-case-convert',
        title: '驼峰转换',
        desc: `实现 \`camelCase\` 与 \`snakeCase\` / \`kebabCase\` 互转。`,
        stubs: {
          'index.ts': `export function toCamelCase(str: string): string {
  void str
  throw new Error('Not implemented')
}

export function toSnakeCase(str: string): string {
  void str
  throw new Error('Not implemented')
}

export function toKebabCase(str: string): string {
  void str
  throw new Error('Not implemented')
}
`,
          'index.test.ts': `import { describe, it, expect } from 'vitest'
import { toCamelCase, toSnakeCase, toKebabCase } from './index'

describe('case convert', () => {
  it('互转', () => {
    expect(toCamelCase('hello_world-test')).toBe('helloWorldTest')
    expect(toSnakeCase('helloWorldTest')).toBe('hello_world_test')
    expect(toKebabCase('helloWorldTest')).toBe('hello-world-test')
  })
})
`,
        },
        tests: '',
      },
      {
        slug: '43-big-number-add',
        title: '大数相加',
        desc: `以字符串形式实现大数相加。`,
        stubs: {
          'index.ts': `export function addBigNumber(a: string, b: string): string {
  void a
  void b
  throw new Error('Not implemented')
}
`,
          'index.test.ts': `import { describe, it, expect } from 'vitest'
import { addBigNumber } from './index'

describe('addBigNumber', () => {
  it('大数相加', () => {
    expect(addBigNumber('999', '1')).toBe('1000')
    expect(addBigNumber('12345678901234567890', '98765432109876543210')).toBe(
      '111111111011111111100',
    )
  })
})
`,
        },
        tests: '',
      },
      {
        slug: '44-timeout-interval',
        title: 'setTimeout ⇄ setInterval',
        desc: `用 setTimeout 实现 setInterval，以及用 setInterval 实现 setTimeout，并支持清除。`,
        stubs: {
          'index.ts': `export function mySetInterval(fn: () => void, delay: number): { clear: () => void } {
  void fn
  void delay
  throw new Error('Not implemented')
}

export function mySetTimeout(fn: () => void, delay: number): { clear: () => void } {
  void fn
  void delay
  throw new Error('Not implemented')
}
`,
          'index.test.ts': `import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { mySetInterval, mySetTimeout } from './index'

describe('timeout/interval', () => {
  beforeEach(() => vi.useFakeTimers())
  afterEach(() => vi.useRealTimers())

  it('mySetInterval', () => {
    const fn = vi.fn()
    const timer = mySetInterval(fn, 100)
    vi.advanceTimersByTime(350)
    expect(fn).toHaveBeenCalledTimes(3)
    timer.clear()
    vi.advanceTimersByTime(200)
    expect(fn).toHaveBeenCalledTimes(3)
  })

  it('mySetTimeout', () => {
    const fn = vi.fn()
    mySetTimeout(fn, 100)
    vi.advanceTimersByTime(99)
    expect(fn).not.toHaveBeenCalled()
    vi.advanceTimersByTime(1)
    expect(fn).toHaveBeenCalledTimes(1)
  })
})
`,
        },
        tests: '',
      },
      {
        slug: '45-format-time',
        title: '时间格式化',
        desc: `实现 \`formatTime(date, 'YYYY-MM-DD HH:mm:ss')\` 之类的格式化。`,
        stubs: {
          'index.ts': `export function formatTime(date: Date, format: string): string {
  void date
  void format
  throw new Error('Not implemented')
}
`,
          'index.test.ts': `import { describe, it, expect } from 'vitest'
import { formatTime } from './index'

describe('formatTime', () => {
  it('格式化', () => {
    const d = new Date('2024-01-02T03:04:05')
    expect(formatTime(d, 'YYYY-MM-DD HH:mm:ss')).toBe('2024-01-02 03:04:05')
  })
})
`,
        },
        tests: '',
      },
      {
        slug: '46-random-int',
        title: 'randomInt',
        desc: `实现 \`randomInt(min, max)\`，返回 [min, max] 闭区间整数，分布尽量均匀。`,
        stubs: {
          'index.ts': `export function randomInt(min: number, max: number): number {
  void min
  void max
  throw new Error('Not implemented')
}
`,
          'index.test.ts': `import { describe, it, expect } from 'vitest'
import { randomInt } from './index'

describe('randomInt', () => {
  it('落在闭区间', () => {
    for (let i = 0; i < 100; i++) {
      const n = randomInt(1, 3)
      expect(n).toBeGreaterThanOrEqual(1)
      expect(n).toBeLessThanOrEqual(3)
      expect(Number.isInteger(n)).toBe(true)
    }
  })
})
`,
        },
        tests: '',
      },
      {
        slug: '47-get-cookie',
        title: 'getCookie',
        desc: `实现 \`getCookie(name)\` / \`parseCookies(cookieStr)\`。`,
        stubs: {
          'index.ts': `export function parseCookies(cookieStr: string): Record<string, string> {
  void cookieStr
  throw new Error('Not implemented')
}

export function getCookie(name: string, cookieStr = typeof document !== 'undefined' ? document.cookie : ''): string | undefined {
  void name
  void cookieStr
  throw new Error('Not implemented')
}
`,
          'index.test.ts': `import { describe, it, expect } from 'vitest'
import { parseCookies, getCookie } from './index'

describe('cookie', () => {
  it('解析与读取', () => {
    const str = 'a=1; b=hello%20world; c=3'
    expect(parseCookies(str)).toEqual({ a: '1', b: 'hello world', c: '3' })
    expect(getCookie('b', str)).toBe('hello world')
  })
})
`,
        },
        tests: '',
      },
      {
        slug: '48-visit-count',
        title: '访问次数统计',
        desc: `实现函数，统计字符串中各字符出现次数，返回对象或 Map。`,
        stubs: {
          'index.ts': `export function countVisits(input: string): Record<string, number> {
  void input
  throw new Error('Not implemented')
}
`,
          'index.test.ts': `import { describe, it, expect } from 'vitest'
import { countVisits } from './index'

describe('countVisits', () => {
  it('统计次数', () => {
    expect(countVisits('aab')).toEqual({ a: 2, b: 1 })
  })
})
`,
        },
        tests: '',
      },
      {
        slug: '49-add-curry',
        title: '闭包加法 add(1)(2)(3)',
        desc: `实现无限柯里化加法：\`add(1)(2)(3)\` 可继续调用；通过 \`valueOf\`/\`toString\` 或调用空参得到结果。本项目约定：\`add(1)(2)(3)() === 6\`。`,
        stubs: {
          'index.ts': `export function add(x?: number): any {
  void x
  throw new Error('Not implemented')
}
`,
          'index.test.ts': `import { describe, it, expect } from 'vitest'
import { add } from './index'

describe('add curry', () => {
  it('无限累加', () => {
    expect(add(1)(2)(3)()).toBe(6)
    expect(add(1)(2)(3)(4)()).toBe(10)
  })
})
`,
        },
        tests: '',
      },
      {
        slug: '50-remove-min-chars',
        title: '去除最少字符',
        desc: `删除最少的字符，使字符串中所有剩余字符出现次数相同；若有多种方案，返回字典序最小结果（按常见面试题约定实现即可，详见测试）。`,
        stubs: {
          'index.ts': `export function removeMinChars(s: string): string {
  void s
  throw new Error('Not implemented')
}
`,
          'index.test.ts': `import { describe, it, expect } from 'vitest'
import { removeMinChars } from './index'

describe('removeMinChars', () => {
  it('使频次一致且删除最少', () => {
    // 示例：保留出现次数相同的字符集；具体策略以实现与测试一致为准
    const result = removeMinChars('aaabbc')
    const freq: Record<string, number> = {}
    for (const ch of result) freq[ch] = (freq[ch] ?? 0) + 1
    const values = Object.values(freq)
    expect(new Set(values).size).toBeLessThanOrEqual(1)
  })
})
`,
        },
        tests: '',
      },
      {
        slug: '51-extract-html-text',
        title: '提取 HTML 文字',
        desc: `从 HTML 字符串中提取纯文本（去掉标签）。`,
        stubs: {
          'index.ts': `export function extractHtmlText(html: string): string {
  void html
  throw new Error('Not implemented')
}
`,
          'index.test.ts': `import { describe, it, expect } from 'vitest'
import { extractHtmlText } from './index'

describe('extractHtmlText', () => {
  it('提取文本', () => {
    expect(extractHtmlText('<div>hello <b>world</b></div>')).toBe('hello world')
  })
})
`,
        },
        tests: '',
      },
    ],
  },
  '05-react-components': {
    id: '05-react-components',
    name: 'React 组件',
    env: 'React 19 + Vitest + Testing Library + jsdom',
    problems: [
      {
        slug: '52-counter',
        title: 'Counter 计数器',
        desc: `实现 Counter 组件：显示计数，支持 + / - / reset。`,
        stubs: {
          'index.tsx': `import { useState } from 'react'

export interface CounterProps {
  initial?: number
}

export function Counter({ initial = 0 }: CounterProps) {
  // TODO
  void useState
  void initial
  return <div>Not implemented</div>
}
`,
          'index.test.tsx': `import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Counter } from './index'

describe('Counter', () => {
  it('增减与重置', async () => {
    const user = userEvent.setup()
    render(<Counter initial={0} />)
    expect(screen.getByTestId('value')).toHaveTextContent('0')
    await user.click(screen.getByRole('button', { name: '+' }))
    expect(screen.getByTestId('value')).toHaveTextContent('1')
    await user.click(screen.getByRole('button', { name: '-' }))
    expect(screen.getByTestId('value')).toHaveTextContent('0')
    await user.click(screen.getByRole('button', { name: '+' }))
    await user.click(screen.getByRole('button', { name: /reset/i }))
    expect(screen.getByTestId('value')).toHaveTextContent('0')
  })
})
`,
        },
        tests: '',
      },
      {
        slug: '53-todo-list',
        title: 'TodoList',
        desc: `实现 TodoList：新增、切换完成、删除。`,
        stubs: {
          'index.tsx': `export function TodoList() {
  return <div>Not implemented</div>
}
`,
          'index.test.tsx': `import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { TodoList } from './index'

describe('TodoList', () => {
  it('增删改完成态', async () => {
    const user = userEvent.setup()
    render(<TodoList />)
    await user.type(screen.getByPlaceholderText(/todo/i), '写题')
    await user.click(screen.getByRole('button', { name: /add|添加/i }))
    expect(screen.getByText('写题')).toBeInTheDocument()
    await user.click(screen.getByRole('checkbox'))
    expect(screen.getByText('写题').closest('li')).toHaveAttribute('data-done', 'true')
    await user.click(screen.getByRole('button', { name: /delete|删除/i }))
    expect(screen.queryByText('写题')).not.toBeInTheDocument()
  })
})
`,
        },
        tests: '',
      },
      {
        slug: '54-countdown',
        title: 'CountDown 倒计时',
        desc: `实现倒计时组件：传入秒数，每秒 -1，到 0 触发 onEnd。`,
        stubs: {
          'index.tsx': `export interface CountDownProps {
  seconds: number
  onEnd?: () => void
}

export function CountDown(_props: CountDownProps) {
  return <div>Not implemented</div>
}
`,
          'index.test.tsx': `import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, act } from '@testing-library/react'
import { CountDown } from './index'

describe('CountDown', () => {
  beforeEach(() => vi.useFakeTimers())
  afterEach(() => vi.useRealTimers())

  it('倒计时到 0', () => {
    const onEnd = vi.fn()
    render(<CountDown seconds={2} onEnd={onEnd} />)
    expect(screen.getByTestId('countdown')).toHaveTextContent('2')
    act(() => {
      vi.advanceTimersByTime(1000)
    })
    expect(screen.getByTestId('countdown')).toHaveTextContent('1')
    act(() => {
      vi.advanceTimersByTime(1000)
    })
    expect(screen.getByTestId('countdown')).toHaveTextContent('0')
    expect(onEnd).toHaveBeenCalled()
  })
})
`,
        },
        tests: '',
      },
      {
        slug: '55-calculator',
        title: 'Calculator 计算器',
        desc: `实现简易计算器：支持加减乘除与清空。`,
        stubs: {
          'index.tsx': `export function Calculator() {
  return <div>Not implemented</div>
}
`,
          'index.test.tsx': `import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Calculator } from './index'

describe('Calculator', () => {
  it('1+2=3', async () => {
    const user = userEvent.setup()
    render(<Calculator />)
    await user.click(screen.getByRole('button', { name: '1' }))
    await user.click(screen.getByRole('button', { name: '+' }))
    await user.click(screen.getByRole('button', { name: '2' }))
    await user.click(screen.getByRole('button', { name: '=' }))
    expect(screen.getByTestId('display')).toHaveTextContent('3')
  })
})
`,
        },
        tests: '',
      },
      {
        slug: '56-cascade-select',
        title: 'CascadeSelect 级联选择',
        desc: `实现级联选择：根据父级选项动态展示子级，onChange 返回选中路径。`,
        stubs: {
          'index.tsx': `export interface CascadeOption {
  label: string
  value: string
  children?: CascadeOption[]
}

export interface CascadeSelectProps {
  options: CascadeOption[]
  onChange?: (values: string[]) => void
}

export function CascadeSelect(_props: CascadeSelectProps) {
  return <div>Not implemented</div>
}
`,
          'index.test.tsx': `import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { CascadeSelect } from './index'

const options = [
  {
    label: '浙江',
    value: 'zj',
    children: [
      { label: '杭州', value: 'hz' },
      { label: '宁波', value: 'nb' },
    ],
  },
]

describe('CascadeSelect', () => {
  it('选择路径', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<CascadeSelect options={options} onChange={onChange} />)
    await user.selectOptions(screen.getByTestId('level-0'), 'zj')
    await user.selectOptions(screen.getByTestId('level-1'), 'hz')
    expect(onChange).toHaveBeenLastCalledWith(['zj', 'hz'])
  })
})
`,
        },
        tests: '',
      },
      {
        slug: '57-lazy-image',
        title: 'LazyImage 图片懒加载',
        desc: `实现图片懒加载：进入视口后再设置真实 src（可用 IntersectionObserver）。`,
        stubs: {
          'index.tsx': `export interface LazyImageProps {
  src: string
  alt?: string
  placeholder?: string
}

export function LazyImage(_props: LazyImageProps) {
  return <img alt="not-implemented" />
}
`,
          'index.test.tsx': `import { describe, it, expect, vi, beforeEach } from 'vitest'
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
`,
        },
        tests: '',
      },
      {
        slug: '58-virtual-list',
        title: '虚拟列表',
        desc: `实现固定行高的虚拟列表：只渲染可视区域内的项。`,
        stubs: {
          'index.tsx': `export interface VirtualListProps<T> {
  items: T[]
  itemHeight: number
  height: number
  renderItem: (item: T, index: number) => React.ReactNode
}

export function VirtualList<T>(_props: VirtualListProps<T>) {
  return <div>Not implemented</div>
}
`,
          'index.test.tsx': `import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { VirtualList } from './index'

describe('VirtualList', () => {
  it('只渲染可视区域附近的项', () => {
    const items = Array.from({ length: 1000 }, (_, i) => i)
    render(
      <VirtualList
        items={items}
        itemHeight={30}
        height={150}
        renderItem={(item) => <div data-testid="row">{item}</div>}
      />,
    )
    const rows = screen.getAllByTestId('row')
    expect(rows.length).toBeLessThan(30)
    expect(rows.length).toBeGreaterThan(0)
  })
})
`,
        },
        tests: '',
      },
      {
        slug: '59-logger-debug',
        title: 'LoggerDebug 闭包陷阱修复',
        desc: `修复常见闭包陷阱：在循环中延迟打印 0..n-1，要求输出正确索引而非全是最终值。`,
        stubs: {
          'index.ts': `/** 错误示例思路：var + setTimeout 导致全是 n */
export function buggyLog(n: number): void {
  for (var i = 0; i < n; i++) {
    setTimeout(() => console.log(i), 0)
  }
}

/** 请实现正确版本 */
export function fixedLog(n: number): void {
  void n
  throw new Error('Not implemented')
}
`,
          'index.test.ts': `import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { fixedLog } from './index'

describe('fixedLog', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.spyOn(console, 'log').mockImplementation(() => {})
  })
  afterEach(() => {
    vi.useRealTimers()
    vi.restoreAllMocks()
  })

  it('打印正确索引', async () => {
    fixedLog(3)
    await vi.runAllTimersAsync()
    expect(vi.mocked(console.log).mock.calls.map((c) => c[0])).toEqual([0, 1, 2])
  })
})
`,
        },
        tests: '',
      },
      {
        slug: '60-number-toggle',
        title: 'NumberToggle 数字小数点切换',
        desc: `实现组件：点击在整数展示与保留 2 位小数展示之间切换（例如 3 ↔ 3.00）。`,
        stubs: {
          'index.tsx': `export interface NumberToggleProps {
  value: number
}

export function NumberToggle(_props: NumberToggleProps) {
  return <div>Not implemented</div>
}
`,
          'index.test.tsx': `import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { NumberToggle } from './index'

describe('NumberToggle', () => {
  it('切换格式', async () => {
    const user = userEvent.setup()
    render(<NumberToggle value={3} />)
    expect(screen.getByTestId('num')).toHaveTextContent('3')
    await user.click(screen.getByRole('button'))
    expect(screen.getByTestId('num')).toHaveTextContent('3.00')
  })
})
`,
        },
        tests: '',
      },
      {
        slug: '61-custom-axios',
        title: 'CustomAxios 简易请求封装',
        desc: `实现简易请求库：支持 \`get/post\`、拦截器、超时与基础 URL。可用 fetch 封装（不必兼容全部 axios API）。`,
        stubs: {
          'index.ts': `export interface AxiosRequestConfig {
  url: string
  method?: 'GET' | 'POST'
  data?: unknown
  headers?: Record<string, string>
  timeout?: number
  baseURL?: string
}

export interface AxiosResponse<T = unknown> {
  data: T
  status: number
}

export function createAxios(defaults?: Partial<AxiosRequestConfig>) {
  void defaults
  throw new Error('Not implemented')
}
`,
          'index.test.ts': `import { describe, it, expect, vi, afterEach } from 'vitest'
import { createAxios } from './index'

describe('createAxios', () => {
  afterEach(() => vi.unstubAllGlobals())

  it('GET 请求', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => ({
        ok: true,
        status: 200,
        json: async () => ({ ok: 1 }),
      })),
    )
    const http = createAxios({ baseURL: 'https://api.test' })
    const res = await http.get('/users')
    expect(res.data).toEqual({ ok: 1 })
    expect(fetch).toHaveBeenCalled()
  })
})
`,
        },
        tests: '',

      },
      {
        slug: '62-lazy-component',
        title: '懒加载组件 React.lazy + Suspense',
        desc: `实现一个页面：用 React.lazy 懒加载子组件，并用 Suspense 展示 fallback。`,
        stubs: {
          'Heavy.tsx': `export default function Heavy() {
  return <div data-testid="heavy">Heavy Component</div>
}
`,
          'index.tsx': `import { Suspense } from 'react'

// TODO: 使用 React.lazy 加载 ./Heavy
export function LazyPage() {
  void Suspense
  return <div>Not implemented</div>
}
`,
          'index.test.tsx': `import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { LazyPage } from './index'

describe('LazyPage', () => {
  it('Suspense 懒加载', async () => {
    render(<LazyPage />)
    expect(await screen.findByTestId('heavy')).toBeInTheDocument()
  })
})
`,
        },
        tests: '',
      },
    ],
  },
  '06-react-hooks': {
    id: '06-react-hooks',
    name: 'React Hooks',
    env: 'React 19 + Vitest + Testing Library + jsdom',
    problems: [
      {
        slug: '63-use-debounce',
        title: 'useDebounce 防抖 Hook',
        desc: `实现 useDebounce(value, delay)，返回防抖后的值。`,
        stubs: {
          'index.ts': `import { useState, useEffect } from 'react'

export function useDebounce<T>(value: T, delay: number): T {
  void value
  void delay
  void useState
  void useEffect
  throw new Error('Not implemented')
}
`,
          'index.test.tsx': `import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useDebounce } from './index'

describe('useDebounce', () => {
  beforeEach(() => vi.useFakeTimers())
  afterEach(() => vi.useRealTimers())

  it('延迟更新', () => {
    const { result, rerender } = renderHook(({ v }) => useDebounce(v, 100), {
      initialProps: { v: 'a' },
    })
    expect(result.current).toBe('a')
    rerender({ v: 'b' })
    expect(result.current).toBe('a')
    act(() => {
      vi.advanceTimersByTime(100)
    })
    expect(result.current).toBe('b')
  })
})
`,
        },
        tests: '',
      },
      {
        slug: '64-use-throttle',
        title: 'useThrottle 节流 Hook',
        desc: `实现 useThrottle(value, interval)，在 interval 内最多更新一次。`,
        stubs: {
          'index.ts': `export function useThrottle<T>(value: T, interval: number): T {
  void value
  void interval
  throw new Error('Not implemented')
}
`,
          'index.test.tsx': `import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useThrottle } from './index'

describe('useThrottle', () => {
  beforeEach(() => vi.useFakeTimers())
  afterEach(() => vi.useRealTimers())

  it('节流更新', () => {
    const { result, rerender } = renderHook(({ v }) => useThrottle(v, 100), {
      initialProps: { v: 1 },
    })
    expect(result.current).toBe(1)
    rerender({ v: 2 })
    expect(result.current).toBe(1)
    act(() => {
      vi.advanceTimersByTime(100)
    })
    rerender({ v: 3 })
    expect(result.current).toBe(3)
  })
})
`,
        },
        tests: '',
      },
      {
        slug: '65-use-update-effect',
        title: 'useUpdateEffect 跳过首次执行',
        desc: `实现 useUpdateEffect：与 useEffect 类似，但跳过首次挂载时的执行。`,
        stubs: {
          'index.ts': `import { DependencyList, EffectCallback } from 'react'

export function useUpdateEffect(effect: EffectCallback, deps?: DependencyList): void {
  void effect
  void deps
  throw new Error('Not implemented')
}
`,
          'index.test.tsx': `import { describe, it, expect, vi } from 'vitest'
import { renderHook } from '@testing-library/react'
import { useUpdateEffect } from './index'

describe('useUpdateEffect', () => {
  it('跳过首次', () => {
    const effect = vi.fn()
    const { rerender } = renderHook(({ x }) => useUpdateEffect(effect, [x]), {
      initialProps: { x: 1 },
    })
    expect(effect).not.toHaveBeenCalled()
    rerender({ x: 2 })
    expect(effect).toHaveBeenCalledTimes(1)
  })
})
`,
        },
        tests: '',
      },
      {
        slug: '66-use-previous',
        title: 'usePrevious 获取上一次的值',
        desc: `实现 usePrevious(value)，返回上一次渲染的值。`,
        stubs: {
          'index.ts': `export function usePrevious<T>(value: T): T | undefined {
  void value
  throw new Error('Not implemented')
}
`,
          'index.test.tsx': `import { describe, it, expect } from 'vitest'
import { renderHook } from '@testing-library/react'
import { usePrevious } from './index'

describe('usePrevious', () => {
  it('返回上一次值', () => {
    const { result, rerender } = renderHook(({ v }) => usePrevious(v), {
      initialProps: { v: 1 },
    })
    expect(result.current).toBeUndefined()
    rerender({ v: 2 })
    expect(result.current).toBe(1)
    rerender({ v: 3 })
    expect(result.current).toBe(2)
  })
})
`,
        },
        tests: '',
      },
      {
        slug: '67-use-request',
        title: 'useRequest 请求 Hook',
        desc: `实现 useRequest(service)：返回 data/loading/error 与 run 方法，支持自动或手动请求。`,
        stubs: {
          'index.ts': `export interface UseRequestResult<T> {
  data: T | undefined
  loading: boolean
  error: Error | undefined
  run: (...args: any[]) => Promise<T>
}

export function useRequest<T>(
  service: (...args: any[]) => Promise<T>,
  options?: { manual?: boolean },
): UseRequestResult<T> {
  void service
  void options
  throw new Error('Not implemented')
}
`,
          'index.test.tsx': `import { describe, it, expect, vi } from 'vitest'
import { renderHook, waitFor, act } from '@testing-library/react'
import { useRequest } from './index'

describe('useRequest', () => {
  it('自动请求', async () => {
    const service = vi.fn(async () => 42)
    const { result } = renderHook(() => useRequest(service))
    expect(result.current.loading).toBe(true)
    await waitFor(() => expect(result.current.loading).toBe(false))
    expect(result.current.data).toBe(42)
  })

  it('手动 run', async () => {
    const service = vi.fn(async (x: number) => x * 2)
    const { result } = renderHook(() => useRequest(service, { manual: true }))
    expect(result.current.data).toBeUndefined()
    await act(async () => {
      await result.current.run(2)
    })
    expect(result.current.data).toBe(4)
  })
})
`,
        },
        tests: '',
      },
      {
        slug: '68-mock-use-state',
        title: '模拟 useState',
        desc: `在不依赖 React 的前提下，简易模拟 useState（可用全局指针实现，理解 hooks 链表思路）。`,
        stubs: {
          'index.ts': `export function resetHooks(): void {
  throw new Error('Not implemented')
}

export function myUseState<T>(initial: T): [T, (v: T | ((prev: T) => T)) => void] {
  void initial
  throw new Error('Not implemented')
}

export function renderWithHooks(fn: () => void): void {
  void fn
  throw new Error('Not implemented')
}
`,
          'index.test.ts': `import { describe, it, expect } from 'vitest'
import { myUseState, renderWithHooks, resetHooks } from './index'

describe('myUseState', () => {
  it('更新后重渲染可读到新值', () => {
    resetHooks()
    let latest = 0
    let setState: (v: number | ((p: number) => number)) => void = () => {}

    const App = () => {
      const [count, setCount] = myUseState(0)
      latest = count
      setState = setCount
    }

    renderWithHooks(App)
    expect(latest).toBe(0)
    setState(1)
    renderWithHooks(App)
    expect(latest).toBe(1)
    setState((p) => p + 1)
    renderWithHooks(App)
    expect(latest).toBe(2)
  })
})
`,
        },
        tests: '',
      },
      {
        slug: '69-use-redux',
        title: 'useRedux 简易状态管理',
        desc: `实现迷你 Redux：createStore + useSelector + useDispatch + Provider。`,
        stubs: {
          'index.tsx': `import { ReactNode } from 'react'

export type Reducer<S, A> = (state: S, action: A) => S

export function createStore<S, A>(reducer: Reducer<S, A>, initialState: S) {
  void reducer
  void initialState
  throw new Error('Not implemented')
}

export function Provider(_props: { store: any; children: ReactNode }) {
  return <>{_props.children}</>
}

export function useSelector<S, T>(selector: (state: S) => T): T {
  void selector
  throw new Error('Not implemented')
}

export function useDispatch<A = any>(): (action: A) => void {
  throw new Error('Not implemented')
}
`,
          'index.test.tsx': `import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { createStore, Provider, useDispatch, useSelector } from './index'

type State = { count: number }
type Action = { type: 'inc' }

function Counter() {
  const count = useSelector((s: State) => s.count)
  const dispatch = useDispatch<Action>()
  return (
    <button onClick={() => dispatch({ type: 'inc' })} data-testid="btn">
      {count}
    </button>
  )
}

describe('mini redux', () => {
  it('读写状态', async () => {
    const user = userEvent.setup()
    const store = createStore<State, Action>((s, a) => (a.type === 'inc' ? { count: s.count + 1 } : s), {
      count: 0,
    })
    render(
      <Provider store={store}>
        <Counter />
      </Provider>,
    )
    expect(screen.getByTestId('btn')).toHaveTextContent('0')
    await user.click(screen.getByTestId('btn'))
    expect(screen.getByTestId('btn')).toHaveTextContent('1')
  })
})
`,
        },
        tests: '',
      },
    ],
  },
  '07-css': {
    id: '07-css',
    name: 'CSS 实现',
    env: 'Vite 静态预览（npm run dev:css）',
    problems: [
      {
        slug: '70-vertical-center',
        title: '垂直居中 N 种方法',
        desc: `在 demo.html 中实现至少 4 种垂直水平居中方案（flex / grid / absolute+transform / table-cell 等）。`,
        stubs: {
          'index.html': `<!doctype html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8" />
  <title>垂直居中</title>
  <link rel="stylesheet" href="./style.css" />
</head>
<body>
  <h1>垂直居中 N 种方法</h1>
  <section class="demo flex"><div class="box">flex</div></section>
  <section class="demo grid"><div class="box">grid</div></section>
  <section class="demo absolute"><div class="box">absolute</div></section>
  <section class="demo table"><div class="box">table-cell</div></section>
</body>
</html>
`,
          'style.css': `/* TODO: 实现多种居中 */
.demo {
  height: 160px;
  border: 1px dashed #888;
  margin-bottom: 16px;
}
.box {
  width: 80px;
  height: 40px;
  background: #3b82f6;
  color: #fff;
  text-align: center;
  line-height: 40px;
}
`,
          'checklist.md': `# 验收清单
- [ ] flex 居中
- [ ] grid 居中
- [ ] absolute + transform 居中
- [ ] table-cell / 其他方案居中
`,
        },
        tests: '',
      },
      {
        slug: '71-two-column',
        title: '两栏布局 N 种方法',
        desc: `实现左侧固定、右侧自适应的两栏布局，至少 3 种方式（float / flex / grid / absolute）。`,
        stubs: {
          'index.html': `<!doctype html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8" />
  <title>两栏布局</title>
  <link rel="stylesheet" href="./style.css" />
</head>
<body>
  <h1>两栏布局</h1>
  <section class="layout flex">
    <aside>侧栏</aside>
    <main>主内容</main>
  </section>
  <section class="layout grid">
    <aside>侧栏</aside>
    <main>主内容</main>
  </section>
  <section class="layout float">
    <aside>侧栏</aside>
    <main>主内容</main>
  </section>
</body>
</html>
`,
          'style.css': `/* TODO */
.layout { margin-bottom: 24px; border: 1px solid #ccc; }
aside { background: #93c5fd; }
main { background: #fde68a; min-height: 80px; }
`,
          'checklist.md': `# 验收清单
- [ ] flex 两栏
- [ ] grid 两栏
- [ ] float 或其他两栏
`,
        },
        tests: '',
      },
      {
        slug: '72-three-column',
        title: '三栏布局 N 种方法',
        desc: `实现左右固定、中间自适应的三栏布局（圣杯 / 双飞翼 / flex / grid）。`,
        stubs: {
          'index.html': `<!doctype html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8" />
  <title>三栏布局</title>
  <link rel="stylesheet" href="./style.css" />
</head>
<body>
  <h1>三栏布局</h1>
  <section class="layout flex">
    <aside class="left">左</aside>
    <main>中</main>
    <aside class="right">右</aside>
  </section>
  <section class="layout grid">
    <aside class="left">左</aside>
    <main>中</main>
    <aside class="right">右</aside>
  </section>
</body>
</html>
`,
          'style.css': `/* TODO */
.layout { margin-bottom: 24px; min-height: 80px; }
.left { background: #93c5fd; }
.right { background: #86efac; }
main { background: #fde68a; }
`,
          'checklist.md': `# 验收清单
- [ ] flex 三栏
- [ ] grid 三栏
- [ ] 圣杯或双飞翼（可选）
`,
        },
        tests: '',
      },
      {
        slug: '73-flex-fixed-fluid',
        title: 'Flex 固定 + 自适应',
        desc: `使用 flex：一侧固定宽度，另一侧自适应占满剩余空间。`,
        stubs: {
          'index.html': `<!doctype html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8" />
  <title>Flex 固定+自适应</title>
  <link rel="stylesheet" href="./style.css" />
</head>
<body>
  <div class="row">
    <div class="fixed">固定 200px</div>
    <div class="fluid">自适应</div>
  </div>
</body>
</html>
`,
          'style.css': `/* TODO */
.row { display: flex; }
.fixed { background: #93c5fd; }
.fluid { background: #fde68a; min-height: 100px; }
`,
          'checklist.md': `# 验收清单
- [ ] 固定栏宽度正确
- [ ] 自适应栏占满剩余空间
`,
        },
        tests: '',
      },
      {
        slug: '74-text-truncate',
        title: '文字截断',
        desc: `实现单行省略与多行省略（-webkit-line-clamp）。`,
        stubs: {
          'index.html': `<!doctype html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8" />
  <title>文字截断</title>
  <link rel="stylesheet" href="./style.css" />
</head>
<body>
  <p class="single">这是一段很长很长很长很长很长很长很长很长很长很长的单行文本</p>
  <p class="multi">这是一段很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长的多行文本示例内容</p>
</body>
</html>
`,
          'style.css': `/* TODO: 单行 / 多行省略 */
.single, .multi { width: 240px; }
`,
          'checklist.md': `# 验收清单
- [ ] 单行 ellipsis
- [ ] 多行 clamp
`,
        },
        tests: '',
      },
      {
        slug: '75-hide-element',
        title: '隐藏元素的方式',
        desc: `演示 display/visibility/opacity/clip/position 等隐藏方式，并在注释中说明差异（是否占位、是否可点击、是否读屏可见等）。`,
        stubs: {
          'index.html': `<!doctype html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8" />
  <title>隐藏元素</title>
  <link rel="stylesheet" href="./style.css" />
</head>
<body>
  <div class="hide-display">display</div>
  <div class="hide-visibility">visibility</div>
  <div class="hide-opacity">opacity</div>
  <div class="hide-clip">clip</div>
</body>
</html>
`,
          'style.css': `/* TODO: 实现不同隐藏，并在下方注释差异 */
`,
          'checklist.md': `# 验收清单
- [ ] 至少 4 种隐藏方式
- [ ] 注释说明占位 / 事件 / 可访问性差异
`,
        },
        tests: '',
      },
      {
        slug: '76-css-triangle',
        title: 'CSS 画三角形',
        desc: `用 border 技巧画出上/下/左/右三角形。`,
        stubs: {
          'index.html': `<!doctype html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8" />
  <title>CSS 三角形</title>
  <link rel="stylesheet" href="./style.css" />
</head>
<body>
  <div class="tri up"></div>
  <div class="tri down"></div>
  <div class="tri left"></div>
  <div class="tri right"></div>
</body>
</html>
`,
          'style.css': `/* TODO */
.tri { margin: 24px; }
`,
          'checklist.md': `# 验收清单
- [ ] 上/下/左/右三角形
`,
        },
        tests: '',
      },
      {
        slug: '77-inline-block-gap',
        title: 'inline-block 空格问题',
        desc: `复现 inline-block 元素间隙，并给出至少 2 种消除方案。`,
        stubs: {
          'index.html': `<!doctype html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8" />
  <title>inline-block 空格</title>
  <link rel="stylesheet" href="./style.css" />
</head>
<body>
  <h2>有间隙</h2>
  <div class="gap">
    <span>A</span>
    <span>B</span>
    <span>C</span>
  </div>
  <h2>修复后</h2>
  <div class="fixed">
    <span>A</span>
    <span>B</span>
    <span>C</span>
  </div>
</body>
</html>
`,
          'style.css': `span {
  display: inline-block;
  width: 60px;
  height: 40px;
  background: #93c5fd;
}
/* TODO: 修复 .fixed 中间隙 */
`,
          'checklist.md': `# 验收清单
- [ ] 复现间隙
- [ ] 至少两种修复方式（可写在注释中）
`,
        },
        tests: '',
      },
      {
        slug: '78-tailwind-components',
        title: 'Tailwind 实现常见组件',
        desc: `使用 Tailwind CDN，实现按钮、卡片、徽标等常见组件（本项目用 CDN，无需构建）。`,
        stubs: {
          'index.html': `<!doctype html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8" />
  <title>Tailwind 组件</title>
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="p-8 space-y-6">
  <h1 class="text-2xl font-bold">Tailwind 常见组件</h1>
  <!-- TODO: 按钮 / 卡片 / Badge -->
  <button>Button</button>
  <div>Card</div>
  <span>Badge</span>
</body>
</html>
`,
          'checklist.md': `# 验收清单
- [ ] Primary / Secondary 按钮
- [ ] 卡片（标题+描述）
- [ ] Badge
`,
        },
        tests: '',
      },
    ],
  },
}

function writeProblem(categoryId, categoryName, env, problem) {
  const dir = path.join(problemsRoot, categoryId, problem.slug)
  fs.mkdirSync(dir, { recursive: true })

  const readme = `# ${problem.title}

> 分类：${categoryName}  
> 环境：${env}

## 题目

${problem.desc}

## 文件说明

- 实现文件：\`index.ts\` / \`index.tsx\` / \`index.html\`（按题目）
- 测试或验收：\`*.test.ts(x)\` 或 \`checklist.md\`

## 开始

\`\`\`bash
# 跑这一题测试（CSS 题请用 checklist + npm run dev:css）
npm run test -- problems/${categoryId}/${problem.slug}
\`\`\`
`
  fs.writeFileSync(path.join(dir, 'README.md'), readme)

  for (const [filename, content] of Object.entries(problem.stubs)) {
    fs.writeFileSync(path.join(dir, filename), content)
  }
}

function main() {
  fs.mkdirSync(problemsRoot, { recursive: true })

  const indexLines = [
    '# 前端 HOT80 手写题',
    '',
    '题目来源：[牛客 - 前端 hot80 手写题](https://www.nowcoder.com/discuss/844536328413773824)',
    '',
    '## 环境说明',
    '',
    '| 分类 | 环境 |',
    '| --- | --- |',
  ]

  let total = 0
  for (const cat of Object.values(categories)) {
    indexLines.push(`| ${cat.name} | ${cat.env} |`)
  }
  indexLines.push('', '## 题目目录', '')

  for (const cat of Object.values(categories)) {
    indexLines.push(`### ${cat.name}`, '')
    for (const p of cat.problems) {
      writeProblem(cat.id, cat.name, cat.env, p)
      indexLines.push(`- [${p.title}](./${cat.id}/${p.slug}/)`)
      total++
    }
    indexLines.push('')
  }

  fs.writeFileSync(path.join(problemsRoot, 'README.md'), indexLines.join('\n') + '\n')

  // CSS portal
  const cssPortal = `<!doctype html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8" />
  <title>HOT80 CSS 题预览</title>
  <style>
    body { font-family: ui-sans-serif, system-ui, sans-serif; max-width: 720px; margin: 40px auto; padding: 0 16px; }
    a { display: block; padding: 8px 0; }
  </style>
</head>
<body>
  <h1>CSS 实现题预览</h1>
  <p>运行 <code>npm run dev:css</code> 后从这里进入各题。</p>
  ${categories['07-css'].problems.map((p) => `<a href="./${p.slug}/index.html">${p.title}</a>`).join('\n  ')}
</body>
</html>
`
  fs.writeFileSync(path.join(problemsRoot, '07-css', 'index.html'), cssPortal)

  console.log(`Generated ${total} problems.`)
}

main()
