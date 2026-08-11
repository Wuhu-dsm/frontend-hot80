# retry 重试 + 超时控制

> 分类：异步与设计模式  
> 环境：node + vitest

## 题目

实现 `retry(fn, options)`：
- `retries`: 失败后最多再试次数
- `timeout`: 单次执行超时（ms）
- `delay`: 重试间隔（可选）

## 文件说明

- 实现文件：`index.ts` / `index.tsx` / `index.html`（按题目）
- 测试或验收：`*.test.ts(x)` 或 `checklist.md`

## 开始

```bash
# 跑这一题测试（CSS 题请用 checklist + npm run dev:css）
npm run test -- problems/01-async/07-retry-timeout
```
