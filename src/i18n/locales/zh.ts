import { ToolDefinition } from '../../types';

export const zhTools: ToolDefinition[] = [
  {
    id: 'compress',
    name: '图片压缩',
    shortDesc: '在保留良好视觉画质的同时大幅减小图片文件体积。',
    fullDesc: '利用浏览器 HTML5 Canvas 本地引擎智能压缩 JPG、PNG 和 WebP 图片。无需上传云端，最高可减少 80% 体积且肉眼无明显失真。',
    category: 'essentials',
    isAvailable: true,
    iconName: 'Minimize2',
    acceptedFormats: 'image/jpeg,image/png,image/webp',
    features: ['质量无级微调', '实时分屏前后画质对比', '多图批量压缩', '一键打包 ZIP 导出']
  },
  {
    id: 'convert',
    name: '格式转换',
    shortDesc: '在 PNG、JPG、WebP 和 AVIF 等现代格式间快速转换。',
    fullDesc: '完全在本地浏览器中进行常用图像格式互转，完美适配网页加载优化与各类软件格式兼容需求。',
    category: 'essentials',
    isAvailable: true,
    iconName: 'Repeat',
    acceptedFormats: 'image/jpeg,image/png,image/webp,image/avif',
    features: ['支持 WebP、JPG、PNG 与 AVIF', '批量格式转换', '压缩质量微调', '保留透明透明通道']
  },
  {
    id: 'resize',
    name: '调整尺寸',
    shortDesc: '按指定像素宽高或百分比精确缩放图片。',
    fullDesc: '在浏览器本地按精确像素或百分比缩放图片，大幅缩小时采用多步降采样保持画质，支持宽高比锁定与社媒常用尺寸预设。',
    category: 'essentials',
    isAvailable: true,
    iconName: 'Maximize2',
    acceptedFormats: 'image/*',
    features: ['像素与百分比模式', '宽高比锁定', '社媒尺寸预设', '多步降采样保真']
  },
  {
    id: 'crop',
    name: '裁剪图片',
    shortDesc: '在浏览器中按自由或固定比例快速裁剪图片。',
    fullDesc: '通过可视化选区编辑器自由修剪画面边缘，支持自由比例及 1:1、4:3、3:2、16:9 常用构图比例，全程本地 Canvas 处理。',
    category: 'essentials',
    isAvailable: true,
    iconName: 'Crop',
    acceptedFormats: 'image/*',
    features: ['可视化选区编辑器', '三分构图辅助线', '自由与预设比例', '批量裁剪']
  },
  {
    id: 'rotate',
    name: '旋转与翻转',
    shortDesc: '支持 90°/180°/270° 旋转或水平、垂直镜像翻转。',
    fullDesc: '快速修正照片朝向或镜像反转画面，纯浏览器本地计算，高质量重编码输出。',
    category: 'edit',
    isAvailable: true,
    iconName: 'RotateCw',
    acceptedFormats: 'image/*',
    features: ['90°/180°/270° 旋转', '水平/垂直镜像翻转', '批量角度修正']
  },
  {
    id: 'watermark',
    name: '添加水印',
    shortDesc: '添加文字或 Logo 图像水印，有效保护原创作品版权。',
    fullDesc: '在浏览器本地为图片叠加文字或 Logo 水印，支持九宫格锚点定位、透明度调节与斜向平铺模式，水印尺寸随图片宽度等比缩放。',
    category: 'edit',
    isAvailable: true,
    iconName: 'Stamp',
    acceptedFormats: 'image/*',
    features: ['文字与 Logo 图片水印', '九宫格锚点定位', '平铺模式与透明度调节', '批量打标']
  },
  {
    id: 'blur',
    name: '局部打码与遮盖',
    shortDesc: '在设备本地遮蔽敏感文字、面部人脸或隐私证件信息。',
    fullDesc: '框选需要隐去的矩形区域，以像素化马赛克或高斯模糊遮盖敏感信息，全程本地 Canvas 处理，分享截图更安心。',
    category: 'edit',
    isAvailable: true,
    iconName: 'EyeOff',
    acceptedFormats: 'image/*',
    features: ['矩形选区打码', '马赛克与高斯模糊双重效果', '遮盖强度无级微调', '100% 离线隐私安全']
  },
  {
    id: 'remove-bg',
    name: '智能抠图与去底',
    shortDesc: '使用本地 WebGPU/WASM 神经网络模型快速提取主体。',
    fullDesc: '自动识别人物、宠物或商品边缘抠图，全程在浏览器内存中完成推理，零数据上传。',
    category: 'advanced',
    isAvailable: false,
    badge: '即将上线',
    iconName: 'Wand2',
    acceptedFormats: 'image/*',
    features: ['零云端推理消耗', '透明背景 PNG 导出', '设备端离线神经网络']
  },
  {
    id: 'batch-rename',
    name: '批量批处理中心',
    shortDesc: '批量重命名、格式优化并规整成套图片资产。',
    fullDesc: '同时对数十张照片执行多道连续处理工序，一键下载规整结构清晰的压缩归档包。',
    category: 'advanced',
    isAvailable: false,
    badge: '即将上线',
    iconName: 'Layers',
    acceptedFormats: 'image/*',
    features: ['规则批量重命名', '多工序链式处理', 'ZIP 打包极速导出']
  }
];

export const zhCategories = [
  { id: 'all', name: '全部工具', desc: '纯浏览器本地全功能套件' },
  { id: 'essentials', name: '常用基础', desc: '压缩、转换、缩放与裁剪' },
  { id: 'edit', name: '编辑与保护', desc: '旋转、水印与隐私打码' },
  { id: 'advanced', name: '进阶处理', desc: 'AI 本地抠图与批量规整' }
];

export const zh = {
  // Navigation
  nav: {
    tools: '工具库',
    essentials: '常用基础',
    upcomingTools: '敬请期待',
    preview: '预览',
    about: '关于项目',
    privacy: '隐私架构',
    onDevice: '100% 本地运算',
    local: '本地',
    allTools: '全部工具',
    switchLang: '语言',
    versionBadge: 'v1.0',
    compressDesc: '保真减小体积，节省带宽',
    convertDesc: 'WebP、JPG、PNG 与 AVIF',
    roadmap: '规划中',
    toolActive: '使用中',
    privacyTooltip: '所有文件均在您浏览器沙箱本地处理，绝不上云'
  },

  // Theme
  theme: {
    label: '界面主题',
    light: '浅色',
    dark: '深色',
    system: '跟随系统',
    switchToLight: '切换至浅色模式',
    switchToDark: '切换至深色模式',
    switchToSystem: '跟随系统外观',
    systemActiveLight: '系统（当前浅色）',
    systemActiveDark: '系统（当前深色）'
  },

  // Hero section
  hero: {
    badgeProcessing: '100% 浏览器本地运算',
    badgeNoAccount: '无需注册登录',
    headline: '纯粹的图片工具。',
    headlineUnderline: '原生注重隐私。',
    subtitle: '直接在浏览器中压缩、转换和编辑图片。您的照片绝不离开您的设备。',
    openCompressor: '打开图片压缩',
    openConverter: '格式转换器',
    trySample: '载入示例图片体验',
    sampleTooltip: '立即载入一张高分辨率风光样张，无需翻找本地文件即可秒测压缩效果',
    zeroUploads: '零服务器上传',
    noDataStored: '不留存任何数据',
    noLogin: '无需注册与账号',
    runsInMemory: '纯本地内存运算'
  },

  // Tools grid
  grid: {
    title: '图像处理套件',
    subtitle: '选择工具开始处理。所有运算均在浏览器内存完成，零网络延迟与流量消耗。',
    searchPlaceholder: '搜索工具...',
    readyToUse: '即刻可用',
    inDevelopment: '开发中',
    openTool: '打开工具',
    allImages: '全部图像格式',
    noToolsFound: '未找到与“{query}”相符的工具。',
    resetFilters: '重置筛选'
  },

  // Tool workspace & Header
  workspace: {
    breadcrumbTools: '工具',
    filesLoaded: '已加载 {count} 个文件',
    fileSingle: '个文件',
    filesPlural: '个文件',
    clientSideNotice: '100% 客户端处理：',
    clientSideDesc: '您的图片绝不会上传至任何远端服务器。',
    totalOriginal: '原图总大小：',
    totalResult: '处理后总大小：',
    percentSmaller: '缩减了 {percent}%',
    clearAll: '清空列表',
    batchOperations: '批量操作',
    downloadZip: '一键打包下载全部 ({count}) 为 ZIP',
    generatingZip: '正在打包 ZIP...',
    archiveBuiltOnDevice: '压缩包在设备本地生成',
    readyCount: '{ready}/{total} 个已就绪'
  },

  // Upload Zone
  upload: {
    dragOver: '释放鼠标即可导入图片',
    defaultTitle: '拖拽图片至此处，或点击浏览文件',
    subText: '支持 PNG、JPG、WebP、AVIF 格式 • 单文件支持高达 50MB • 支持批量处理',
    selectBtn: '从本地设备选择图片',
    processedLocally: '纯浏览器本地运行，隐私无忧',
    pasteTip: '支持任意界面直接粘贴 (Ctrl+V)',
    sampleHeader: '暂无合适测试图片？可一键载入超清示例样图即刻体验：',
    generating: '正在生成...',
    sampleMountain: '高山湖泊 (1600×1000)',
    sampleSunset: '日落晚霞 (1600×1000)',
    compactDrop: '继续添加图片（拖拽或点击）'
  },

  // Compressor Settings
  compressor: {
    title: '压缩参数设置',
    badge: '浏览器 Canvas 引擎',
    qualityLabel: '图像压缩质量',
    presets: {
      maxSavings: '强力压缩',
      maxSavingsDesc: '文件体积最小',
      balanced: '均衡推荐',
      balancedDesc: '推荐默认画质',
      highFidelity: '极高保真',
      highFidelityDesc: '几乎无损画质'
    },
    outputFormat: '目标输出格式',
    formatKeep: '保持原格式',
    formatWebp: '转为 WebP',
    formatJpg: '转为 JPG',
    maxDimension: '最大分辨率 / 缩放限制',
    aspectRatioNote: '自动保持原始宽高比',
    dimOriginal: '原始尺寸不变',
    applyBtn: '将设置重新应用至全部图片'
  },

  // Converter Settings
  converter: {
    title: '目标格式转换',
    badge: '浏览器即时转换',
    selectFormatLabel: '选择导出格式',
    formats: {
      webp: {
        tag: '推荐',
        desc: '新一代现代网页标准，比 JPEG 节省 25-35% 且支持透明通道'
      },
      jpeg: {
        tag: '通用',
        desc: '兼容性最高，兼容所有设备、相机、操作系统与打印排版'
      },
      png: {
        tag: '无损',
        desc: '像素级无损清晰，完美保留透明通道，适合图表、文字与截图'
      },
      avif: {
        tag: '新一代',
        desc: '前沿高效压缩标准，现代主流浏览器超高画质压缩首选'
      }
    },
    qualityLabel: '压缩质量设定 ({format})',
    smallestSize: '最小体积 (20%)',
    balancedQuality: '均衡保真 (80%)',
    maxQuality: '最高质量 (100%)',
    pngLosslessNote: 'PNG 为无损格式：系统将以像素级完整度保留所有颜色及透明通道，不会出现有损压缩噪点。',
    convertAllBtn: '全部转换为 {format}'
  },

  // Rotator Settings
  rotator: {
    title: '旋转与翻转设置',
    badge: '浏览器 Canvas 引擎',
    angleLabel: '旋转角度（顺时针）',
    angles: {
      deg0: '0°',
      deg90: '90°',
      deg180: '180°',
      deg270: '270°'
    },
    flipLabel: '镜像翻转',
    flipHorizontal: '水平翻转',
    flipVertical: '垂直翻转',
    applyBtn: '将设置重新应用至全部图片'
  },

  // Resizer Settings
  resizer: {
    title: '尺寸调整设置',
    badge: '浏览器 Canvas 引擎',
    modeLabel: '缩放模式',
    modes: {
      pixels: '像素',
      percent: '百分比'
    },
    widthLabel: '宽度 (px)',
    heightLabel: '高度 (px)',
    lockAspect: '锁定宽高比',
    heightAuto: '按宽度自动计算',
    percentLabel: '缩放百分比',
    presetsLabel: '社媒常用尺寸预设',
    applyBtn: '将设置重新应用至全部图片'
  },

  // Watermarker Settings
  watermarker: {
    title: '水印设置',
    badge: '浏览器 Canvas 引擎',
    typeLabel: '水印类型',
    types: {
      text: '文字',
      logo: 'Logo'
    },
    textLabel: '水印文字',
    textPlaceholder: '请输入水印文字',
    colorLabel: '文字颜色',
    fontSizeLabel: '字号（相对图片宽度）',
    logoLabel: 'Logo 图片',
    logoPick: '选择本地图片',
    logoChange: '更换',
    logoClear: '移除 Logo',
    logoWidthLabel: 'Logo 宽度（相对图片宽度）',
    logoPrivacyNote: 'Logo 仅通过 FileReader 在本地读取，绝不离开您的设备。',
    positionLabel: '位置',
    positions: {
      topLeft: '左上',
      topCenter: '顶部居中',
      topRight: '右上',
      middleLeft: '左侧居中',
      middleCenter: '正中心',
      middleRight: '右侧居中',
      bottomLeft: '左下',
      bottomCenter: '底部居中',
      bottomRight: '右下'
    },
    marginLabel: '边距（相对图片宽度）',
    opacityLabel: '不透明度',
    tiledLabel: '平铺整张图片',
    tiledHint: '开启平铺后将忽略位置设置。',
    applyBtn: '将设置重新应用至全部图片'
  },

  // Cropper Settings
  cropper: {
    title: '裁剪设置',
    badge: '客户端 Canvas',
    aspectLabel: '宽高比',
    aspects: {
      free: '自由',
      ratio1x1: '1:1',
      ratio4x3: '4:3',
      ratio3x2: '3:2',
      ratio16x9: '16:9'
    },
    regionLabel: '裁剪选区',
    regionInfo: 'X {x}% · Y {y}% · 宽 {width}% · 高 {height}%',
    editRegionBtn: '可视化编辑选区',
    noFileHint: '请先添加图片，再编辑裁剪选区。',
    applyBtn: '将裁剪应用至全部图片'
  },

  // Redactor Settings
  redactor: {
    title: '打码遮盖设置',
    badge: '浏览器 Canvas 引擎',
    effectLabel: '遮盖效果',
    effects: {
      pixelate: '像素化马赛克',
      gaussian: '高斯模糊'
    },
    strengthLabel: '遮盖强度',
    regionsLabel: '打码区域',
    regionCount: '已定义 {count} 个打码区域',
    editRegionsBtn: '可视化编辑区域',
    noFileHint: '请先添加图片，再编辑打码区域。',
    clearRegionsBtn: '清除全部区域',
    applyBtn: '将打码应用至全部图片'
  },

  // Shared Region Editor
  regionEditor: {
    title: '编辑选区',
    sizeBadge: '{width} × {height} 像素',
    hint: '在图片上拖拽绘制选区，框内拖拽移动，拖动手柄缩放。',
    hintMulti: '在空白处拖拽新增打码区域，点击选中已有区域，框内拖拽移动，拖动手柄缩放。',
    countBadge: '{count} 个区域',
    deleteSelected: '删除选中区域',
    cancel: '取消',
    apply: '应用选区',
    applyRegions: '应用全部区域'
  },

  // File Item & List
  files: {
    loadedTitle: '已导入图片列表 ({count})',
    optimizedCount: '已处理 {completed} / {total} 张',
    processing: '浏览器正在处理...',
    done: '处理完成',
    smaller: '缩小了 {percent}%',
    originalQuality: '原始品质',
    compareTooltip: '对比优化前后画质',
    saveBtn: '下载',
    removeTooltip: '从列表中移除',
    failedToProcess: '处理失败'
  },
  fileItem: {
    done: '已完成',
    processingFailed: '处理失败',
    processingInBrowser: '浏览器本地运算中...',
    percentSmaller: '体积缩减 {percent}%',
    originalQuality: '原始画质',
    inspectTitle: '画质前后对比',
    downloadTitle: '下载此文件',
    saveBtn: '保存',
    removeTitle: '从列表中移除'
  },
  fileList: {
    loadedImages: '已导入图片 ({count})',
    optimizedCount: '已完成 {completed} / {total}'
  },

  // Comparison Modal
  modal: {
    title: '画质效果对比: {name}',
    smallerBadge: '体积缩减 {percent}%',
    processedBadge: '已处理',
    splitSlider: '分屏对比滑块',
    sideBySide: '左右并排对比',
    original: '原图',
    optimized: '优化后',
    savings: '体积缩减：',
    close: '关闭',
    downloadFile: '下载此单张文件',
    sliderAria: '图片画质对比滑动条'
  },
  comparison: {
    title: '画质效果对比: {name}',
    smallerBadge: '减小 {percent}%',
    processedBadge: '已处理',
    splitSlider: '分屏对比滑块',
    sideBySide: '左右并排对比',
    originalLabel: '原图 ({size})',
    optimizedLabel: '优化后 ({size})',
    originalTitle: '原图',
    optimizedTitle: '优化后',
    originalLabelShort: '原图',
    resultLabelShort: '优化后',
    processingText: '处理中...',
    savingsLabel: '体积节省',
    closeBtn: '关闭',
    downloadBtn: '下载'
  },

  // About Page
  about: {
    manifestoBadge: '产品理念宣言',
    title: '为什么开发 ImageKit？',
    subtitle: '每天，全球有数以百万计的用户将个人私照、财务发票、身份证件以及商业设计图上传到陌生的在线转换网站。我们打造 ImageKit，就是为了彻底改变这一切。',
    pillars: [
      {
        title: '1. 隐私第一，绝不上云',
        desc: '您的图片文件永远留在您的设备本地。所有的矩阵运算、压缩降噪和格式转码，完全在您浏览器的 HTML5 Canvas 与 Web API 沙箱内存中执行。'
      },
      {
        title: '2. 无需账号，即开即用',
        desc: '没有冗长的注册、密码输入、邮件验证，更没有暗藏的订阅扣费套路。打开网页，拖入图片，几秒处理完毕，随手关闭标签页即可。'
      },
      {
        title: '3. 充分发挥本地硬件算力',
        desc: '现代浏览器的运算能力已十分强悍。通过直接调度您设备的 GPU 与多核心 CPU，处理迅速完成，彻底免去网络上传下载的漫长等待。'
      },
      {
        title: '4. 简洁轻快，拒绝干扰',
        desc: '没有弹窗干扰、横幅广告、繁琐的 Cookie 授权弹窗，更没有任何虚假诱导下载按钮。呈现给您的是一个专为创意工作者打造的高性能纯净工具箱。'
      }
    ],
    tableTitle: 'ImageKit 与传统工具对比',
    tableHeaders: {
      feature: '对比维度',
      traditional: '传统在线图片网站',
      imagekit: 'ImageKit'
    },
    tableRows: [
      {
        feature: '服务器上传',
        traditional: '必须将图片上传至远端云服务器',
        imagekit: '0 字节上传，100% 设备本地处理'
      },
      {
        feature: '账号登录要求',
        traditional: '常强制要求注册，或限制试用次数',
        imagekit: '永远不需要注册与登录'
      },
      {
        feature: '文件大小限制',
        traditional: '非付费会员往往限制 5MB / 10MB',
        imagekit: '无上限（仅受您设备物理内存限制）'
      },
      {
        feature: '处理响应速度',
        traditional: '受制于网络宽带上传耗时及服务器排队',
        imagekit: '毫秒级本地直接渲染，即传即处理'
      },
      {
        feature: '离线离线可用性',
        traditional: '没有互联网连接便无法使用',
        imagekit: '完全支持离线甚至飞行模式下运行'
      }
    ],
    ctaTitle: '今天就感受全本地处理的极速与安全',
    ctaSubtitle: '立即体验在数秒内高保真压缩您的第一张照片。',
    ctaBtn: '打开图片压缩工具'
  },

  // Privacy Page
  privacy: {
    badge: '架构级隐私防护',
    title: '您的照片，只属于您的设备。',
    subtitle: '我们始终坚信，真正的隐私保护绝不是隐藏在密密麻麻法律条款里的免责声明，而应当直接深深植根于软件的技术架构设计中。',
    guarantees: [
      {
        title: '图像处理究竟在哪里执行？',
        desc: '图片压缩、格式转换与像素采样的每一个字节运算，全部在您设备本地浏览器的隔离内存堆中发生。我们采用现代浏览器原生 HTMLCanvasElement 与 canvas.toBlob API 以及客户端 Web API，无需任何后端服务参与。'
      },
      {
        title: '我的图片会被上传或存档吗？',
        desc: '绝不会。ImageKit 没有远端存储数据库、没有云端对象存储桶，更没有网络后门队列。当您把照片拖入时，浏览器仅仅在本地创建临时 blob: 内存引用指针。只要您刷新或关闭网页，该部分内存便立即被您本机的操作系统收回。'
      },
      {
        title: '你们会收集用户行为轨迹或埋点吗？',
        desc: '完全不收集。我们不植入任何第三方追踪 SDK、广告追踪像素代码或商业数据监控模块。无需绑定邮箱，无需接受 Cookie 追踪协议。'
      }
    ],
    evidence1Badge: '验证凭据 1：100% 源代码开源审计',
    evidence1Title: '代码完全开源，任何人均可审查每一行逻辑',
    evidence1Desc: '为了彻底打消用户对“云端上传图片”的疑虑，ImageKit 将全部前端源码完整开源。真正的隐私不是商业包装的空头承诺，而是每一行公开代码经得起全球开发者的独立审查。',
    evidence1Points: [
      {
        title: '零后端与云存储接口',
        desc: '代码库中不存在任何接收图片上传的服务器端点、对象存储（S3/OSS）SDK 或远程中转服务，彻底从物理上切断数据外泄通道。'
      },
      {
        title: '纯前端原生 API 实现',
        desc: '图像缩放、压缩与格式转码全部基于现代浏览器原生 HTMLCanvasElement 与 Web API，无任何混淆闭源二进制或黑盒追踪模块。'
      },
      {
        title: '支持自主构建与离线运行',
        desc: '您可以随时将仓库代码克隆到本地计算机，在完全切断互联网连接的状态下自主编译、运行，确保 100% 数据掌控权。'
      }
    ],
    evidence1Cta: '前往 GitHub 审查项目源码',
    evidence1CopyBtn: '复制指令',
    evidence1Copied: '已复制',
    evidence2Badge: '验证凭据 2：浏览器 DevTools 实时抓包',
    evidence2Title: '使用开发者工具亲眼确认零网络请求',
    evidence2Subtitle: '任何主流现代浏览器都内置了网络监视窗口，您可以在处理图片的同时实时抓包验证：',
    steps: [
      '在键盘上按下 F12（或在 Mac 上按下 Cmd + Option + I）打开浏览器开发者工具。',
      '切换至顶部的“网络”（Network）选项卡。',
      '将任意图片拖入 ImageKit 并调整压缩比例或目标格式。',
      '仔细观察网络面板：完全没有任何 POST、PUT 等图片文件上传请求。您甚至可以断开 Wi-Fi 或开启飞行模式，工具依然畅快运行！'
    ],
    ctaPrompt: '准备好毫无顾虑地处理您的照片了吗？',
    ctaBtn: '立即开始体验压缩'
  },

  // Footer
  footer: {
    tagline: '原生隐私优先的浏览器本地图像处理工具集。零上传、零云端存储、无需注册账号。您的每一张照片，都严守在您的设备本地。',
    brandDesc: '原生隐私优先的浏览器本地图像处理工具集。零上传、零云端存储、无需注册账号。您的每一张照片，都严守在您的设备本地。',
    zeroCloud: '零云端存储',
    noCookies: '无需 Cookie 或账号',
    nativeWeb: '纯原生 Web API',
    nativeApis: '纯原生 Web API',
    toolsHeader: '工具列表',
    toolsHeading: '工具列表',
    principlesHeader: '设计原则',
    principlesHeading: '设计原则',
    compressor: '图片压缩工具',
    converter: '格式转换器',
    resize: '尺寸缩放',
    crop: '自由裁剪',
    watermark: '水印与隐私打码',
    privacyArchitecture: '隐私架构细节',
    whyLocal: '为什么坚持本地运算？',
    verifyF12: '按 F12 自主验证流量',
    verifyDevTools: '按 F12 自主验证流量',
    openSource: '开源代码（GitHub）',
    soonBadge: '即将上线',
    soon: '即将上线',
    copyright: '© {year} ImageKit • 纯浏览器原生媒体处理套件',
    securityMotto: '隐私至上 • 零遥测监控 • 100% 客户端处理'
  }
};
