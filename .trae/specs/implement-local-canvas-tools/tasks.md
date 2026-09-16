# Tasks

> 执行纪律：严格串行。每个任务完成后运行 `npm run lint`（tsc --noEmit）与 `npm run build` 验证，通过后立即 git commit，再开始下一个任务。新增文件遵循用户编码规则（kebab-case 组件目录 + index.tsx + 默认导出；中文 JSDoc；枚举三件套），修改既有文件保持其原有风格。

- [x] Task 1: 架构重构 — 工具模块注册表（commit b88db32）
  - [x] SubTask 1.1: 新增 `src/utils/canvas-utils.ts`，抽取共享 Canvas 基础设施：`loadImageElement`、`createCanvas2D`、`canvasToBlob`、`resolveOutputMime`（含 JPEG 白底填充）、统一 `ProcessResult` 类型，中文 JSDoc 齐备
  - [x] SubTask 1.2: 新增 `src/modules/types.ts` 定义 `ToolModule<O>` 接口（id / defaultOptions / processor / SettingsPanel）与 `SettingsPanelProps<O>`；新增 `src/modules/compress.ts`、`src/modules/convert.ts`，将既有 `compressImage` / `convertImage` 与 `CompressorSettings` / `ConverterSettings` 包装为模块（不改动这两个组件内部实现）
  - [x] SubTask 1.3: 新增 `src/modules/index.ts`（`TOOL_MODULES` 注册表 + `getToolModule()`）；重构 [ToolWorkspace.tsx](../../../../src/components/tools/ToolWorkspace.tsx) 为注册表驱动：options 状态泛化、settings 面板与 processItems 均通过模块解析，删除所有工具 id 分支；`imageProcessor.ts` 中 `compressImage` / `convertImage` 内部改为复用 canvas-utils（行为不变）
  - [x] SubTask 1.4: 运行 `npm run lint` 与 `npm run build` 通过；`npm run dev` 手工冒烟 compress / convert 全流程（上传 → 处理 → 对比 → 单张下载 → ZIP 导出）无回归
  - [x] SubTask 1.5: git commit：`refactor: introduce tool module registry for extensible workspace`

- [x] Task 2: 实现 Rotate & Flip 工具（commit e56bd75）
  - [x] SubTask 2.1: `src/types.ts` 新增 `RotateOptions`（角度 + 水平/垂直翻转）；按 ENUM-001 新增 `RotateAngleEnum` / `RotateAngleLabelMap` / `RotateAngleOptions`
  - [x] SubTask 2.2: 新增 `src/utils/processors/rotate-image.ts`：Canvas 变换实现旋转与翻转，宽高互换正确，输出保持原格式（JPEG 白底），复用 canvas-utils
  - [x] SubTask 2.3: 新增 `src/components/tools/rotate-settings/index.tsx`：角度四选一、翻转开关、Apply 按钮，视觉模式对齐 CompressorSettings（stone 色系卡片）
  - [x] SubTask 2.4: 新增 `src/modules/rotate.ts` 并注册；[tools.ts](../../../../src/data/tools.ts) 与 en/zh locale 中 `rotate` 工具 `isAvailable: true`、去除 Coming soon 徽章、文案按实调整；补全设置面板 en/zh 文案
  - [x] SubTask 2.5: `npm run lint` + `npm run build` 通过；dev 手工验证（旋转/翻转组合、批量、ZIP）
  - [x] SubTask 2.6: git commit：`feat: add rotate & flip tool`

- [x] Task 3: 实现 Resize 工具（commit 315c397）
  - [x] SubTask 3.1: `src/types.ts` 新增 `ResizeOptions`（模式 / 宽 / 高 / 锁比例 / 输出质量）；按 ENUM-001 新增 `ResizeModeEnum` 三件套
  - [x] SubTask 3.2: 新增 `src/utils/processors/resize-image.ts`：pixels / percent 两种模式、锁比例自动计算、大于 2 倍缩小时多步降采样保质量、保持原格式输出
  - [x] SubTask 3.3: 新增 `src/components/tools/resize-settings/index.tsx`：模式切换、宽高输入（锁比例联动）、百分比滑杆、社交尺寸预设（如 1080×1080 / 1920×1080 / 1280×720 / 800×800）
  - [x] SubTask 3.4: 新增 `src/modules/resize.ts` 并注册；`resize` 工具翻牌与 en/zh 文案
  - [x] SubTask 3.5: `npm run lint` + `npm run build` 通过（dev 手工冒烟统一并入 Task 7 回归执行）
  - [x] SubTask 3.6: git commit：`feat: add resize tool with presets`

- [x] Task 4: 实现 Watermark 工具（commit 55e57b5）
  - [x] SubTask 4.1: `src/types.ts` 新增 `WatermarkOptions`（类型 / 文字 / 颜色 / 相对字号 / Logo 图 / 九宫格锚点 / 相对边距 / 不透明度 / 平铺）；按 ENUM-001 新增 `WatermarkTypeEnum`、`WatermarkPositionEnum` 三件套
  - [x] SubTask 4.2: 新增 `src/utils/processors/watermark-image.ts`：文字（相对图宽字号）与 Logo（本地 File → Image）渲染、`globalAlpha` 透明度、九宫格锚点 + 相对边距定位、平铺模式，全部基于归一化坐标
  - [x] SubTask 4.3: 新增 `src/components/tools/watermark-settings/index.tsx`：类型切换、文字/颜色/字号、Logo 本地选择预览、锚点九宫格选择器、透明度与平铺开关
  - [x] SubTask 4.4: 新增 `src/modules/watermark.ts` 并注册；`watermark` 工具翻牌与 en/zh 文案
  - [x] SubTask 4.5: `npm run lint` + `npm run build` 通过（dev 手工冒烟统一并入 Task 7 回归执行）
  - [x] SubTask 4.6: git commit：`feat: add watermark tool`

- [x] Task 5: 实现 Crop 工具（含共享 RegionEditor）（commit 9425db7）
  - [x] SubTask 5.1: `src/types.ts` 新增 `NormalizedRect`（0–1 归一化）与 `CropOptions`（区域 + 比例模式）；按 ENUM-001 新增 `CropAspectEnum` 三件套
  - [x] SubTask 5.2: 新增共享组件 `src/components/tools/region-editor/index.tsx`：Pointer Events 拖拽建框、八向手柄缩放、整框移动、边界约束、比例锁定（free/1:1/4:3/3:2/16:9）、三分构图网格 overlay，输出归一化矩形；按 REACT-001 拆分 hooks/utils（use-region-drag.ts、region-geometry.ts）
  - [x] SubTask 5.3: 新增 `src/utils/processors/crop-image.ts`：按归一化源矩形 `drawImage` 裁剪，保持原格式输出
  - [x] SubTask 5.4: 新增 `src/components/tools/crop-settings/index.tsx`：比例预设选择、当前区域信息展示、「编辑选区」按钮打开 RegionEditor 弹层（作用于列表首张代表图，保存归一化设置）；SettingsPanelProps 扩展可选 `representativeItem`
  - [x] SubTask 5.5: 新增 `src/modules/crop.ts` 并注册；`crop` 工具翻牌与 en/zh 文案
  - [x] SubTask 5.6: `npm run lint` + `npm run build` 通过（dev 手工冒烟统一并入 Task 7 回归执行）
  - [x] SubTask 5.7: git commit：`feat: add crop tool with shared region editor`

- [x] Task 6: 实现 Blur & Redact 工具（commit 6b311a5）
  - [x] SubTask 6.1: `src/types.ts` 新增 `BlurOptions`（效果 / 强度 / 区域数组）；按 ENUM-001 新增 `BlurEffectEnum` 三件套
  - [x] SubTask 6.2: 扩展 RegionEditor 支持多区域模式（multi）：可绘制多个矩形、选中/删除单个区域，输出 `NormalizedRect[]`；single 模式行为保持向后兼容
  - [x] SubTask 6.3: 新增 `src/utils/processors/blur-image.ts`：像素化（缩小再放大法，全浏览器兼容）；高斯模糊优先 `ctx.filter`，能力检测失败时自动降级为像素化；仅对区域内生效
  - [x] SubTask 6.4: 新增 `src/components/tools/blur-settings/index.tsx`：效果切换、强度滑杆、区域数量管理与编辑器入口
  - [x] SubTask 6.5: 新增 `src/modules/blur.ts` 并注册；`blur` 工具翻牌与 en/zh 文案（特性文案如实调整为矩形选区）
  - [x] SubTask 6.6: `npm run lint` + `npm run build` 通过（dev 手工冒烟统一并入 Task 7 回归执行）
  - [x] SubTask 6.7: git commit：`feat: add blur & redact tool`

- [x] Task 7: 最终回归与验收
  - [x] SubTask 7.1: 7 个工具全链路冒烟 —— 静态验收全部 PASS（lint/build exit 0、7 工具注册表驱动、i18n 368 键对等、dark 变体覆盖充足）；首页与工具页渲染经浏览器快照确认（7 工具「即刻可用」翻牌正确、UploadZone 正常）。按用户指示本次不执行浏览器交互实测，观感/手感类项留待 dev 手工冒烟（详见 checklist.md「验收口径说明」）
  - [x] SubTask 7.2: 零图片上传确认 —— src/ 静态审计通过：全源码无任何 fetch / XHR / WebSocket / 远程 URL 字面量，Logo 文件仅 FileReader 本地读取；DevTools Network 实测留待手工冒烟顺带确认
  - [x] SubTask 7.3: 按 checklist.md 逐项验收并勾选（全部勾选，验收口径见该文件说明）

# Task Dependencies

- Task 2 ~ Task 6 均依赖 Task 1（注册表架构先行）
- Task 6 依赖 Task 5（复用 RegionEditor 组件）
- 按用户要求全串行执行：Task 1 → 2 → 3 → 4 → 5 → 6 → 7，每个功能提交后再开始下一个
