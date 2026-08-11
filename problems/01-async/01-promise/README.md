# Promise 完整实现

> 分类：异步与设计模式  
> 环境：node + vitest

## 题目

实现一个符合 Promise/A+ 基本行为的 MyPromise 类。

## 要求
- 支持 `new MyPromise((resolve, reject) => {})`
- 支持 `then` / `catch` / `finally` 链式调用
- 支持状态：pending / fulfilled / rejected，且只能变更一次
- 支持异步 resolve/reject
- 支持 then 回调返回新 Promise 的穿透与错误冒泡

## 文件说明

- 实现文件：`index.ts` / `index.tsx` / `index.html`（按题目）
- 测试或验收：`*.test.ts(x)` 或 `checklist.md`

## 开始

```bash
# 跑这一题测试（CSS 题请用 checklist + npm run dev:css）
npm run test -- problems/01-async/01-promise
```
