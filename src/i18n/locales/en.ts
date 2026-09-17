import { ToolDefinition } from '../../types';

export const enTools: ToolDefinition[] = [
  {
    id: 'compress',
    name: 'Image Compressor',
    shortDesc: 'Reduce image size while keeping good visual quality.',
    fullDesc: 'Intelligently compress JPG, PNG, and WebP images locally using browser canvas compression. Reduce file sizes up to 80% without noticeable degradation.',
    category: 'essentials',
    isAvailable: true,
    iconName: 'Minimize2',
    acceptedFormats: 'image/jpeg,image/png,image/webp',
    features: ['Custom quality slider', 'Instant side-by-side comparison', 'Batch compression', 'ZIP export']
  },
  {
    id: 'convert',
    name: 'Image Converter',
    shortDesc: 'Convert images between PNG, JPG, WebP, and AVIF formats.',
    fullDesc: 'Seamlessly convert between modern and standard image formats directly in your browser. Perfect for web optimization and legacy format support.',
    category: 'essentials',
    isAvailable: true,
    iconName: 'Repeat',
    acceptedFormats: 'image/jpeg,image/png,image/webp,image/avif',
    features: ['PNG, JPG, WebP & AVIF targets', 'Batch format conversion', 'Quality fine-tuning', 'Preserves transparency']
  },
  {
    id: 'resize',
    name: 'Resize Image',
    shortDesc: 'Resize images to exact dimensions or percentage.',
    fullDesc: 'Scale images to exact pixel dimensions or a percentage of the original, entirely in your browser. Multi-step downsampling keeps large reductions clean, with aspect-ratio lock and social media presets.',
    category: 'essentials',
    isAvailable: true,
    iconName: 'Maximize2',
    acceptedFormats: 'image/*',
    features: ['Pixel & percentage modes', 'Aspect ratio lock', 'Social media presets', 'Multi-step downsampling']
  },
  {
    id: 'crop',
    name: 'Crop Image',
    shortDesc: 'Crop images quickly in your browser with fixed aspect ratios.',
    fullDesc: 'Trim edges with a visual region editor, apply freeform or 1:1, 4:3, 3:2, 16:9 crop boxes, all rendered locally on canvas.',
    category: 'essentials',
    isAvailable: true,
    iconName: 'Crop',
    acceptedFormats: 'image/*',
    features: ['Visual region editor', 'Rule-of-thirds grid', 'Free & preset ratios', 'Batch cropping']
  },
  {
    id: 'rotate',
    name: 'Rotate & Flip',
    shortDesc: 'Rotate 90°/180°/270° or flip images horizontally and vertically.',
    fullDesc: 'Correct orientation issues or mirror images directly in the browser with high-quality local re-encoding.',
    category: 'edit',
    isAvailable: true,
    iconName: 'RotateCw',
    acceptedFormats: 'image/*',
    features: ['90°/180°/270° rotation', 'Horizontal / vertical flip', 'Batch angle correction']
  },
  {
    id: 'watermark',
    name: 'Watermark',
    shortDesc: 'Add text or logo image watermarks to protect your work.',
    fullDesc: 'Stamp text or logo watermarks with 9-anchor positioning, adjustable opacity, and an optional tiled mode — all rendered locally on canvas, sized relative to each image.',
    category: 'edit',
    isAvailable: true,
    iconName: 'Stamp',
    acceptedFormats: 'image/*',
    features: ['Text & logo watermarks', '9-anchor grid positioning', 'Tiled mode & opacity control', 'Batch stamping']
  },
  {
    id: 'blur',
    name: 'Blur & Redact',
    shortDesc: 'Obscure sensitive text, faces, or credentials on device.',
    fullDesc: 'Draw rectangle regions over sensitive info and obscure them with pixelation or Gaussian blur, processed entirely on local canvas before you share screenshots.',
    category: 'edit',
    isAvailable: true,
    iconName: 'EyeOff',
    acceptedFormats: 'image/*',
    features: ['Rectangle region redaction', 'Pixelate or Gaussian blur', 'Strength fine-tuning', '100% offline safety']
  },
  {
    id: 'remove-bg',
    name: 'Remove Background',
    shortDesc: 'Extract subjects using on-device WebGPU/WASM models.',
    fullDesc: 'Cut out people, products, and objects with automatic edge detection running completely in browser memory.',
    category: 'advanced',
    isAvailable: false,
    badge: 'Coming soon',
    iconName: 'Wand2',
    acceptedFormats: 'image/*',
    features: ['Zero cloud inference', 'Transparent PNG export', 'On-device neural model']
  },
  {
    id: 'batch-rename',
    name: 'Batch Processor',
    shortDesc: 'Bulk process, optimize, and organize image collections.',
    fullDesc: 'Apply multiple operations across dozens of images at once and download a clean structured archive.',
    category: 'advanced',
    isAvailable: false,
    badge: 'Coming soon',
    iconName: 'Layers',
    acceptedFormats: 'image/*',
    features: ['Sequential renaming', 'Chained operations', 'ZIP export']
  }
];

export const enCategories = [
  { id: 'all', name: 'All Tools', desc: 'Complete browser-native suite' },
  { id: 'essentials', name: 'Essentials', desc: 'Compress, convert, resize & crop' },
  { id: 'edit', name: 'Edit & Protect', desc: 'Rotate, watermark & redact' },
  { id: 'advanced', name: 'Advanced', desc: 'AI background removal & batch' }
];

export const en = {
  // Navigation
  nav: {
    tools: 'Tools',
    essentials: 'Essentials',
    upcomingTools: 'Upcoming Tools',
    preview: 'Preview',
    about: 'About',
    privacy: 'Privacy',
    onDevice: '100% On-Device',
    local: 'Local',
    allTools: 'All Tools',
    switchLang: 'Language',
    compressDesc: 'Reduce size without quality loss',
    convertDesc: 'WebP, JPG, PNG & AVIF',
    roadmap: 'Roadmap',
    toolActive: 'Active',
    privacyTooltip: 'All files are processed locally inside your browser'
  },

  // Theme
  theme: {
    label: 'Theme',
    light: 'Light',
    dark: 'Dark',
    system: 'System',
    switchToLight: 'Switch to Light Mode',
    switchToDark: 'Switch to Dark Mode',
    switchToSystem: 'Follow System Appearance',
    systemActiveLight: 'System (Light)',
    systemActiveDark: 'System (Dark)'
  },

  // Hero section
  hero: {
    badgeProcessing: '100% Browser-Based Processing',
    badgeNoAccount: 'No account required',
    headline: 'Simple image tools. ',
    headlineUnderline: 'Private by default.',
    subtitle: 'Compress, convert and edit images directly in your browser. Your files never leave your device.',
    openCompressor: 'Open Image Compressor',
    openConverter: 'Format Converter',
    trySample: 'Try with Sample Image',
    sampleTooltip: 'Load a high-res sample image to instantly test compression without looking for local files',
    zeroUploads: 'Zero server uploads',
    noDataStored: 'No data stored',
    noLogin: 'No login or signup',
    runsInMemory: 'Runs in memory'
  },

  // Tools grid
  grid: {
    title: 'Image Processing Suite',
    subtitle: 'Select a tool to begin. Processing runs in browser memory with zero network latency.',
    searchPlaceholder: 'Search tools...',
    readyToUse: 'Ready to use',
    inDevelopment: 'In Development',
    openTool: 'Open Tool',
    allImages: 'All Images',
    noToolsFound: 'No tools found matching "{query}".',
    resetFilters: 'Reset filters'
  },

  // Tool workspace & Header
  workspace: {
    breadcrumbTools: 'Tools',
    filesLoaded: '{count} {label} loaded',
    fileSingle: 'file',
    filesPlural: 'files',
    clientSideNotice: '100% Client-Side:',
    clientSideDesc: 'Your images never leave your browser.',
    totalOriginal: 'Total Original:',
    totalResult: 'Total Result:',
    percentSmaller: '{percent}% smaller',
    clearAll: 'Clear All',
    batchOperations: 'Batch Operations',
    downloadZip: 'Download All ({count}) as ZIP',
    generatingZip: 'Generating ZIP...',
    archiveBuiltOnDevice: 'Archive built on-device',
    readyCount: '{ready}/{total} ready'
  },

  // Upload Zone
  upload: {
    dragOver: 'Release to drop images',
    defaultTitle: 'Drop images here, or browse files',
    subText: 'Supports PNG, JPG, WebP, AVIF • Up to 50MB per file • Batch processing supported',
    selectBtn: 'Select Images from Device',
    processedLocally: 'Processed locally in your browser',
    pasteTip: 'Paste anywhere (Ctrl+V)',
    sampleHeader: "Don't have an image ready? Test with high-resolution sample photos:",
    generating: 'Generating...',
    sampleMountain: 'Alpine Lake (1600×1000)',
    sampleSunset: 'Sunset Gradient (1600×1000)',
    compactDrop: 'Add more images (drop or click)'
  },

  // Compressor Settings
  compressor: {
    title: 'Compression Settings',
    badge: 'Client-side Canvas',
    qualityLabel: 'Image Quality',
    presets: {
      maxSavings: 'Max Savings',
      maxSavingsDesc: 'Smallest file size',
      balanced: 'Balanced',
      balancedDesc: 'Recommended default',
      highFidelity: 'High Fidelity',
      highFidelityDesc: 'Near lossless visual'
    },
    outputFormat: 'Output Format',
    formatKeep: 'Keep Original',
    formatWebp: 'Convert to WebP',
    formatJpg: 'Convert to JPG',
    maxDimension: 'Max Resolution / Scale',
    aspectRatioNote: 'Maintains aspect ratio',
    dimOriginal: 'Original',
    applyBtn: 'Apply Changes to All Images'
  },

  // Converter Settings
  converter: {
    title: 'Target Format',
    badge: 'Instant In-Browser',
    selectFormatLabel: 'Select Output Format',
    formats: {
      webp: {
        tag: 'Recommended',
        desc: 'Modern web standard, 25-35% smaller than JPEG with alpha transparency'
      },
      jpeg: {
        tag: 'Universal',
        desc: 'High compatibility across all devices, cameras, and printers'
      },
      png: {
        tag: 'Lossless',
        desc: 'Crystal clear graphics, logos, and screenshots with full transparency'
      },
      avif: {
        tag: 'Next-Gen',
        desc: 'State-of-the-art compression efficiency for modern browsers'
      }
    },
    qualityLabel: 'Compression Quality ({format})',
    smallestSize: 'Smallest size (20%)',
    balancedQuality: 'Balanced (80%)',
    maxQuality: 'Max quality (100%)',
    pngLosslessNote: 'PNG is a lossless format: Full original clarity and alpha transparency will be preserved at pixel perfection.',
    convertAllBtn: 'Convert All to {format}'
  },

  // Rotator Settings
  rotator: {
    title: 'Rotate & Flip',
    badge: 'Client-side Canvas',
    angleLabel: 'Rotation Angle (clockwise)',
    angles: {
      deg0: '0°',
      deg90: '90°',
      deg180: '180°',
      deg270: '270°'
    },
    flipLabel: 'Flip',
    flipHorizontal: 'Horizontal',
    flipVertical: 'Vertical',
    applyBtn: 'Apply Changes to All Images'
  },

  // Resizer Settings
  resizer: {
    title: 'Resize Settings',
    badge: 'Client-side Canvas',
    modeLabel: 'Resize Mode',
    modes: {
      pixels: 'Pixels',
      percent: 'Percent'
    },
    widthLabel: 'Width (px)',
    heightLabel: 'Height (px)',
    lockAspect: 'Lock aspect ratio',
    heightAuto: 'Auto-calculated from width',
    percentLabel: 'Scale Percentage',
    presetsLabel: 'Social Media Presets',
    applyBtn: 'Apply Changes to All Images'
  },

  // Watermarker Settings
  watermarker: {
    title: 'Watermark Settings',
    badge: 'Client-side Canvas',
    typeLabel: 'Watermark Type',
    types: {
      text: 'Text',
      logo: 'Logo'
    },
    textLabel: 'Watermark Text',
    textPlaceholder: 'Enter watermark text',
    colorLabel: 'Text Color',
    fontSizeLabel: 'Font Size (of image width)',
    logoLabel: 'Logo Image',
    logoPick: 'Choose local image',
    logoChange: 'Change',
    logoClear: 'Remove logo',
    logoWidthLabel: 'Logo Width (of image width)',
    logoPrivacyNote: 'The logo is read locally via FileReader and never leaves your device.',
    positionLabel: 'Position',
    positions: {
      topLeft: 'Top left',
      topCenter: 'Top center',
      topRight: 'Top right',
      middleLeft: 'Middle left',
      middleCenter: 'Center',
      middleRight: 'Middle right',
      bottomLeft: 'Bottom left',
      bottomCenter: 'Bottom center',
      bottomRight: 'Bottom right'
    },
    marginLabel: 'Margin (of image width)',
    opacityLabel: 'Opacity',
    tiledLabel: 'Tile across entire image',
    tiledHint: 'Position is ignored while tiling is on.',
    applyBtn: 'Apply Changes to All Images'
  },

  // Cropper Settings
  cropper: {
    title: 'Crop Settings',
    badge: 'Client-side Canvas',
    aspectLabel: 'Aspect Ratio',
    aspects: {
      free: 'Free',
      ratio1x1: '1:1',
      ratio4x3: '4:3',
      ratio3x2: '3:2',
      ratio16x9: '16:9'
    },
    regionLabel: 'Crop Region',
    regionInfo: 'X {x}% · Y {y}% · W {width}% · H {height}%',
    editRegionBtn: 'Edit region visually',
    noFileHint: 'Add an image first to edit the crop region.',
    applyBtn: 'Apply Crop to All Images'
  },

  // Redactor Settings
  redactor: {
    title: 'Redact Settings',
    badge: 'Client-side Canvas',
    effectLabel: 'Redaction Effect',
    effects: {
      pixelate: 'Pixelate',
      gaussian: 'Gaussian Blur'
    },
    strengthLabel: 'Effect Strength',
    regionsLabel: 'Redaction Regions',
    regionCount: '{count} region(s) defined',
    editRegionsBtn: 'Edit regions visually',
    noFileHint: 'Add an image first to edit redaction regions.',
    clearRegionsBtn: 'Clear all regions',
    applyBtn: 'Apply Redaction to All Images'
  },

  // Shared Region Editor
  regionEditor: {
    title: 'Edit Region',
    sizeBadge: '{width} × {height} px',
    hint: 'Drag on the image to draw a region, drag inside to move, use handles to resize.',
    hintMulti: 'Drag on empty areas to add regions, click a region to select it, drag inside to move, use handles to resize.',
    countBadge: '{count} region(s)',
    deleteSelected: 'Delete selected region',
    cancel: 'Cancel',
    apply: 'Apply Region',
    applyRegions: 'Apply Regions'
  },

  // File Item & List
  files: {
    loadedTitle: 'Loaded Images ({count})',
    optimizedCount: '{completed} of {total} optimized',
    processing: 'Processing in browser...',
    done: 'Done',
    smaller: '-{percent}% smaller',
    originalQuality: 'Original quality',
    compareTooltip: 'Compare Before & After',
    saveBtn: 'Save',
    removeTooltip: 'Remove from list',
    failedToProcess: 'Failed to process'
  },
  fileItem: {
    done: 'Done',
    processingFailed: 'Failed to process',
    processingInBrowser: 'Processing in browser...',
    percentSmaller: '-{percent}% smaller',
    originalQuality: 'Original quality',
    inspectTitle: 'Compare Before & After',
    downloadTitle: 'Download file',
    saveBtn: 'Save',
    removeTitle: 'Remove from list'
  },
  fileList: {
    loadedImages: 'Loaded Images ({count})',
    optimizedCount: '{completed} of {total} optimized'
  },

  // Comparison Modal
  modal: {
    title: 'Quality Comparison: {name}',
    smallerBadge: '{percent}% smaller',
    processedBadge: 'Processed',
    splitSlider: 'Split Slider',
    sideBySide: 'Side by Side',
    original: 'Original',
    optimized: 'Optimized',
    savings: 'Savings:',
    close: 'Close',
    downloadFile: 'Download File',
    sliderAria: 'Comparison slider'
  },
  comparison: {
    title: 'Quality Comparison: {name}',
    smallerBadge: '-{percent}% smaller',
    processedBadge: 'Processed',
    splitSlider: 'Split Slider',
    sideBySide: 'Side by Side',
    originalLabel: 'Original ({size})',
    optimizedLabel: 'Optimized ({size})',
    originalTitle: 'Original',
    optimizedTitle: 'Optimized',
    originalLabelShort: 'Original',
    resultLabelShort: 'Optimized',
    processingText: 'Processing...',
    savingsLabel: 'Savings',
    closeBtn: 'Close',
    downloadBtn: 'Download'
  },

  // About Page
  about: {
    manifestoBadge: 'Product Manifesto',
    title: 'Why ImageKit?',
    subtitle: 'Every day, millions of people upload personal photos, receipts, ID cards, and proprietary graphics to random online conversion websites. We built ImageKit simply to offer a more privacy-respecting alternative for image processing.',
    pillars: [
      {
        title: '1. Privacy First',
        desc: 'Your images never leave your device. All calculations, compression transforms, and format conversions take place inside your browser’s sandbox memory via HTML5 Canvas and Web APIs.'
      },
      {
        title: '2. No Account Needed',
        desc: 'No signups, passwords, email verification, or subscription paywalls. Open the website, drop your photos, optimize them, and close the tab when you are done.'
      },
      {
        title: '3. Native Browser Compute',
        desc: 'Modern browsers are extraordinarily powerful. By leveraging your own device’s GPU and multi-core CPU, processing happens instantly with zero network upload latency.'
      },
      {
        title: '4. Fast & Simple',
        desc: 'No intrusive ads, popups, cookie consent banners, or fake download buttons. Just a clean, high-performance workspace designed for creative workflows.'
      }
    ],
    tableTitle: 'How ImageKit Compares',
    tableHeaders: {
      feature: 'Feature',
      traditional: 'Traditional Online Tools',
      imagekit: 'ImageKit'
    },
    tableRows: [
      {
        feature: 'Server Uploads',
        traditional: 'Uploads all photos to remote cloud',
        imagekit: 'Zero bytes sent to server (100% Local)'
      },
      {
        feature: 'Login & Registration',
        traditional: 'Required or frequent prompts',
        imagekit: 'Never required'
      },
      {
        feature: 'File Size Limitations',
        traditional: 'Strict 5MB / 10MB limits unless paid',
        imagekit: 'Unlimited (bound only by device RAM)'
      },
      {
        feature: 'Processing Speed',
        traditional: 'Delayed by network upload & cloud queue',
        imagekit: 'Instant native execution'
      },
      {
        feature: 'Offline Usability',
        traditional: 'Fails without internet connection',
        imagekit: 'Works completely offline'
      }
    ],
    ctaTitle: 'Experience the difference today',
    ctaSubtitle: 'Try compressing an image right now in seconds.',
    ctaBtn: 'Open Image Compressor'
  },

  // Privacy Page
  privacy: {
    badge: 'Privacy by Architecture',
    title: 'Your images stay on your device.',
    subtitle: 'We believe privacy should not be a promise hidden in legal fine print. It should be built directly into the software architecture.',
    guarantees: [
      {
        title: 'Where does image processing happen?',
        desc: 'Every byte of image compression and format conversion occurs entirely inside your browser’s isolated memory heap. We use modern browser canvas interfaces (HTMLCanvasElement and canvas.toBlob) alongside client-side Web APIs.'
      },
      {
        title: 'Are images ever uploaded or stored?',
        desc: 'Never. There is no backend image storage, no Amazon S3 bucket, no Cloudinary pipeline, and no remote server queue. When you drag a photo into ImageKit, the browser creates a local blob: reference. When you close or refresh the tab, that memory is automatically reclaimed by your operating system.'
      },
      {
        title: 'Do you track user activity or analytics?',
        desc: 'No. We do not use third-party user tracking scripts, advertising pixels, or analytics trackers. You do not need to register, provide an email address, or consent to cookie profiles.'
      }
    ],
    evidence1Badge: 'Evidence 1: 100% Open-Source Audit',
    evidence1Title: 'Fully open source — anyone can audit every line of logic',
    evidence1Desc: 'To eliminate any doubt about images being secretly uploaded to the cloud, ImageKit open-sources its entire front-end codebase. Real privacy is not a marketing promise — it is public code that stands up to independent review by developers worldwide.',
    evidence1Points: [
      {
        title: 'Zero Backend & Cloud Storage Interfaces',
        desc: 'The codebase contains no server endpoint that receives image uploads, no object-storage (S3/OSS) SDK, and no remote relay service — physically cutting off every data exfiltration channel.'
      },
      {
        title: 'Pure Front-End Native APIs',
        desc: 'Image scaling, compression and format transcoding are built entirely on native browser HTMLCanvasElement and Web APIs — no obfuscated closed-source binaries or black-box tracking modules.'
      },
      {
        title: 'Self-Buildable & Offline-Capable',
        desc: 'Clone the repository to your own machine at any time, then build and run it with the internet connection completely cut off — keeping 100% control over your data.'
      }
    ],
    evidence1Cta: 'Audit the Source on GitHub',
    evidence1CopyBtn: 'Copy Command',
    evidence1Copied: 'Copied',
    evidence2Badge: 'Evidence 2: Live Capture in Browser DevTools',
    evidence2Title: 'See zero network requests with your own eyes',
    evidence2Subtitle: 'Every modern browser ships with a built-in network monitor, so you can capture packets in real time while processing images:',
    steps: [
      'Open Developer Tools by pressing F12 (or Cmd + Option + I on macOS).',
      'Switch to the Network tab in DevTools.',
      'Drop an image into ImageKit and adjust compression or format settings.',
      'Notice that zero upload (POST/PUT) requests appear in the Network tab. You can even disconnect your Wi-Fi or turn on Airplane Mode and the tools continue working seamlessly!'
    ],
    ctaPrompt: 'Ready to test with complete peace of mind?',
    ctaBtn: 'Start Compressing'
  },

  // Footer
  footer: {
    tagline: 'A private-by-default image toolkit designed to run 100% locally in your browser. No uploads, no servers, no accounts. Your photos stay strictly on your device.',
    brandDesc: 'A private-by-default image toolkit designed to run 100% locally in your browser. No uploads, no servers, no accounts. Your photos stay strictly on your device.',
    zeroCloud: 'Zero Cloud Storage',
    noCookies: 'No Cookies or Login',
    nativeWeb: 'Native Web APIs',
    nativeApis: 'Native Web APIs',
    toolsHeader: 'Tools',
    toolsHeading: 'Tools',
    principlesHeader: 'Principles',
    principlesHeading: 'Principles',
    compressor: 'Image Compressor',
    converter: 'Format Converter',
    resize: 'Resize Image',
    crop: 'Crop Image',
    watermark: 'Watermark & Redact',
    privacyArchitecture: 'Privacy Architecture',
    whyLocal: 'Why Local Processing?',
    verifyF12: 'Verify in DevTools (F12)',
    verifyDevTools: 'Verify in DevTools (F12)',
    openSource: 'Open Source (GitHub)',
    soonBadge: 'Soon',
    soon: 'Soon',
    copyright: '© {year} ImageKit. Open prototype for browser-native media processing.',
    securityMotto: 'Privacy First • Zero Telemetry • 100% Client-Side'
  }
};
