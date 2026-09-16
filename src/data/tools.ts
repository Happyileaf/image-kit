import { ToolDefinition } from '../types';

export const TOOLS: ToolDefinition[] = [
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
    fullDesc: 'Apply local pixelation or Gaussian blur to redact private info before sharing screenshots.',
    category: 'edit',
    isAvailable: false,
    badge: 'Coming soon',
    iconName: 'EyeOff',
    acceptedFormats: 'image/*',
    features: ['Brush & rectangle redaction', 'Pixelate or blur effects', '100% offline safety']
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

export const CATEGORIES = [
  { id: 'all', name: 'All Tools', desc: 'Complete browser-native suite' },
  { id: 'essentials', name: 'Essentials', desc: 'Compress, convert, resize & crop' },
  { id: 'edit', name: 'Edit & Protect', desc: 'Rotate, watermark & redact' },
  { id: 'advanced', name: 'Advanced', desc: 'AI background removal & batch' }
];
