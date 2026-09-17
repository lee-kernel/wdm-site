# WDM 用户文档维护指南

本仓库同时发布 WDM 宣传站和 Starlight 用户文档：宣传站位于 `/`，文档站位于 `/docs/`。本文主要说明如何根据 WDM 主项目更新用户文档。

## 文档定位

这里维护的是面向 WDM 使用者的产品手册，重点回答三个问题：

1. 这个功能可以实现什么。
2. 用户应该如何操作。
3. 使用时有哪些限制、风险和注意事项。

文档不直接复制工程设计、数据库结构、代码路径或 Coding Agent 指令。内部实现只用于核对事实，最终内容需要重新组织成用户能够理解和执行的说明。

## 事实来源

WDM 主项目位于 `E:\DevCode\wdm`，工程文档位于 `E:\DevCode\wdm\docs`。在常规相邻目录结构中，对应路径为 `../wdm/docs`。

更新用户文档前，按功能读取相关事实来源：

| 用户文档 | 主要事实来源 |
| --- | --- |
| 工作报告 | `wdm/docs/domains/work-report.md` |
| 提示词库、脚本库 | `wdm/docs/domains/ai-assets.md` |
| 标签 | `wdm/docs/domains/tags.md` |
| 自动任务 | `wdm/docs/domains/automation.md` |
| 通知渠道 | `wdm/docs/domains/channels.md` |
| 账号、登录与权限 | `wdm/docs/domains/identity-access.md`、`wdm/docs/standards/security.md` |
| AI 与脚本安全 | `wdm/docs/architecture/ai-layer.md`、`wdm/docs/standards/security.md` |
| 系统整体能力 | `wdm/docs/architecture/overview.md` 与上述领域文档 |

如果工程文档与实际产品界面不一致，应先在 WDM 主项目中确认真实行为并修正权威文档，再更新这里的用户说明。不要根据宣传文案反向推断业务规则。

## 文档目录

用户文档位于 `docs/src/content/docs/`：

```text
docs/src/content/docs/
├── index.mdx                 # 文档首页
├── getting-started.md        # 快速开始
├── overview.md               # 功能总览
├── guides/                   # 各功能操作指南
│   ├── reports.md
│   ├── prompts.md
│   ├── scripts.md
│   ├── tags.md
│   ├── automation.md
│   ├── notifications.md
│   └── account-security.md
└── reference/                # 跨功能须知与常见问题
    ├── ai-and-script-safety.md
    └── faq.md
```

其他相关文件：

- `docs/astro.config.mjs`：站点标题、侧边栏、语言、部署基础路径。
- `docs/src/styles/custom.css`：文档站视觉样式。
- `docs/src/content.config.ts`：Starlight 内容集合。
- `docs/public/`：文档站静态资源。
- `index.html`：宣传站及其 `Docs` 入口。

## 更新现有文档

1. 在 `E:\DevCode\wdm\docs` 中读取相关领域、架构和安全文档。
2. 列出本次功能变化对用户可见的影响，包括入口、操作、限制和失败条件。
3. 找到 `docs/src/content/docs/` 中对应页面，更新“能做什么”“如何操作”“注意事项”。
4. 同步检查 `overview.md`、`getting-started.md` 和 `reference/faq.md` 是否需要调整。
5. 如果宣传站也描述了该能力，再核对 `index.html` 的中英文文案。
6. 启动本地开发服务器检查内容和导航。
7. 完成正式构建，确认链接、搜索索引和部署路径正常。

改写时优先使用动作明确的用户语言。例如，将“任务保存 `notification_channel_id`”改写为“任务可以绑定一个通知渠道；渠道修改后会在下一次运行时生效”。

## 新增文档页面

在合适目录中创建 `.md` 或 `.mdx` 文件，并添加 frontmatter：

```md
---
title: 功能名称
description: 用一句话说明用户能在本页学到什么。
---

简要说明功能适合解决的问题。

## 如何使用

1. 第一步操作。
2. 第二步操作。

## 注意事项

- 真实限制或风险。
```

然后在 `docs/astro.config.mjs` 的 `sidebar` 中加入页面 slug。页面之间使用相对链接：

```md
[自动任务](../guides/automation/)
```

不要硬编码 `/docs/...` 或 `/wdm-site/docs/...`。相对链接可以同时适配本地 `/docs` 和 GitHub Pages 的 `/wdm-site/docs`。

## 写作要求

- 只描述主项目文档或已验证实现中存在的能力。
- 先说明用户目标，再给操作步骤，最后写限制和风险。
- 不把 AI 输出描述为已经审核的事实。
- 不把私有资产描述为默认团队共享。
- 明确区分私有脚本、公共脚本和管理员发布权限。
- 自动任务相关页面应说明触发方式、最新配置读取规则和执行日志。
- 安全内容应给出可执行建议，不公开密钥、内部地址或敏感配置值。
- 不添加虚构数据、客户评价、性能指标或尚未实现的功能。
- 使用简体中文和一致术语：日报、周报、提示词、脚本、自动任务、通知渠道、Webhook、Passkey。

## 本地编辑与预览

需要 Node.js 22.19 或更高版本。首次运行先安装依赖：

```bash
npm ci
```

启动 Starlight 开发服务器：

```bash
npm run dev
```

终端会显示访问地址，文档默认使用 `/docs/` 基础路径。开发服务器支持内容热更新。

## 构建与验证

每次文档更新至少运行：

```bash
npm run build
```

该命令会生成统一发布目录：

```text
dist/
├── index.html       # 宣传站
├── assets/          # 宣传站资源
└── docs/            # Starlight 文档站
```

预览完整发布产物：

```bash
python -m http.server 4175 --bind 127.0.0.1 --directory dist
```

然后检查：

- `http://127.0.0.1:4175/` 的文档按钮能否进入 `/docs/`。
- 侧边栏、上一页/下一页和正文链接是否正确。
- 搜索能否找到新增或修改的关键词。
- 深色、浅色和移动端布局是否可读。
- 表格、代码块、提示框和长标题是否溢出。
- 页面是否包含内部工程信息或不应公开的敏感内容。

如果同时修改宣传站脚本，再运行：

```bash
node --check assets/js/site.js
```

## 发布

`.github/workflows/deploy.yml` 会在 `main` 分支更新后执行 `npm ci` 和 `npm run build`，并把整个 `dist/` 发布到 GitHub Pages。

当前工作流按 GitHub 项目页部署：

```text
SITE_URL=https://lee-kernel.github.io
DOCS_BASE=/wdm-site/docs
```

如果以后改为根域名部署，将 `DOCS_BASE` 改为 `/docs`，并把 `SITE_URL` 改为实际域名。GitHub Pages 的 Source 需要设置为 **GitHub Actions**。

## 提交前检查清单

- [ ] 内容事实已从 `E:\DevCode\wdm\docs` 核对。
- [ ] 工程语言已改写为用户语言，没有直接照搬内部文档。
- [ ] 功能说明包含操作方法和必要注意事项。
- [ ] 新页面已加入 Starlight 侧边栏。
- [ ] 所有站内链接使用相对路径并能正常打开。
- [ ] `npm run build` 成功完成。
- [ ] 页面未包含账号、密钥、内部地址或其他敏感信息。
