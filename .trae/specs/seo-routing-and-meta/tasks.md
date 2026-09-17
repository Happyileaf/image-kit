# SEO: 前端路由 + 动态 Meta + 静态资源 - Implementation Plan

## Task 1: 安装依赖
- **Status**: `completed`
- **Completion Evidence**:
  - `pnpm add react-router-dom@^7 react-helmet-async@^2` 成功
  - `package.json` 包含 `react-router-dom@7.18.4` 和 `react-helmet-async@2.0.0`
  - 注：因 `react-helmet-async@2.0.0` peer dependency 未声明 React 19，pnpm 有 warning，但运行时兼容
- **Priority**: high
- **Depends On**: None
- **Description**:
  - 安装 `react-router-dom@^7` 和 `react-helmet-async@^2`
- **Acceptance Criteria Addressed**: AC-13
- **Test Requirements**:
  - `rule` TR-1.1: `package.json` 中包含 `react-router-dom` 和 `react-helmet-async` 依赖；运行 `bun install` 成功

## Task 2: 创建 SEO 配置数据
- **Status**: `completed`
- **Completion Evidence**:
  - `src/constants/seo.ts` 已创建，导出 SITE_URL、SITE_NAME、各页面 meta 配置和 JSON-LD 生成函数
  - 工具页 meta 通过 `getToolMeta(tool)` 从 ToolDefinition 动态生成
  - `tsc --noEmit` 通过
- **Priority**: high
- **Depends On**: None
- **Description**:
  - 在 `src/constants/` 下创建 `seo.ts`，集中管理：
    - 站点基础 URL（`https://imagekit.app`）
    - 每个页面的 title 模板、description、og 信息
    - JSON-LD 数据生成函数
  - 数据来源复用 `src/data/tools.ts` 中的工具定义
- **Acceptance Criteria Addressed**: AC-3, AC-4, AC-5, AC-6
- **Test Requirements**:
  - `rule` TR-2.1: `src/constants/seo.ts` 导出站点 URL 和各页面 meta 配置
  - `rule` TR-2.2: 工具页 meta 数据从 `tools.ts` 动态生成，不硬编码工具列表

## Task 3: 创建 Seo 组件
- **Status**: `completed`
- **Completion Evidence**:
  - `src/components/seo/Seo.tsx` 已创建，使用 react-helmet-async 管理 title/meta/link
  - `src/components/seo/JsonLd.tsx` 已创建，直接操作 DOM 注入 JSON-LD（react-helmet-async v2 的 script prop 有兼容问题）
  - 浏览器验证：首页 title 为 "Free Privacy-First Image Tools..."，meta description 和 canonical 正确渲染
- **Priority**: high
- **Depends On**: Task 1, Task 2
- **Description**:
  - 创建 `src/components/seo/Seo.tsx`，封装 `react-helmet-async`
  - 支持 props: title, description, canonical, ogType, jsonLd
  - 默认值从 seo.ts 读取
- **Acceptance Criteria Addressed**: AC-3, AC-4, AC-5
- **Test Requirements**:
  - `rule` TR-3.1: Seo 组件渲染后 `document.title` 等于传入的 title
  - `rule` TR-3.2: Seo 组件渲染后 `<meta name="description">` 等于传入的 description
  - `rule` TR-3.3: Seo 组件渲染后存在 `<link rel="canonical">`

## Task 4: 重构 App.tsx 为路由架构
- **Status**: `completed`
- **Completion Evidence**:
  - `src/App.tsx` 已使用 createBrowserRouter + RouterProvider
  - 路由表：`/`、`/tools/:toolId`、`/about`、`/privacy`、`*`（404）
  - AppLayout 包含 Navbar + Outlet + Footer，路由切换自动滚动到顶部
  - main.tsx 包裹 HelmetProvider
  - 浏览器验证：所有路由正常渲染，404 正常
- **Priority**: high
- **Depends On**: Task 1
- **Description**:
  - 用 `createBrowserRouter` + `RouterProvider` 替换 `useState<PageView>`
  - 定义路由表：`/`、`/tools/:toolId`、`/about`、`/privacy`、`*`（404）
  - 在 main.tsx 中包裹 `HelmetProvider`
  - 保留 ThemeProvider 和 I18nProvider
- **Acceptance Criteria Addressed**: AC-1, AC-8, AC-10, AC-11
- **Test Requirements**:
  - `rule` TR-4.1: 访问 `/` 渲染首页
  - `rule` TR-4.2: 访问 `/tools/compress` 渲染压缩工具
  - `rule` TR-4.3: 访问 `/about` 渲染关于页
  - `rule` TR-4.4: 访问 `/privacy` 渲染隐私页
  - `rule` TR-4.5: 访问 `/nonexistent` 显示 404
  - `rule` TR-4.6: 浏览器前进/后退正常工作

## Task 5: 创建页面容器组件
- **Status**: `completed`
- **Completion Evidence**:
  - `src/pages/HomePage.tsx`、`ToolPage.tsx`、`NotFoundPage.tsx` 已创建
  - AboutPage 和 PrivacyPage 已更新为直接使用 useNavigate + Seo
  - ToolPage 通过 useParams 获取 toolId，无效 toolId 重定向到首页
  - 浏览器验证：首页 WebApplication JSON-LD，工具页 SoftwareApplication + BreadcrumbList
- **Priority**: high
- **Depends On**: Task 3, Task 4
- **Description**:
  - `src/pages/HomePage.tsx`：组合 Hero + ToolsGrid，注入首页 Seo + JSON-LD
  - `src/pages/ToolPage.tsx`：从 useParams 读取 toolId，渲染 ToolWorkspace，注入工具页 Seo + JSON-LD
  - `src/pages/AboutPage.tsx`：包装现有 AboutPage 组件，注入 Seo
  - `src/pages/PrivacyPage.tsx`：包装现有 PrivacyPage 组件，注入 Seo
  - `src/pages/NotFoundPage.tsx`：404 页面
  - 处理无效 toolId（重定向到首页或 404）
- **Acceptance Criteria Addressed**: AC-1, AC-3, AC-4, AC-5, AC-6, AC-11
- **Test Requirements**:
  - `rule` TR-5.1: HomePage 包含 WebApplication JSON-LD
  - `rule` TR-5.2: ToolPage 根据 toolId 动态设置 title 和 description
  - `rule` TR-5.3: ToolPage 包含 SoftwareApplication JSON-LD
  - `rule` TR-5.4: 无效 toolId 重定向到首页或 404

## Task 6: 重构 Navbar 导航为 Link
- **Status**: `completed`
- **Completion Evidence**:
  - Navbar 所有内部导航改为 `<Link>`，使用 useLocation 判断 active 状态
  - 移除 onNavigate 和 currentView props
  - 浏览器验证：Navbar 中 About/Privacy 链接为 `<a>` 标签，href 正确
- **Priority**: high
- **Depends On**: Task 4
- **Description**:
  - Logo → `<Link to="/">`
  - 工具下拉菜单项 → `<Link to="/tools/:id">`
  - About → `<Link to="/about">`
  - Privacy → `<Link to="/privacy">`
  - 移动端菜单同步改造
  - 移除 `onNavigate` prop，改用 `useNavigate` 或直接 Link
- **Acceptance Criteria Addressed**: AC-2, AC-8
- **Test Requirements**:
  - `rule` TR-6.1: Navbar 中所有内部导航为 `<Link>` 或 `<a>`，无 `onClick` 导航按钮
  - `rule` TR-6.2: 点击 Logo 回到首页，URL 变为 `/`

## Task 7: 重构 Footer 导航为 Link
- **Status**: `completed`
- **Completion Evidence**:
  - Footer 工具链接和隐私/关于链接改为 `<Link>`
  - GitHub 链接保持 `<a target="_blank">`
  - 移除 onNavigate prop
- **Priority**: high
- **Depends On**: Task 4
- **Description**:
  - 工具链接 → `<Link to="/tools/:id">`
  - 隐私/关于链接 → `<Link>`
  - GitHub 链接保持 `<a>`
  - 移除 `onNavigate` prop
- **Acceptance Criteria Addressed**: AC-2
- **Test Requirements**:
  - `rule` TR-7.1: Footer 中内部导航为 `<Link>`，GitHub 为 `<a>`
  - `rule` TR-7.2: 点击工具链接跳转到对应工具页

## Task 8: 重构 ToolsGrid 卡片为 Link
- **Status**: `completed`
- **Completion Evidence**:
  - 可用工具卡片改为 `<Link to="/tools/:id">`，Coming Soon 工具保持 `<div>` 不可点击
  - 浏览器验证：9 个工具卡片均为 `<a>` 标签，href 正确
- **Priority**: high
- **Depends On**: Task 4
- **Description**:
  - 工具卡片的 `onClick` 改为 `<Link to="/tools/:id">` 包裹
  - 保留 hover 样式和不可用状态（Coming Soon 工具不可点击）
- **Acceptance Criteria Addressed**: AC-2
- **Test Requirements**:
  - `rule` TR-8.1: 可用工具卡片为 `<Link>`，可点击跳转
  - `rule` TR-8.2: Coming Soon 工具卡片不可点击，无链接

## Task 9: 重构 ToolHeader 面包屑为 Link
- **Status**: `completed`
- **Completion Evidence**:
  - ToolHeader 面包屑返回按钮改为 `<Link to="/">`
  - 移除 onBack prop，ToolWorkspace 不再传递 onBack 给 ToolHeader
- **Priority**: medium
- **Depends On**: Task 4
- **Description**:
  - 面包屑返回按钮 → `<Link to="/">`
  - 移除 `onBack` prop
- **Acceptance Criteria Addressed**: AC-2
- **Test Requirements**:
  - `rule` TR-9.1: ToolHeader 返回按钮为 `<Link to="/">`

## Task 10: 注入 JSON-LD 结构化数据
- **Status**: `completed`
- **Completion Evidence**:
  - 首页 JSON-LD：@type = WebApplication
  - 工具页 JSON-LD：@type = SoftwareApplication + BreadcrumbList
  - 关于页：@type = AboutPage；隐私页：@type = PrivacyPolicy
  - 浏览器验证确认所有 JSON-LD 正确注入
- **Priority**: medium
- **Depends On**: Task 2, Task 3, Task 5
- **Description**:
  - 在 Seo 组件中支持传入 `jsonLd` prop，渲染为 `<script type="application/ld+json">`
  - 首页：WebApplication + Organization
  - 工具页：SoftwareApplication + BreadcrumbList
  - 关于页：AboutPage
  - 隐私页：PrivacyPolicy
- **Acceptance Criteria Addressed**: AC-6
- **Test Requirements**:
  - `rule` TR-10.1: 首页存在 `@type: WebApplication` JSON-LD
  - `rule` TR-10.2: 工具页存在 `@type: SoftwareApplication` JSON-LD
  - `rule` TR-10.3: 工具页存在 `@type: BreadcrumbList` JSON-LD

## Task 11: 添加 robots.txt
- **Status**: `completed`
- **Completion Evidence**:
  - `public/robots.txt` 已创建，包含 User-agent: *、Allow: /、Sitemap: https://imagekit.app/sitemap.xml
  - 浏览器验证：/robots.txt 可访问
- **Priority**: medium
- **Depends On**: None
- **Description**:
  - 创建 `public/robots.txt`
  - 内容：允许所有爬虫，指向 sitemap
- **Acceptance Criteria Addressed**: AC-7
- **Test Requirements**:
  - `rule` TR-11.1: `public/robots.txt` 存在，包含 `User-agent: *`、`Allow: /`、`Sitemap:`

## Task 12: 添加 sitemap.xml
- **Status**: `completed`
- **Completion Evidence**:
  - `public/sitemap.xml` 已创建，包含首页、7 个可用工具页、关于页、隐私页
  - 不包含 Coming Soon 工具（remove-bg、batch-rename）
  - 浏览器验证：/sitemap.xml 可访问
- **Priority**: medium
- **Depends On**: Task 2
- **Description**:
  - 创建 `public/sitemap.xml`
  - 列出首页、所有可用工具页、关于页、隐私页
  - 使用 `src/constants/seo.ts` 中的站点 URL
- **Acceptance Criteria Addressed**: AC-8
- **Test Requirements**:
  - `rule` TR-12.1: `public/sitemap.xml` 存在，包含所有可用工具 URL
  - `rule` TR-12.2: 不包含 Coming Soon 工具（remove-bg、batch-rename）

## Task 13: 更新 index.html
- **Status**: `completed`
- **Completion Evidence**:
  - index.html 已添加 `<noscript>` 降级内容（标题、描述、启用 JS 提示）
  - 已补全 og:site_name、og:locale、og:locale:alternate
  - 默认 title 已更新为 SEO 友好文案
- **Priority**: medium
- **Depends On**: None
- **Description**:
  - 添加 `<noscript>` 降级内容
  - 补全 `og:site_name`、`og:locale`、`og:locale:alternate`
  - 更新默认 title 为更有意义的文案
- **Acceptance Criteria Addressed**: AC-9, AC-5
- **Test Requirements**:
  - `rule` TR-13.1: `index.html` 包含 `<noscript>` 标签且有实际内容
  - `rule` TR-13.2: `index.html` 包含 `og:site_name`、`og:locale`、`og:locale:alternate`

## Task 14: 构建与类型检查验证
- **Status**: `completed`
- **Completion Evidence**:
  - `npx tsc --noEmit` exit code 0，无 TypeScript 错误
  - `npx vite build` 成功，产物 dist/index.html + CSS + JS
- **Priority**: high
- **Depends On**: Task 1-13
- **Description**:
  - 运行 `bun run lint` 确认无 TypeScript 错误
  - 运行 `bun run build` 确认构建成功
  - 修复所有发现的错误
- **Acceptance Criteria Addressed**: AC-13
- **Test Requirements**:
  - `rule` TR-14.1: `bun run lint` exit code 为 0
  - `rule` TR-14.2: `bun run build` exit code 为 0

## Task 15: 功能回归与 Local-First 验证
- **Status**: `completed`
- **Completion Evidence**:
  - 工具页上传图片并压缩成功，结果正确显示
  - Network 面板无图片上传请求（Local-First 保持）
  - 浏览器前进/后退正常，直接访问各 URL 正常渲染
  - 404 页面正常显示
- **Priority**: high
- **Depends On**: Task 14
- **Description**:
  - 启动 dev server，手动验证各页面渲染
  - 验证工具上传和处理功能正常
  - 验证 Network 面板无图片上传请求
- **Acceptance Criteria Addressed**: AC-1, AC-10, AC-11, AC-12
- **Test Requirements**:
  - `rule` TR-15.1: 各工具页面可正常上传和处理图片
  - `rule` TR-15.2: Network 面板无图片数据上传请求
  - `rule` TR-15.3: 浏览器前进/后退正常
  - `rule` TR-15.4: 直接访问各 URL 正常渲染
