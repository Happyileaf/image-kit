import JSZip from 'jszip';
import { CompressOptions, ConvertOptions, ProcessedFileItem, TargetFormat } from '../types';
import {
  loadImageElement,
  createCanvas2D,
  fillWhiteBackground,
  canvasToBlob,
  resolveCompressOutputMime,
  getSavedPercentage,
} from './canvas-utils';

/**
 * Format bytes to readable string (e.g. 1.2 MB, 450 KB)
 */
export function formatBytes(bytes: number, decimals = 1): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}

/**
 * Reads an image File and returns image dimensions and object URL
 */
export function readImageFile(file: File): Promise<{
  previewUrl: string;
  width: number;
  height: number;
}> {
  return new Promise((resolve, reject) => {
    const previewUrl = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      resolve({
        previewUrl,
        width: img.naturalWidth || img.width,
        height: img.naturalHeight || img.height,
      });
    };
    img.onerror = () => {
      URL.revokeObjectURL(previewUrl);
      reject(new Error('Failed to decode image file.'));
    };
    img.src = previewUrl;
  });
}

/**
 * Compress an image in the browser via HTML5 Canvas
 */
export async function compressImage(
  item: ProcessedFileItem,
  options: CompressOptions
): Promise<{
  blob: Blob;
  url: string;
  size: number;
  width: number;
  height: number;
  savedPercentage: number;
  format: string;
}> {
  let img: HTMLImageElement;
  try {
    img = await loadImageElement(item.previewUrl);
  } catch {
    throw new Error('Failed to load image for compression');
  }

  let targetWidth = img.naturalWidth;
  let targetHeight = img.naturalHeight;

  if (options.maxWidthOrHeight > 0) {
    if (targetWidth > options.maxWidthOrHeight || targetHeight > options.maxWidthOrHeight) {
      if (targetWidth > targetHeight) {
        targetHeight = Math.round((targetHeight * options.maxWidthOrHeight) / targetWidth);
        targetWidth = options.maxWidthOrHeight;
      } else {
        targetWidth = Math.round((targetWidth * options.maxWidthOrHeight) / targetHeight);
        targetHeight = options.maxWidthOrHeight;
      }
    }
  }

  const { canvas, ctx } = createCanvas2D(targetWidth, targetHeight);

  // If output format is JPEG and image has transparency, paint white background
  const outputMime = resolveCompressOutputMime(item.originalType, options.format);
  if (outputMime === 'image/jpeg') {
    fillWhiteBackground(ctx, targetWidth, targetHeight);
  }

  ctx.drawImage(img, 0, 0, targetWidth, targetHeight);

  const qualityRatio = Math.max(0.05, Math.min(1, options.quality / 100));

  const blob = await canvasToBlob(canvas, outputMime, qualityRatio);
  const newSize = blob.size;
  const savedPercentage = getSavedPercentage(item.originalSize, newSize);
  const resultUrl = URL.createObjectURL(blob);

  return {
    blob,
    url: resultUrl,
    size: newSize,
    width: targetWidth,
    height: targetHeight,
    savedPercentage,
    format: outputMime,
  };
}

/**
 * Convert an image format in the browser via HTML5 Canvas
 */
export async function convertImage(
  item: ProcessedFileItem,
  options: ConvertOptions
): Promise<{
  blob: Blob;
  url: string;
  size: number;
  width: number;
  height: number;
  savedPercentage: number;
  format: string;
}> {
  let img: HTMLImageElement;
  try {
    img = await loadImageElement(item.previewUrl);
  } catch {
    throw new Error('Failed to load image for conversion');
  }

  const targetWidth = img.naturalWidth;
  const targetHeight = img.naturalHeight;

  const { canvas, ctx } = createCanvas2D(targetWidth, targetHeight);

  // If converting to JPEG, fill white background to prevent black alpha
  if (options.targetFormat === 'image/jpeg') {
    fillWhiteBackground(ctx, targetWidth, targetHeight);
  }

  ctx.drawImage(img, 0, 0, targetWidth, targetHeight);

  const qualityRatio = Math.max(0.1, Math.min(1, options.quality / 100));

  // canvasToBlob falls back to WebP for formats not natively supported by the browser (e.g. avif in older browsers)
  let blob: Blob;
  try {
    blob = await canvasToBlob(canvas, options.targetFormat, qualityRatio);
  } catch {
    throw new Error('Format conversion failed');
  }

  const outputFormat =
    options.targetFormat !== 'image/webp' && blob.type === 'image/webp'
      ? 'image/webp'
      : options.targetFormat;

  const newSize = blob.size;
  const savedPercentage = getSavedPercentage(item.originalSize, newSize);
  const resultUrl = URL.createObjectURL(blob);

  return {
    blob,
    url: resultUrl,
    size: newSize,
    width: targetWidth,
    height: targetHeight,
    savedPercentage,
    format: outputFormat,
  };
}

/**
 * Trigger download of a single processed image file
 */
export function downloadFile(item: ProcessedFileItem, extensionSuffix = ''): void {
  if (!item.resultUrl || !item.resultBlob) return;

  const originalBaseName = item.name.substring(0, item.name.lastIndexOf('.')) || item.name;
  let ext = 'jpg';
  if (item.resultType === 'image/webp') ext = 'webp';
  else if (item.resultType === 'image/png') ext = 'png';
  else if (item.resultType === 'image/avif') ext = 'avif';
  else if (item.resultType === 'image/jpeg') ext = 'jpg';
  else {
    const parts = item.name.split('.');
    ext = parts.length > 1 ? parts[parts.length - 1] : 'jpg';
  }

  const filename = `${originalBaseName}${extensionSuffix ? '-' + extensionSuffix : ''}.${ext}`;
  const a = document.createElement('a');
  a.href = item.resultUrl;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

/**
 * Batch download all completed images as a ZIP archive
 */
export async function downloadAllAsZip(
  items: ProcessedFileItem[],
  zipName = 'processed-images.zip'
): Promise<void> {
  const completed = items.filter((it) => it.status === 'done' && it.resultBlob);
  if (completed.length === 0) return;

  const zip = new JSZip();

  completed.forEach((item, index) => {
    const originalBaseName = item.name.substring(0, item.name.lastIndexOf('.')) || item.name;
    let ext = 'jpg';
    if (item.resultType === 'image/webp') ext = 'webp';
    else if (item.resultType === 'image/png') ext = 'png';
    else if (item.resultType === 'image/avif') ext = 'avif';
    else if (item.resultType === 'image/jpeg') ext = 'jpg';

    const filename = `${originalBaseName}-optimized-${index + 1}.${ext}`;
    if (item.resultBlob) {
      zip.file(filename, item.resultBlob);
    }
  });

  const content = await zip.generateAsync({ type: 'blob' });
  const url = URL.createObjectURL(content);
  const a = document.createElement('a');
  a.href = url;
  a.download = zipName;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

/**
 * Generates high quality built-in photographic sample files for testing without local images
 */
export function createSamplePhoto(theme: 'mountain' | 'architecture' | 'sunset' = 'mountain'): Promise<File> {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas');
    canvas.width = 1600;
    canvas.height = 1000;
    const ctx = canvas.getContext('2d')!;

    if (theme === 'mountain') {
      // Sky gradient
      const sky = ctx.createLinearGradient(0, 0, 0, 600);
      sky.addColorStop(0, '#1E3A8A');
      sky.addColorStop(0.5, '#3B82F6');
      sky.addColorStop(1, '#93C5FD');
      ctx.fillStyle = sky;
      ctx.fillRect(0, 0, 1600, 1000);

      // Sun
      ctx.beginPath();
      ctx.arc(1200, 240, 90, 0, Math.PI * 2);
      ctx.fillStyle = '#FDE047';
      ctx.shadowColor = 'rgba(253, 224, 71, 0.6)';
      ctx.shadowBlur = 40;
      ctx.fill();
      ctx.shadowBlur = 0;

      // Far mountain peaks
      ctx.fillStyle = '#475569';
      ctx.beginPath();
      ctx.moveTo(100, 600);
      ctx.lineTo(400, 250);
      ctx.lineTo(750, 600);
      ctx.closePath();
      ctx.fill();

      // Snow cap
      ctx.fillStyle = '#F8FAFC';
      ctx.beginPath();
      ctx.moveTo(350, 320);
      ctx.lineTo(400, 250);
      ctx.lineTo(460, 330);
      ctx.lineTo(410, 310);
      ctx.closePath();
      ctx.fill();

      // Front mountain
      ctx.fillStyle = '#1E293B';
      ctx.beginPath();
      ctx.moveTo(450, 700);
      ctx.lineTo(850, 300);
      ctx.lineTo(1300, 700);
      ctx.closePath();
      ctx.fill();

      // Snow cap front
      ctx.fillStyle = '#F1F5F9';
      ctx.beginPath();
      ctx.moveTo(780, 380);
      ctx.lineTo(850, 300);
      ctx.lineTo(940, 400);
      ctx.lineTo(870, 370);
      ctx.closePath();
      ctx.fill();

      // Lake reflection
      const water = ctx.createLinearGradient(0, 600, 0, 1000);
      water.addColorStop(0, '#0F172A');
      water.addColorStop(1, '#1E293B');
      ctx.fillStyle = water;
      ctx.fillRect(0, 600, 1600, 400);

      // Add gentle water ripples
      ctx.strokeStyle = 'rgba(147, 197, 253, 0.2)';
      ctx.lineWidth = 3;
      for (let y = 640; y < 980; y += 24) {
        ctx.beginPath();
        ctx.moveTo(100, y);
        ctx.bezierCurveTo(400, y - 8, 800, y + 8, 1500, y);
        ctx.stroke();
      }

      // Title stamp in bottom corner
      ctx.font = '600 24px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto';
      ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
      ctx.fillText('Sample Alpine Lake 4K (Local Test Asset)', 60, 930);
    } else {
      // Sunset theme
      const grad = ctx.createLinearGradient(0, 0, 0, 1000);
      grad.addColorStop(0, '#4C1D95');
      grad.addColorStop(0.3, '#BE185D');
      grad.addColorStop(0.7, '#F97316');
      grad.addColorStop(1, '#FDE047');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 1600, 1000);

      ctx.beginPath();
      ctx.arc(800, 500, 180, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(254, 240, 138, 0.9)';
      ctx.fill();

      ctx.fillStyle = '#0F172A';
      ctx.fillRect(0, 750, 1600, 250);

      ctx.font = '600 24px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto';
      ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
      ctx.fillText('Sample Golden Sunset (Local Test Asset)', 60, 930);
    }

    canvas.toBlob(
      (blob) => {
        if (!blob) return;
        const file = new File([blob], `${theme}-sample-highres.jpg`, { type: 'image/jpeg' });
        resolve(file);
      },
      'image/jpeg',
      0.95
    );
  });
}
