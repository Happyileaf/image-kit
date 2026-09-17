# SEO: 前端路由 + 动态 Meta + 静态资源 - Product Requirements Document

## Overview
- **Summary**: 为 ImageKit 引入前端路由系统，使每个页面/工具拥有独立可索引的 URL；同时添加动态 Head 管理（title/description/canonical/OG）、JSON-LD 结构化数据，以及 `robots.txt`、`sitemap.xml`、`<noscript>` 等 SEO 静态资源。
- **Purpose**: 当前项目是纯 SPA，所有内容共用同一个 URL（`/`），导航全用 `<button onClick>`，搜索引擎无法索引各个工具页面。本次改造目标是让每个工具、每个页面都能被搜索引擎发现和索引。
- **Target Users**: 使用搜索引擎（Google 为主）查找图片工具的用户。

## Goals
- 每个页面（首页、工具页、关于页、隐私页）拥有独立 URL 路径
- 所有导航元素使用 `<Link>`/`<a>`，搜索引擎可抓取内部链接
- 每个页面设置独立的 `<title>` 和 `<meta name="description">`
- 注入 JSON-LD 结构化数据（WebApplication、SoftwareApplication、BreadcrumbList）
- 提供 `robots.txt`、`sitemap.xml`、`<noscript>` 降级内容
- 不破坏 Local-First 原则：图片处理完全保持在浏览器本地

## Non-Goals
- 不引入服务端渲染（SSR）
- 不做预渲染（Prerender）
- 不做基于 URL 的多语言路由（`/zh/...` 前缀），语言仍由 localStorage 管理
- 不修改任何图片处理模块（compress/convert/resize/crop/rotate/watermark/blur）
- 不引入用户身份或行为追踪

## Background & Context
- 当前 `App.tsx` 使用 `useState<PageView>` 切换视图，无 URL 路由
- 导航组件（Navbar、Footer、ToolsGrid、ToolHeader）全部使用 `<button onClick>` 跳转
- `index.html` 中 title 固定为 `ImageKit v1.0`，description 单一
- 无 `react-helmet` 或类似动态 meta 管理
- `public/` 目录只有 `vercel.svg`，无 `robots.txt`、`sitemap.xml`
- i18n（en/zh）基于 localStorage，不体现在 URL 中
- 项目核心原则：图片永远不离开用户设备（Local-First）

## Functional Requirements

- **FR-1**: 路由系统 — 引入 `react-router-dom` v7，定义以下路由：
  - `/` → 首页（Hero + ToolsGrid）
  - `/tools/compress` → 压缩工具
  - `/tools/convert` → 转换工具
  - `/tools/resize` → 调整尺寸
  - `/tools/crop` → 裁剪工具
  - `/tools/rotate` → 旋转翻转
  - `/tools/watermark` → 水印工具
  - `/tools/blur` → 模糊打码
  - `/about` → 关于页
  - `/privacy` → 隐私页
  - `*` → 404 兜底，重定向到首页

- **FR-2**: 导航改造 — 所有内部导航元素从 `<button onClick>` 改为 `<Link>`（react-router-dom）或 `<a>`（外链），确保爬虫可跟随链接。

- **FR-3**: 动态 Title — 每个页面设置独立的 `<title>`，格式为 `[页面/工具关键词] | ImageKit`。

- **FR-4**: 动态 Meta Description — 每个页面设置独立的 `<meta name="description">`，长度 120-160 字符，包含核心关键词。

- **FR-5**: Canonical & OG — 每个页面设置 `<link rel="canonical">`、`og:title`、`og:description`、`og:url`、`og:type`、`twitter:card`。

- **FR-6**: JSON-LD 结构化数据：
  - 首页：`WebApplication` + `Organization`
  - 工具页：`SoftwareApplication` + `BreadcrumbList`
  - 关于页：`AboutPage`
  - 隐私页：`PrivacyPolicy`

- **FR-7**: 静态 SEO 资源：
  - `public/robots.txt`：允许所有爬虫，指向 sitemap
  - `public/sitemap.xml`：列出所有可索引页面
  - `index.html` 中添加 `<noscript>` 降级内容
  - `index.html` 中补全 `og:site_name`、`og:locale`、`og:locale:alternate`

- **FR-8**: 浏览器导航 — 浏览器前进/后退按钮正常工作，页面切换时滚动到顶部。

- **FR-9**: 直接访问 — 用户直接在地址栏输入 `/tools/compress` 等路径可正确渲染对应页面（依赖 SPA fallback）。

- **FR-10**: 404 处理 — 未匹配的路由显示友好提示并提供返回首页的链接。

## Non-Functional Requirements

- **NFR-1 (Local-First)**: 图片处理逻辑完全保持浏览器本地执行，不引入任何服务端图片处理。
- **NFR-2 (零图片数据外传)**: 不发送任何图片文件、Blob、Base64、文件名到服务器。
- **NFR-3 (构建通过)**: `bun run build` 成功，无构建错误。
- **NFR-4 (类型检查)**: `bun run lint`（`tsc --noEmit`）通过，无 TypeScript 错误。
- **NFR-5 (无回归)**: 现有工具功能（压缩、转换、裁剪等）行为不变。
- **NFR-6 (性能)**: 不引入显著的首屏性能下降（路由和 meta 管理开销可忽略）。

## Constraints

- **技术约束**: 继续使用 Vite + React 19 + TypeScript；新增依赖 `react-router-dom` v7、`react-helmet-async`。
- **隐私约束**: 严格遵守 `AGENTS.md` 中的 Local-First 原则。
- **部署约束**: 需配置 SPA fallback（Vercel/Nginx），但本次不涉及部署配置文件修改。
- **i18n 约束**: 语言仍由 localStorage 管理，不做 URL 语言前缀。

## Dependencies

- `react-router-dom@^7` — 前端路由
- `react-helmet-async@^2` — 动态 Head 管理

## Assumptions

- Google 等主流搜索引擎可执行 JavaScript 并索引 SPA 页面。
- 部署平台支持 SPA fallback（所有路径返回 `index.html`）。
- 现有 `PageView` 状态模型可平滑迁移到路由。

## Acceptance Criteria

### AC-1: 独立 URL 路由
- **Type**: `rule`
- **Given**: 用户访问 `http://localhost:3000/tools/compress`
- **When**: 页面加载完成
- **Then**: 渲染压缩工具页面（ToolWorkspace with compress tool），浏览器地址栏显示 `/tools/compress`
- **Pass Condition**: 所有定义的路由（`/`、`/tools/*`、`/about`、`/privacy`）均渲染对应内容
- **Evidence**: 浏览器手动访问各 URL，确认渲染正确页面

### AC-2: 导航使用 Link/a 标签
- **Type**: `rule`
- **Given**: 首页已加载
- **When**: 检查 Navbar、Footer、ToolsGrid 中的导航元素
- **Then**: 内部导航使用 `<Link>`，外链使用 `<a>`，无 `<button onClick>` 用于页面跳转
- **Pass Condition**: DOM 中不存在用 `onClick` 触发 `setCurrentView` 的按钮导航
- **Evidence**: 检查渲染后的 DOM，确认导航元素为 `<a>` 标签

### AC-3: 动态 Title
- **Type**: `rule`
- **Given**: 用户导航到 `/tools/compress`
- **When**: 页面渲染完成
- **Then**: `document.title` 包含工具相关关键词（如 "Image Compressor"）和 "ImageKit"
- **Pass Condition**: 每个页面的 title 唯一且包含页面关键词
- **Evidence**: 浏览器 console 执行 `document.title` 验证

### AC-4: 动态 Meta Description
- **Type**: `rule`
- **Given**: 用户导航到 `/tools/convert`
- **When**: 页面渲染完成
- **Then**: `<meta name="description">` 内容与转换工具相关，长度 50-160 字符
- **Pass Condition**: 每个页面的 description 唯一且相关
- **Evidence**: 浏览器检查 `<head>` 中的 meta description

### AC-5: Canonical 和 OG 标签
- **Type**: `rule`
- **Given**: 任意页面已加载
- **When**: 检查 `<head>`
- **Then**: 存在 `<link rel="canonical">`、`og:title`、`og:description`、`og:url`、`og:type`、`twitter:card`
- **Pass Condition**: 所有页面均包含上述标签且内容正确
- **Evidence**: 浏览器检查 `<head>`

### AC-6: JSON-LD 结构化数据
- **Type**: `rule`
- **Given**: 首页已加载
- **When**: 检查 `<head>` 或 `<body>` 中的 `<script type="application/ld+json">`
- **Then**: 存在 `@type: WebApplication` 的 JSON-LD
- **Pass Condition**: 首页有 WebApplication，工具页有 SoftwareApplication
- **Evidence**: 浏览器检查 JSON-LD script 标签

### AC-7: robots.txt 存在
- **Type**: `rule`
- **Given**: 构建产物已生成
- **When**: 访问 `/robots.txt`
- **Then**: 返回 robots.txt 内容，包含 `User-agent: *`、`Allow: /`、`Sitemap:` 指令
- **Pass Condition**: 文件存在且语法正确
- **Evidence**: `public/robots.txt` 文件存在

### AC-8: sitemap.xml 存在
- **Type**: `rule`
- **Given**: 构建产物已生成
- **When**: 访问 `/sitemap.xml`
- **Then**: 返回 sitemap.xml，包含所有可索引页面的 URL
- **Pass Condition**: 文件存在且包含所有路由 URL
- **Evidence**: `public/sitemap.xml` 文件存在

### AC-9: noscript 降级
- **Type**: `rule`
- **Given**: 禁用 JavaScript
- **When**: 访问首页
- **Then**: 页面显示 noscript 降级内容（标题、描述、启用 JS 提示）
- **Pass Condition**: index.html 包含 `<noscript>` 标签且有实际内容
- **Evidence**: 检查 `index.html` 源文件

### AC-10: 浏览器前进/后退
- **Type**: `rule`
- **Given**: 用户从首页导航到工具页再到关于页
- **When**: 点击浏览器后退按钮
- **Then**: 依次回到工具页、首页，URL 和内容同步变化
- **Pass Condition**: 历史记录导航正常工作
- **Evidence**: 浏览器手动操作验证

### AC-11: 404 兜底
- **Type**: `rule`
- **Given**: 用户访问不存在的路径 `/nonexistent`
- **When**: 页面加载
- **Then**: 显示 404 提示并提供返回首页的链接
- **Pass Condition**: 未匹配路由显示友好 404 页面
- **Evidence**: 浏览器访问随机路径验证

### AC-12: Local-First 不受影响
- **Type**: `rule`
- **Given**: 用户在任意工具页上传图片并处理
- **When**: 检查网络请求
- **Then**: 无图片数据（文件、Blob、Base64）发送到任何服务器
- **Pass Condition**: Network 面板中无图片上传请求
- **Evidence**: 浏览器 DevTools Network 面板验证

### AC-13: 构建和类型检查通过
- **Type**: `rule`
- **Given**: 代码修改完成
- **When**: 运行 `bun run build` 和 `bun run lint`
- **Then**: 两者均成功退出（exit code 0）
- **Pass Condition**: 无构建错误和 TypeScript 错误
- **Evidence**: 终端命令输出

### AC-14: 代码质量与可维护性
- **Type**: `rubric`
- **Dimension**: 路由和 SEO 相关代码的组织清晰度
- **Scale**: 1-5
- **Anchors**: 1 = 路由逻辑散落在各组件中，难维护；3 = 有集中路由配置但 meta 管理分散；5 = 路由集中配置，Seo 组件封装良好，数据来源统一
- **Pass Threshold**: >= 4
- **Evidence**: 代码审查

## Open Questions
- [ ] 生产域名是什么？（用于 canonical、og:url、sitemap 中的绝对 URL，暂时使用 `https://imagekit.app` 作为占位）
- [ ] 是否需要在本次为 Coming Soon 的工具（remove-bg、batch-rename）也创建路由页面？（暂定：暂不创建，避免索引空页面）
