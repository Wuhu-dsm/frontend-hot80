# Promise.all

> 分类：异步与设计模式  
> 环境：node + vitest

## 题目

实现 `promiseAll`，行为对齐 `Promise.all`。

## 要求
- 全部成功时按输入顺序返回结果数组
- 任一失败立即 reject
- 空数组立即 resolve 为 `[]`

## 文件说明

- 实现文件：`index.ts` / `index.tsx` / `index.html`（按题目）
- 测试或验收：`*.test.ts(x)` 或 `checklist.md`

## 开始

```bash
# 跑这一题测试（CSS 题请用 checklist + npm run dev:css）
npm run test -- problems/01-async/02-promise-all
```
