# 本地 Canvas 图片工具（旋转 / 缩放 / 水印 / 裁剪 / 模糊）实现 Spec

## Why

当前仅 `compress`（压缩）与 `convert`（格式转换）两个工具可用，[tools.ts](../../../../src/data/tools.ts) 中 5 个工具标记为 Coming Soon。经评估，这 5 个工具（Rotate & Flip、Resize、Watermark、Crop、Blur & Redact）均可 100% 基于浏览器 Canvas 2D 本地实现，零新增依赖、零网络上传，完全符合 [AGENTS.md](../../../../ AGENTS.md) 的 Privacy-First / Local-First 核心原则，应当落地。

同时，[ToolWorkspace.tsx](../../../../src/components/tools/ToolWorkspace.tsx) 目前将工具设置面板与处理逻辑硬编码（`tool.id === 'compress' ? ... : ...`），若不先做架构治理，新增 5 个工具会产生不可维护的分支堆叠。

## What Changes

- **架构重构（先行）**：引入「工具模块注册表」（Tool Module Registry），将每个工具抽象为自描述模块（默认参数 + 处理器 + 设置面板），`ToolWorkspace` 泛化为注册表驱动，消除工具分支硬编码。
- **共享 Canvas 基础设施**：抽取 `loadImageElement`、`canvasToBlob`、`resolveOutputMime`、JPEG 白底填充等公共逻辑，供 7 个工具（含已有 2 个）复用。
- **归一化坐标设置模型**：所有几何类设置（裁剪区域、模糊区域、水印位置）统一使用 0–1 归一化坐标，使同一设置可无差别应用于批量不同尺寸的图片，保持现有「批量自动处理」工作区范式。
- **新增 5 个工具**，每个工具一次独立 git commit：
  1. Rotate & Flip（90°/180°/270° 旋转 + 水平/垂直翻转）
  2. Resize（像素 / 百分比两种模式、锁定宽高比、社交尺寸预设、多步降采样保质量）
  3. Watermark（文字 / Logo 图片、九宫格锚点定位、透明度、平铺模式、字号随图宽相对缩放）
  4. Crop（自由 / 1:1 / 4:3 / 3:2 / 16:9 比例锁定、可视化选框编辑器、三分构图网格）
  5. Blur & Redact（矩形选区、像素化 / 高斯模糊两种效果、强度可调、`ctx.filter` 不支持时自动降级为像素化）
- **共享交互组件 RegionEditor**：基于 Pointer Events 的拖拽选框编辑器，Crop（单选区 + 比例锁定）与 Blur（多选区）复用。
- **i18n 双语补全**：en / zh 两个 locale 同步新增全部工具文案；5 个工具的 `isAvailable` 翻为 `true` 并移除 Coming soon 徽章；工具特性文案按实际交付能力如实调整（如 Blur 仅支持矩形选区、Rotate 为重编码高质量输出）。
- **串行提交**：架构重构 1 次 commit + 每个工具各 1 次 commit，共 6 次；每次提交前通过 `npm run lint`（tsc --noEmit）与 `npm run build`。

## Impact

- Affected specs: 工具工作区架构、工具目录（tools grid）、i18n 文案
- Affected code:
  - 重构：[ToolWorkspace.tsx](../../../../src/components/tools/ToolWorkspace.tsx)、[imageProcessor.ts](../../../../src/utils/imageProcessor.ts)、[types.ts](../../../../src/types.ts)
  - 新增：`src/modules/`（注册表与工具模块）、`src/utils/canvas-utils.ts`、`src/utils/processors/`（5 个处理器）、`src/components/tools/region-editor/`、5 个设置面板组件
  - 文案：[tools.ts](../../../../src/data/tools.ts)、[en.ts](../../../../src/i18n/locales/en.ts)、[zh.ts](../../../../src/i18n/locales/zh.ts)

## 架构设计

### 工具模块注册表

```text
src/modules/
├── types.ts              # ToolModule 接口、SettingsPanelProps、ProcessResult
├── index.ts              # TOOL_MODULES 注册表 + getToolModule()
├── compress.ts           # 迁移既有能力为模块
├── convert.ts            # 迁移既有能力为模块
├── rotate.ts
├── resize.ts
├── watermark.ts
├── crop.ts
└── blur.ts
```

每个工具模块实现统一契约：

```text
ToolModule<O> = {
  id: ToolId
  defaultOptions: O
  processor: (item, options) => Promise<ProcessResult>
  SettingsPanel: React 组件（接收 options / onChange / onApply / isProcessing / itemCount）
}
```

`ToolWorkspace` 仅通过 `getToolModule(tool.id)` 获取处理器与设置面板，不再出现任何按工具 id 的分支。新增工具 = 新增一个模块文件 + 注册一行，符合 AGENTS.md「新增工具时应复用现有结构」的要求。

### 编码规范适配（用户规则 vs 既有代码）

- **新增文件**严格遵循用户编码规则（/Users/haoya/Desktop/projects/ai-toolkit/rules/coding）：
  - 组件：kebab-case 文件夹 + `index.tsx` 入口 + PascalCase 组件名 + 默认导出（REACT-001）
  - 工具函数文件：kebab-case（NAMING-001）
  - 注释：中文 JSDoc 多行注释，函数含 `@description` / `@param` / `@returns` / `@example`（COMMENT-001）
  - 业务枚举：`XxxEnum` + `XxxLabelMap` + `XxxOptions` 三件套（ENUM-001）
- **修改既有文件**（ToolWorkspace.tsx、types.ts、locales、imageProcessor.ts）时保持其原有风格，做最小必要改动，不为了规范而重写存量代码。

## ADDED Requirements

### Requirement: 工具模块注册表

The system SHALL provide a registry-driven tool module architecture where each tool declares its default options, processor and settings panel, and the workspace resolves them without per-tool branching.

#### Scenario: 新增工具无需改动工作区

- **WHEN** 开发者新增一个工具模块并在注册表登记
- **THEN** ToolWorkspace 无需任何修改即可渲染该工具的设置面板并执行处理

#### Scenario: 既有工具回归

- **WHEN** 重构完成后用户使用 compress / convert
- **THEN** 功能与重构前一致（质量滑杆、格式选择、批量处理、ZIP 导出、对比弹窗均正常）

### Requirement: Rotate & Flip 工具

The system SHALL provide lossless-geometry rotation (90°/180°/270°) and horizontal/vertical flipping via canvas transforms, processed locally for single or batch images.

#### Scenario: 批量旋转

- **WHEN** 用户选择 90° 旋转并载入多张图片
- **THEN** 全部图片在本地完成旋转，宽高互换正确，可单张下载或 ZIP 导出

#### Scenario: 翻转组合

- **WHEN** 用户同时开启水平翻转与 180° 旋转
- **THEN** 输出结果等效于垂直翻转，画布变换顺序正确

### Requirement: Resize 工具

The system SHALL provide pixel-based and percentage-based resizing with optional aspect-ratio lock and social media dimension presets.

#### Scenario: 锁定比例修改宽度

- **WHEN** 用户锁定宽高比并输入目标宽度
- **THEN** 高度自动按比例计算，输出尺寸精确等于预期

#### Scenario: 百分比批量缩放

- **WHEN** 用户选择 50% 并应用于多张不同尺寸图片
- **THEN** 每张图片输出尺寸均为原始宽高的 50%

#### Scenario: 大幅缩小的输出质量

- **WHEN** 用户将 4000px 图片缩至 800px
- **THEN** 处理器采用多步降采样，输出无明显锯齿

### Requirement: Watermark 工具

The system SHALL provide text and image-logo watermarks with 9-anchor positioning, opacity control, and tiling mode, with all geometry expressed in normalized coordinates so one setting applies to a whole batch.

#### Scenario: 文字水印

- **WHEN** 用户输入文字、选择右下角锚点、设置 40% 不透明度
- **THEN** 全部图片右下角以相对边距渲染半透明文字，字号随图片宽度等比缩放

#### Scenario: Logo 平铺水印

- **WHEN** 用户从本机选择一张 Logo 图并开启平铺模式
- **THEN** Logo 以设定透明度重复铺满整张图片，Logo 文件仅在本地读取不上传

### Requirement: Crop 工具

The system SHALL provide an interactive region editor with free and fixed aspect ratios (1:1 / 4:3 / 3:2 / 16:9) and a rule-of-thirds grid overlay, storing the crop region in normalized coordinates.

#### Scenario: 可视化裁剪

- **WHEN** 用户在设置面板打开选框编辑器，在代表图片上拖拽出 16:9 区域并确认
- **THEN** 设置保存为归一化矩形，批量中所有图片按相同相对区域裁剪

#### Scenario: 边界保护

- **WHEN** 用户拖动手柄超出图片边界
- **THEN** 选框被约束在图片范围内，最小尺寸不低于 1% 宽高

### Requirement: Blur & Redact 工具

The system SHALL provide multiple rectangle redaction regions with pixelate or Gaussian-blur effects and adjustable intensity, reusing the shared region editor in multi-region mode.

#### Scenario: 多区域打码

- **WHEN** 用户在代表图片上绘制 3 个矩形并选择像素化
- **THEN** 批量所有图片在相同相对位置应用像素化，区域可单独删除

#### Scenario: 模糊降级

- **WHEN** 浏览器不支持 `CanvasRenderingContext2D.filter`
- **THEN** 高斯模糊效果自动降级为像素化，处理不报错

### Requirement: 工程纪律

The system SHALL deliver each feature as an independent git commit, each passing `npm run lint` and `npm run build`, with full en/zh i18n coverage.

#### Scenario: 逐功能提交

- **WHEN** 一个工具实现完成
- **THEN** 类型检查与构建通过、dev 环境手工冒烟通过后立即提交，再开始下一个工具

#### Scenario: 隐私原则零突破

- **WHEN** 任一工具处理图片
- **THEN** 不产生任何图片相关的网络请求（DevTools Network 面板无 POST/PUT 上传）

## MODIFIED Requirements

### Requirement: 工具工作区渲染逻辑

[ToolWorkspace.tsx](../../../../src/components/tools/ToolWorkspace.tsx) 的设置面板选择与处理分发逻辑 SHALL 改为注册表驱动：移除 `tool.id === 'compress' ? <CompressorSettings/> : <ConverterSettings/>` 三目分支与 `processItems` 中的 if-else 分支，改为 `getToolModule(tool.id)` 统一解析。既有视觉布局（双栏、批量统计条、ZIP 面板、对比弹窗）保持不变。

### Requirement: 工具目录可用状态

[tools.ts](../../../../src/data/tools.ts) 与 en/zh locale 中 `rotate`、`resize`、`watermark`、`crop`、`blur` 五个工具的 `isAvailable` SHALL 为 `true`，不再展示 Coming soon 徽章；`features` 文案与实际交付能力一致。

## REMOVED Requirements

无。
