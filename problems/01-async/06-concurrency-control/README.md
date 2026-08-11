# 并发控制

> 分类：异步与设计模式  
> 环境：node + vitest

## 题目

实现 `asyncPool(limit, tasks)`：限制同时运行的异步任务数量。

## 要求
- `limit` 为最大并发数
- `tasks` 为返回 Promise 的函数数组
- 结果按任务原始顺序返回

## 文件说明

- 实现文件：`index.ts` / `index.tsx` / `index.html`（按题目）
- 测试或验收：`*.test.ts(x)` 或 `checklist.md`

## 开始

```bash
# 跑这一题测试（CSS 题请用 checklist + npm run dev:css）
npm run test -- problems/01-async/06-concurrency-control
```
