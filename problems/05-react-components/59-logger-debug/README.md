# LoggerDebug 闭包陷阱修复

> 分类：React 组件  
> 环境：React 19 + Vitest + Testing Library + jsdom

## 题目

修复常见闭包陷阱：在循环中延迟打印 0..n-1，要求输出正确索引而非全是最终值。

## 文件说明

- 实现文件：`index.ts` / `index.tsx` / `index.html`（按题目）
- 测试或验收：`*.test.ts(x)` 或 `checklist.md`

## 开始

```bash
# 跑这一题测试（CSS 题请用 checklist + npm run dev:css）
npm run test -- problems/05-react-components/59-logger-debug
```
