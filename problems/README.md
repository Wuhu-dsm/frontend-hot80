# 前端 HOT80 手写题

题目来源：[牛客 - 前端 hot80 手写题](https://www.nowcoder.com/discuss/844536328413773824)

## 环境说明

| 分类 | 环境 |
| --- | --- |
| 异步与设计模式 | node + vitest |
| 数据结构相关 | node + vitest（DOM 题使用 jsdom） |
| 数组与对象 | node + vitest |
| 工具函数 | node + vitest（Cookie/HTML 题使用 jsdom） |
| React 组件 | React 19 + Vitest + Testing Library + jsdom |
| React Hooks | React 19 + Vitest + Testing Library + jsdom |
| CSS 实现 | Vite 静态预览（npm run dev:css） |

## 题目目录

### 异步与设计模式

- [Promise 完整实现](./01-async/01-promise/)
- [Promise.all](./01-async/02-promise-all/)
- [Promise.race](./01-async/03-promise-race/)
- [Promise.allSettled](./01-async/04-promise-allsettled/)
- [Promise.any](./01-async/05-promise-any/)
- [并发控制](./01-async/06-concurrency-control/)
- [retry 重试 + 超时控制](./01-async/07-retry-timeout/)
- [sleep](./01-async/08-sleep/)
- [红绿灯循环](./01-async/09-traffic-light/)
- [Promisify](./01-async/10-promisify/)
- [发布订阅 + 观察者模式](./01-async/11-pub-sub-observer/)
- [CodingMan](./01-async/12-coding-man/)

### 数据结构相关

- [数组转树](./02-data-structure/13-array-to-tree/)
- [树转数组](./02-data-structure/14-tree-to-array/)
- [路径字符串转树](./02-data-structure/15-path-to-tree/)
- [按缩进构造树](./02-data-structure/16-indent-to-tree/)
- [二叉树遍历](./02-data-structure/17-binary-tree-traverse/)
- [DOM 树遍历](./02-data-structure/18-dom-tree-traverse/)
- [LRU 缓存](./02-data-structure/19-lru-cache/)
- [四大排序](./02-data-structure/20-sorts/)
- [课程表（图的环检测）](./02-data-structure/21-course-schedule/)
- [路径总和](./02-data-structure/22-path-sum/)

### 数组与对象

- [深拷贝](./03-array-object/23-deep-clone/)
- [深度比较 deepEqual](./03-array-object/24-deep-equal/)
- [lodash get](./03-array-object/25-lodash-get/)
- [lodash set](./03-array-object/26-lodash-set/)
- [getType 类型判断](./03-array-object/27-get-type/)
- [数组扁平化 flat](./03-array-object/28-array-flat/)
- [对象扁平化 flattenObj](./03-array-object/29-flatten-object/)
- [数组去重](./03-array-object/30-array-unique/)
- [数组方法实现（map/filter/reduce）](./03-array-object/31-array-methods/)
- [Omit / Pick（JS + TS 类型）](./03-array-object/32-omit-pick/)

### 工具函数

- [防抖 debounce](./04-utils/33-debounce/)
- [节流 throttle](./04-utils/34-throttle/)
- [柯里化 curry](./04-utils/35-curry/)
- [compose / pipe](./04-utils/36-compose-pipe/)
- [call / apply / bind](./04-utils/37-call-apply-bind/)
- [new / instanceof](./04-utils/38-new-instanceof/)
- [继承](./04-utils/39-inherit/)
- [千分位格式化](./04-utils/40-thousand-separator/)
- [URL 解析](./04-utils/41-parse-url/)
- [驼峰转换](./04-utils/42-case-convert/)
- [大数相加](./04-utils/43-big-number-add/)
- [setTimeout ⇄ setInterval](./04-utils/44-timeout-interval/)
- [时间格式化](./04-utils/45-format-time/)
- [randomInt](./04-utils/46-random-int/)
- [getCookie](./04-utils/47-get-cookie/)
- [访问次数统计](./04-utils/48-visit-count/)
- [闭包加法 add(1)(2)(3)](./04-utils/49-add-curry/)
- [去除最少字符](./04-utils/50-remove-min-chars/)
- [提取 HTML 文字](./04-utils/51-extract-html-text/)

### React 组件

- [Counter 计数器](./05-react-components/52-counter/)
- [TodoList](./05-react-components/53-todo-list/)
- [CountDown 倒计时](./05-react-components/54-countdown/)
- [Calculator 计算器](./05-react-components/55-calculator/)
- [CascadeSelect 级联选择](./05-react-components/56-cascade-select/)
- [LazyImage 图片懒加载](./05-react-components/57-lazy-image/)
- [虚拟列表](./05-react-components/58-virtual-list/)
- [LoggerDebug 闭包陷阱修复](./05-react-components/59-logger-debug/)
- [NumberToggle 数字小数点切换](./05-react-components/60-number-toggle/)
- [CustomAxios 简易请求封装](./05-react-components/61-custom-axios/)
- [懒加载组件 React.lazy + Suspense](./05-react-components/62-lazy-component/)

### React Hooks

- [useDebounce 防抖 Hook](./06-react-hooks/63-use-debounce/)
- [useThrottle 节流 Hook](./06-react-hooks/64-use-throttle/)
- [useUpdateEffect 跳过首次执行](./06-react-hooks/65-use-update-effect/)
- [usePrevious 获取上一次的值](./06-react-hooks/66-use-previous/)
- [useRequest 请求 Hook](./06-react-hooks/67-use-request/)
- [模拟 useState](./06-react-hooks/68-mock-use-state/)
- [useRedux 简易状态管理](./06-react-hooks/69-use-redux/)

### CSS 实现

- [垂直居中 N 种方法](./07-css/70-vertical-center/)
- [两栏布局 N 种方法](./07-css/71-two-column/)
- [三栏布局 N 种方法](./07-css/72-three-column/)
- [Flex 固定 + 自适应](./07-css/73-flex-fixed-fluid/)
- [文字截断](./07-css/74-text-truncate/)
- [隐藏元素的方式](./07-css/75-hide-element/)
- [CSS 画三角形](./07-css/76-css-triangle/)
- [inline-block 空格问题](./07-css/77-inline-block-gap/)
- [Tailwind 实现常见组件](./07-css/78-tailwind-components/)

