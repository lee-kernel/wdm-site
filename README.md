# WDM 宣传站与使用文档

WDM 智能工作助手的宣传站与用户文档。宣传站使用原生 HTML、CSS 和 JavaScript，文档站使用 Astro Starlight；两者通过一次构建统一输出到 `dist/`，可作为同一个 GitHub Pages 站点部署。

## 本地预览

需要 Node.js 22.19 或更高版本。安装依赖并构建：

```bash
npm ci
npm run build
```

构建结果：

```text
dist/
├── index.html       # 宣传站 /
├── assets/          # 宣传站资源
└── docs/            # Starlight 文档站 /docs/
```

预览完整发布产物：

```bash
python -m http.server 4175 --bind 127.0.0.1 --directory dist
```

浏览器打开 `http://127.0.0.1:4175`，文档位于 `http://127.0.0.1:4175/docs/`。只编辑文档时可运行 `npm run dev` 使用 Starlight 开发服务器。

## 文件职责

```text
.
├── index.html
├── assets/
│   ├── css/       # 基础样式与当前视觉覆盖
│   ├── js/        # 页面交互
│   ├── images/    # Logo、分享图与产品截图
│   ├── fonts/     # 本地字体
│   └── video/     # 首屏背景视频
├── docs/          # Starlight 配置、样式与用户文档
├── scripts/       # 统一发布产物准备脚本
├── package.json
├── README.md
└── THIRD_PARTY_NOTICES.md
```

- [index.html](index.html)：中文默认内容、内联 `data-en` 英文文案、语义结构和分享元数据。
- [assets/css/styles.css](assets/css/styles.css)：基础主题、组件、响应式布局与可访问性样式。
- [assets/css/refinement.css](assets/css/refinement.css)：当前视觉主题、首屏、玻璃面板、字号和间距覆盖；在基础样式后加载。
- [assets/js/site.js](assets/js/site.js)：中英文切换、手机导航、截图切换、流程标签、键盘交互与视口进入动画。
- `docs/src/content/docs/`：面向实际使用者的产品说明、功能指南和注意事项。
- `docs/astro.config.mjs`：Starlight 导航、中文界面和 `/docs` 基础路径配置。
- `scripts/prepare-dist.mjs`：构建前将宣传站复制到统一的 `dist/`。
- `assets/images/`：Logo、分享封面和真实产品截图。
- `assets/video/`：首屏环境光场视频，页面本地加载，不依赖运行时热链。
- `assets/fonts/`：本地字体资源，不依赖在线字体服务。
- [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md)：历史版本的第三方代码归属声明。

## 内容维护

功能事实来自相邻 WDM 主项目的 `docs/domains/`、`docs/architecture/`、`docs/standards/` 与对应代码。用户文档以这些资料为事实依据重新编写，不直接照搬工程文档。主项目功能变化后，需要同步核对宣传页和 `docs/src/content/docs/`。

- 日报、周报和提示词按用户隔离；不要宣传为默认团队共享。
- 脚本区分私有与公共可见性，公共发布受管理员权限控制。
- 自动任务支持定时和 Webhook，AI 能力来自外部 nanobot。
- 流程面板是能力说明，截图是产品展示；不添加伪装成实时数据的运行数字、客户评价或效果指标。
- 截图更新前检查是否包含不适合公开的账号信息。新增英文内容使用 `data-en`，同时更新需要翻译的辅助标签。

## 验证与发布

```bash
node --check assets/js/site.js
npm run build
```

本地预览验证暗色主题、中英文、移动导航、两张截图、流程标签方向键与 Home/End、FAQ 展开、滚动进入动画、320px 至桌面尺寸的溢出和键盘焦点。减少动画模式下关闭过渡与入场动画；不支持背景模糊时使用实体背景回退。

GitHub Actions 会在 `main` 分支更新后构建并发布整个 `dist/`。工作流为当前项目页使用 `DOCS_BASE=/wdm-site/docs`；若改用根域名部署，应改为 `/docs`。代码修改不等于已推送或已上线。
