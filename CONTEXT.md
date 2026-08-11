# 发包与下游更新

手动触发的发布编排：在源仓全量发布可发布包，再按需把新版本精确写回下游消费仓。

## Language

**源仓 (Source Monorepo)**：
承载 pnpm workspaces 的 Git 仓库；发包闸门对其全部可发布包执行涨版与 publish。
_Avoid_: 主仓、monorepo 根、包仓库（易与 npm registry 混淆）

**下游仓 (Downstream Repo)**：
独立于源仓的 Git 仓库，通过 semver 依赖消费已发布的包；下游更新闸门在其既有依赖中写入新版本并推送。
_Avoid_: 业务仓（过宽）、消费端（易指运行时）、更新仓库（口语，非术语）

**可发布包 (Publishable Package)**：
源仓 workspace 中会被发包闸门纳入全量发布的包（相对「仅内部、永不 publish」的包）。
_Avoid_: 子包、模块（过泛）、选中包

**发布运行 (Release Run)**：
一次手动触发的流水线实例，含发包闸门与可选的下游更新闸门。
_Avoid_: 流水线、发版（易与 git release/tag 混淆）

**发包闸门 (Publish Gate)**：
发布运行中的第一道手动确认：对源仓内全部可发布包按统一涨版策略执行 publish，并将新版本写回**本次触发所在分支**（commit + push，并打对应 tag）；不提供包级多选。成功后才允许进入下游更新闸门。
_Avoid_: 节点 1（口语序号）、选包发布（已否决）、固定仅 main 回写（已否决）

**下游更新闸门 (Downstream Update Gate)**：
发布运行中的第二道手动确认：在已发布版本上下文下，勾选下游仓，将依赖版本写入后直接 commit 并 push 到下游清单中的目标分支；可跳过。不开 PR。对勾选仓尽力全部执行并汇总结果；任一失败则闸门失败，但不回滚已成功 push 的仓。
_Avoid_: 节点 2、更新仓库、下游 PR、下游全有或全无

**统一涨版策略 (Shared Bump Policy)**：
同一次发布运行中，源仓内全部可发布包按同一规则确定新版本（如统一 patch/minor/major）；涨版结果必须回写源仓 Git。
_Avoid_: 各自涨版、独立 semver（指本次运行内按包分别策略）、选包涨版

**下游清单 (Downstream Catalog)**：
源仓内维护的配置，声明有哪些下游仓可被勾选、各仓默认推送分支，以及与可发布包的对应关系；闸门勾选项由此生成，推送分支以清单为准。
_Avoid_: 仓库列表、自动发现名单

**发包全有或全无 (Publish All-or-Nothing)**：
发包闸门内全部可发布包都 publish 成功后，才回写源仓 Git 与 tag；任一包失败则整闸门失败。已推到 registry 的包不自动回滚，需人工处理。
_Avoid_: 部分成功也过闸、自动 unpublish

**下游尽力同步 (Downstream Best-Effort Sync)**：
下游更新闸门对所有勾选仓都尝试更新；以汇总成功/失败为准，不因中途失败而跳过其余仓，也不回滚已成功仓。
_Avoid_: 下游事务、下游全有或全无

**既有依赖改写 (Existing Dep Rewrite)**：
仅当下游仓已在 dependencies / devDependencies / peerDependencies 中声明某可发布包时，才改写其版本，并更新 lockfile 后提交；不新增依赖。
_Avoid_: 强制插入依赖、只改 package.json 不改 lockfile

**精确钉死 (Exact Pin)**：
既有依赖改写时写入不带 `^`/`~` 的精确版本号，与本次发布运行产出的版本一致。
_Avoid_: 保留原操作符、统一升为 caret

**下游无操作成功 (Downstream No-Op Success)**：
勾选的下游仓若不含本次任一可发布包的既有依赖声明，则不 commit、不 push，汇总标记为无需更新，且不因此使闸门失败。
_Avoid_: 无匹配即失败

**发布 Registry (Publish Registry)**：
可发布包的目标 registry 为 GitHub Packages（`npm.pkg.github.com`）。
_Avoid_: npm 公源、仅 dry-run（作为正式目标）

**包 Scope (Package Scope)**：
可发布包的 npm scope，固定为 `@wuhu-dsm/`。
_Avoid_: `@Wuhu-dsm/`、无 scope、其它 org scope

**POC 源仓**：
以 `frontend-hot80` 作为源仓：引入 pnpm workspaces 与测试用可发布包；原面试题内容可留在仓内且不发布。
_Avoid_: 另起独立源仓、单仓内假装下游目录

**POC 下游仓**：
新建独立仓库 `Wuhu-dsm/frontend-hot80-downstream-demo`，作为下游清单中的演示下游仓，目标分支默认 `main`。
_Avoid_: 复用业务仓当下游、清单留空只测发包

**POC 可发布包**：
源仓内至少两个测试可发布包：`@wuhu-dsm/hot80-foo`、`@wuhu-dsm/hot80-bar`（若命名要改，在实施前说一声）。
_Avoid_: 单包 POC（无法验证全量齐发）
