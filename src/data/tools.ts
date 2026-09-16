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
    fullDesc: 'Scale images to custom pixel dimensions, standard aspect ratios, or percentage scaling with bicubic interpolation.',
    category: 'essentials',
    isAvailable: false,
    badge: 'Coming soon',
    iconName: 'Maximize2',
    acceptedFormats: 'image/*',
    features: ['Maintain aspect ratio', 'Social media presets', 'Pixel & % modes']
  },
  {
    id: 'crop',
    name: 'Crop Image',
    shortDesc: 'Crop images quickly in your browser with fixed aspect ratios.',
    fullDesc: 'Trim edges, apply 1:1, 16:9, or 4:3 crop boxes, or freeform crop any image on device.',
    category: 'essentials',
    isAvailable: false,
    badge: 'Coming soon',
    iconName: 'Crop',
    acceptedFormats: 'image/*',
    features: ['Visual bounding box', 'Golden ratio & rule-of-thirds grid', 'Preset ratios']
  },
  {
    id: 'rotate',
    name: 'Rotate & Flip',
    shortDesc: 'Rotate 90°/180° or flip images horizontally and vertically.',
    fullDesc: 'Correct orientation issues or mirror images with zero quality loss directly in the browser.',
    category: 'edit',
    isAvailable: false,
    badge: 'Coming soon',
    iconName: 'RotateCw',
    acceptedFormats: 'image/*',
    features: ['Lossless rotation', 'Horizontal / vertical flip', 'Batch angle correction']
  },
  {
    id: 'watermark',
    name: 'Watermark',
    shortDesc: 'Add text or logo image watermarks to protect your work.',
    fullDesc: 'Stamp copyright notices, subtle logos, or repeated tile watermarks with custom opacity and positioning.',
    category: 'edit',
    isAvailable: false,
    badge: 'Coming soon',
    iconName: 'Stamp',
    acceptedFormats: 'image/*',
    features: ['Text & image logo overlay', 'Opacity & tile controls', 'Batch stamping']
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
