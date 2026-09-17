# AGENTS.md

## 项目定位

这是一个 **Privacy-First、Local-First 的图片工具平台**。

第一版支持：

* 图片压缩
* 图片格式转换

未来可扩展：

* Resize、Crop、Rotate
* Watermark、Blur
* OCR
* AI 去背景、放大等

核心体验：

> **打开 → 选择工具 → 本地处理 → 下载**

---

## 核心原则

优先级：

> **隐私理念 > 技术便利 > 精确数据统计**

四条核心原则（速览）：

1. **图片永远不离开用户设备** — 所有处理在浏览器本地完成
2. **不允许服务端兜底** — 宁可不做，也不上传图片到服务器
3. **无需登录** — 打开即可使用
4. **默认不追踪用户** — 不为精确 UV 牺牲隐私

> 各原则的具体禁止项、可选替代方案以及服务器/浏览器职责边界见 [docs/agents/CORE-PRINCIPLES.md](docs/agents/CORE-PRINCIPLES.md)。

---

## 技术边界

服务器只负责提供静态资源（HTML / CSS / JS / WASM / 本地模型），不得参与图片的上传、处理、存储或分析。

> 允许与禁止的数据流图见 [docs/agents/CORE-PRINCIPLES.md](docs/agents/CORE-PRINCIPLES.md#技术边界)。

---

## 架构要求

工具页面应该使用统一的工作区结构：

```text
Tool
├── Header
├── Upload Zone
├── File List
├── Settings
├── Processing
└── Result
```

基础组件应尽可能复用，例如：

```text
AppShell
Navigation
ToolCard
ToolGrid
ToolPage
UploadZone
FileList
SettingsPanel
ProcessingPanel
ResultPanel
PrivacyNotice
```

新增工具时应复用现有结构，而不是重新设计一套页面。

---

## UI 原则

整体风格：

* 现代 Web App
* 简洁
* 克制
* 有呼吸感
* 工具感
* 高品质

避免：

* 廉价在线工具网站风格
* 过度渐变
* 过度玻璃拟态
* 过多阴影
* 过度圆角
* 高信息密度
* 复杂营销模块

重点保证：

* 清晰的信息层级
* 足够留白
* 一致的组件体系
* 良好的 Desktop / Mobile 响应式体验

---

## Agent 决策规则

实现任何新功能前，先确认：

1. 能否完全在浏览器本地实现？
2. 是否需要发送图片或图片相关数据？
3. 是否引入第三方远程图片处理服务？
4. 是否引入用户身份或行为追踪？
5. 是否为了开发便利而突破 Local-First 原则？

如果存在冲突：

> **始终优先保护隐私。**

不要因为“更简单”“开发更快”“服务端性能更好”而上传用户图片。

---

## Agent 署名规范

当 AI Agent 在编码上有实际贡献时，必须在 commit message 中以 `Co-Authored-By` trailer 形式署名；纯人工编写或仅做咨询性建议的不需要。

> 各模型的署名格式与 GitHub 邮箱对应表见 [docs/agents/AGENT-ATTRIBUTION.md](docs/agents/AGENT-ATTRIBUTION.md)。

---

## 产品心智

用户应该形成三个简单认知：

> **不用登录。**

> **图片不上传。**

> **直接在浏览器里处理。**

本项目不是“支持本地处理的在线图片工具”，而是：

> **以本地处理和隐私保护为核心约束的图片工具平台。**
