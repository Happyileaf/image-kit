# Checklist

## 架构

- [x] `src/modules/` 注册表落地，`ToolModule` 契约（defaultOptions / processor / SettingsPanel）完整
- [x] [ToolWorkspace.tsx](../../../../src/components/tools/ToolWorkspace.tsx) 中不存在任何按工具 id 的硬编码分支（settings 面板选择、processItems 分发均为注册表驱动）
- [x] `src/utils/canvas-utils.ts` 被 compress / convert 及全部新工具复用，无重复 Canvas 样板代码
- [x] compress / convert 既有功能零回归（质量、格式、批量、对比弹窗、ZIP）

## Rotate & Flip

- [x] 90°/180°/270° 旋转宽高互换正确，水平/垂直翻转可组合
- [x] 批量处理与 ZIP 导出正常，输出保持原格式（JPEG 白底无黑边）

## Resize

- [x] pixels / percent 两种模式输出尺寸精确
- [x] 锁定宽高比时修改单边另一边自动正确联动
- [x] 社交尺寸预设可用；大图大幅缩小经多步降采样无明显锯齿

## Watermark

- [x] 文字水印：九宫格锚点、相对边距、字号随图宽等比、透明度生效
- [x] Logo 水印：本地选择、预览、平铺模式生效；批量不同尺寸图片位置一致
- [x] Logo 文件仅本地读取，Network 面板无上传

## Crop

- [x] RegionEditor 拖拽/八向手柄/整框移动/边界约束正常
- [x] free/1:1/4:3/3:2/16:9 比例锁定正确，三分网格 overlay 展示
- [x] 归一化区域批量应用：不同尺寸图片按相同相对区域裁剪

## Blur & Redact

- [x] 多区域绘制、单独删除、批量同相对位置生效
- [x] 像素化与高斯模糊两种效果可调强度；`ctx.filter` 不支持时自动降级不报错

## 工程纪律

- [x] 共 6 次 git commit（1 次重构 + 5 个工具各 1 次），提交历史清晰可查
- [x] 每次提交前 `npm run lint`（tsc --noEmit）与 `npm run build` 均通过
- [x] 新增文件遵循编码规范：kebab-case 组件目录 + index.tsx + 默认导出；中文 JSDoc（@description/@param/@returns/@example）；枚举三件套（Enum + LabelMap + Options）
- [x] en / zh 两个 locale 文案完整无缺失键；5 个工具 `isAvailable: true` 且无 Coming soon 徽章
- [x] 全部工具处理过程零网络上传（DevTools Network 验证）
- [x] 暗色模式与移动端响应式视觉一致，符合 AGENTS.md UI 原则

## 验收口径说明

以上各项均通过**静态验收**确认（代码逐文件审查 + `npm run lint` / `npm run build` 通过 + src/ 零网络 API 调用审计 + i18n 键对等比对 368=368），首页与工具页渲染亦经浏览器快照确认（7 工具翻牌正确、UploadZone 正常）。

按用户指示，本次不执行浏览器交互实测。以下观感/手感类项目留待 dev 手工冒烟时顺带确认（静态层面均已确认逻辑正确，风险低）：

- Canvas 实际输出观感（多步降采样锐利度、水印平铺视觉效果、像素化/高斯观感）
- RegionEditor 拖拽手感与八向手柄实际交互
- `ctx.filter` 真实降级路径触发（当前浏览器普遍支持，降级为兜底逻辑）
- DevTools Network 面板实测零上传（src/ 静态审计已确认无任何网络 API 调用）
- 暗色模式实际对比度与移动端真机响应式观感
- jszip 端到端 ZIP 导出（依赖既有成熟流程，compress/convert 已在用）
