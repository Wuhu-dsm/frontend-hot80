# frontend-hot80

基于牛客 [前端 hot80 手写题](https://www.nowcoder.com/discuss/844536328413773824) 整理的练习项目。

每道题独立文件夹，包含：

- `README.md`：题目说明
- 待实现骨架：`index.ts` / `index.tsx` / `index.html`
- 测试用例：`*.test.ts(x)`，CSS 题为 `checklist.md`

## 按题型定制的环境

| 分类 | 目录 | 环境 |
| --- | --- | --- |
| 异步与设计模式 | `problems/01-async` | Node + Vitest |
| 数据结构 | `problems/02-data-structure` | Node + Vitest（DOM 题走 jsdom） |
| 数组与对象 | `problems/03-array-object` | Node + Vitest |
| 工具函数 | `problems/04-utils` | Node + Vitest（Cookie/HTML 题走 jsdom） |
| React 组件 | `problems/05-react-components` | React 19 + Testing Library + jsdom |
| React Hooks | `problems/06-react-hooks` | React 19 + Testing Library + jsdom |
| CSS 实现 | `problems/07-css` | Vite 静态预览 |

## 使用方式

```bash
npm install

# 跑全部自动化测试（未实现会失败，属预期）
npm test

# 只跑 JS 题 / React 题
npm run test:js
npm run test:react

# 跑单题
npm run test -- problems/01-async/08-sleep

# 预览 CSS 题
npm run dev:css
```

## 练习建议

1. 先读题目 `README.md`
2. 在骨架文件中实现
3. 跑对应用例，直到通过
4. CSS 题对照 `checklist.md`，用浏览器预览验收

完整目录见 [problems/README.md](./problems/README.md)。

## CI：Cursor Agent 代码评审

对 `main` 的 Pull Request（非 draft、非 fork）会触发 [`.github/workflows/cursor-code-review.yml`](./.github/workflows/cursor-code-review.yml)：

1. 安装 Cursor Agent CLI
2. 基于 PR diff 做项目级代码评审
3. 将**总评 + inline 行评**以 GitHub Review（`COMMENT`，非阻塞）发到 PR

### 需要配置的 Secret

在仓库 **Settings → Secrets and variables → Actions** 新增：

| Name | 说明 |
| --- | --- |
| `CURSOR_API_KEY` | 在 [Cursor Dashboard](https://cursor.com/docs/cli/reference/authentication.md#api-key-authentication) 生成的 API Key |

未配置该 Secret 时，评审 job 会失败。Agent 权限由 [`.cursor/cli.json`](./.cursor/cli.json) 限制为只读分析并仅写入 `review.json`；评论由 [`scripts/post-pr-review.mjs`](./scripts/post-pr-review.mjs) 确定性提交。
