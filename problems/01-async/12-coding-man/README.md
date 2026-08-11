# CodingMan

> 分类：异步与设计模式  
> 环境：node + vitest

## 题目

实现可链式调用的 CodingMan：

```ts
CodingMan('Pete')
// 输出: Hi! This is Pete!

CodingMan('Pete').sleep(3).eat('dinner')
// Hi! This is Pete!
// 等待 3 秒
// Wake up after 3
// Eat dinner~

CodingMan('Pete').eat('dinner').eat('supper')
CodingMan('Pete').sleepFirst(2).eat('dinner')
```

要求支持 `eat` / `sleep` / `sleepFirst` 链式调用与任务队列。

## 文件说明

- 实现文件：`index.ts` / `index.tsx` / `index.html`（按题目）
- 测试或验收：`*.test.ts(x)` 或 `checklist.md`

## 开始

```bash
# 跑这一题测试（CSS 题请用 checklist + npm run dev:css）
npm run test -- problems/01-async/12-coding-man
```
