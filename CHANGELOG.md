# Changelog

## [Unreleased] - SEO 改造：前端路由 + 动态 Meta + 静态资源

### Added

- **前端路由系统**：基于 `react-router-dom v7` 的 `createBrowserRouter`，支持 `/`、`/tools/:toolId`、`/about`、`/privacy`、`*`（404）路由
- **页面级 SEO 组件**：`Seo` / `MetaTags` / `JsonLd` 三件套，每个页面拥有独立的 title、description、canonical、OG、Twitter 标签
- **JSON-LD 结构化数据**：首页 `WebApplication`，工具页 `SoftwareApplication` + `BreadcrumbList`，关于页 `AboutPage`，隐私页 `PrivacyPolicy`
- **robots.txt**：允许所有爬虫，指向 sitemap
- **sitemap.xml**：包含首页、7 个可用工具页、关于页、隐私页（排除 Coming Soon 工具）
- **noscript 降级**：`index.html` 添加 `<noscript>` 内容，JS 禁用时仍可见站点标题和描述
- **SEO 常量层**：`src/constants/seo.ts` 统一管理站点 URL、页面 meta、JSON-LD 生成函数
- **页面容器**：`HomePage`、`ToolPage`、`NotFoundPage` 组件，组合路由与 SEO 注入

### Changed

- **导航重构为可抓取链接**：Navbar、Footer、ToolsGrid、ToolHeader、Hero CTA、About/Privacy CTA 中的所有内部导航从 `<button onClick>` 改为 `<Link>` / `<a>`
- **App.tsx**：从单一 `currentView` 状态管理重构为路由 `Outlet` 模式
- **index.html**：补全 OG 标签（`og:site_name`、`og:locale`、`og:locale:alternate`），更新默认 title 和 description
- **生产域名**：全站统一为 `https://image-kit.contextlab.top`，源码中由 `SITE_URL` 常量管理

### Removed

- **react-helmet-async 依赖**：与 React 19 不兼容（`meta`/`link` prop 不生效），改为自定义 `MetaTags` 组件直接操作 DOM
- **`onNavigate` / `currentView` 状态流**：被路由系统取代，Navbar、Footer、ToolWorkspace 不再接收导航回调 props
- **ToolWorkspace `onBack` prop**：ToolHeader 面包屑改用 `<Link to="/">`，不再需要回调

### Fixed

- **meta/canonical 不按页面更新**：`react-helmet-async` 的 `meta`/`link` 在 React 19 下不生效，改用 `useEffect` 直接操作 DOM
- **双重历史记录**：ToolsGrid `<Link>` 同时绑定 `onClick={navigate}` 导致每次导航 push 两条 history，移除冗余 `onClick`
- **JSON-LD 未注入**：`react-helmet-async` 的 `script` prop 不生效，改用自定义 `JsonLd` 组件直接操作 DOM
