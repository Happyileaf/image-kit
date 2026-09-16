import { CropOptions, NormalizedRect, ProcessedFileItem } from '../../types';
import { ProcessResult } from '../../modules/types';
import {
  loadImageElement,
  createCanvas2D,
  fillWhiteBackground,
  canvasToBlob,
  getSavedPercentage,
} from '../canvas-utils';

/**
 * 裁剪输出时保留的原格式集合
 */
const CROP_KEPT_MIMES = ['image/jpeg', 'image/png', 'image/webp'];

/**
 * 有损格式的固定导出质量
 * 裁剪属于重编码场景，固定 0.92 在画质与体积间取得稳定平衡
 */
const LOSSY_OUTPUT_QUALITY = 0.92;

/**
 * 裁剪源区域的最小像素尺寸
 * 避免归一化选区换算后产生 0 像素的非法画布
 */
const MIN_CROP_PIXEL_SIZE = 1;

/**
 * 像素裁剪区域接口
 * 描述在原始图片像素坐标系下的裁剪矩形
 */
interface PixelCropRect {
  /** 裁剪区域左上角横坐标（像素） */
  sx: number;
  /** 裁剪区域左上角纵坐标（像素） */
  sy: number;
  /** 裁剪区域宽度（像素） */
  width: number;
  /** 裁剪区域高度（像素） */
  height: number;
}

/**
 * 解析裁剪输出格式
 *
 * @description 原格式为 JPEG / PNG / WebP 时保持原格式输出，其余格式回退为 JPEG
 * @param originalType - 原始图片 MIME 类型
 * @returns 实际输出的 MIME 类型
 * @example
 * const outputMime = resolveCropOutputMime('image/gif');
 * console.log(outputMime); // 'image/jpeg'
 */
function resolveCropOutputMime(originalType: string): string {
  return CROP_KEPT_MIMES.includes(originalType) ? originalType : 'image/jpeg';
}

/**
 * 将归一化选区换算为像素裁剪区域
 *
 * @description 归一化坐标先按图片原始宽高放大，再四向 clamp 到图片范围内，
 * 宽高下限 1 像素，保证任意输入都能得到合法的非空裁剪矩形
 * @param region - 0 到 1 归一化选区
 * @param sourceWidth - 原始图片宽度（像素）
 * @param sourceHeight - 原始图片高度（像素）
 * @returns 像素坐标系下的裁剪区域
 * @example
 * const rect = resolvePixelCropRect({ x: 0.1, y: 0.1, width: 0.5, height: 0.5 }, 1920, 1080);
 */
function resolvePixelCropRect(
  region: NormalizedRect,
  sourceWidth: number,
  sourceHeight: number
): PixelCropRect {
  /** 宽高 clamp 到 0 到 1 后换算为像素，下限 1 像素 */
  const width = Math.max(
    MIN_CROP_PIXEL_SIZE,
    Math.round(Math.min(1, Math.max(0, region.width)) * sourceWidth)
  );
  const height = Math.max(
    MIN_CROP_PIXEL_SIZE,
    Math.round(Math.min(1, Math.max(0, region.height)) * sourceHeight)
  );

  /** 左上角 clamp 到图片范围内，并为宽高留出空间 */
  const sx = Math.min(
    sourceWidth - width,
    Math.max(0, Math.round(Math.min(1, Math.max(0, region.x)) * sourceWidth))
  );
  const sy = Math.min(
    sourceHeight - height,
    Math.max(0, Math.round(Math.min(1, Math.max(0, region.y)) * sourceHeight))
  );

  return { sx, sy, width, height };
}

/**
 * 在浏览器本地裁剪图片
 *
 * @description 基于 HTML5 Canvas 的 9 参数 drawImage 从原图截取选区内容，全程不离开浏览器内存；
 * 选区以 0 到 1 归一化坐标描述，相对每张图片自身宽高换算，保证批量不同尺寸图片时裁剪的相对位置一致；
 * 输出保持原格式（JPEG / PNG / WebP，其余回退 JPEG），输出为 JPEG 前填充白色背景，
 * 有损格式按固定 0.92 质量导出
 * @param item - 待处理的文件项
 * @param options - 裁剪参数
 * @param options.region - 归一化裁剪选区，裁剪的唯一事实来源
 * @param options.aspect - 宽高比约束（仅作为编辑器交互约束，处理器不消费）
 * @returns 处理结果（含 Blob、预览地址、尺寸与体积信息）
 * @throws {Error} 图片加载失败或画布导出失败时抛出异常
 * @example
 * const result = await cropImage(item, {
 *   region: { x: 0.1, y: 0.1, width: 0.8, height: 0.8 },
 *   aspect: CropAspectEnum.Free,
 * });
 * console.log(result.width, result.height);
 */
async function cropImage(item: ProcessedFileItem, options: CropOptions): Promise<ProcessResult> {
  let img: HTMLImageElement;
  try {
    img = await loadImageElement(item.previewUrl);
  } catch {
    throw new Error('Failed to load image for cropping');
  }

  const sourceWidth = img.naturalWidth;
  const sourceHeight = img.naturalHeight;
  const cropRect = resolvePixelCropRect(options.region, sourceWidth, sourceHeight);

  const { canvas, ctx } = createCanvas2D(cropRect.width, cropRect.height);

  const outputMime = resolveCropOutputMime(item.originalType);
  if (outputMime === 'image/jpeg') {
    fillWhiteBackground(ctx, cropRect.width, cropRect.height);
  }

  ctx.drawImage(
    img,
    cropRect.sx,
    cropRect.sy,
    cropRect.width,
    cropRect.height,
    0,
    0,
    cropRect.width,
    cropRect.height
  );

  const isLossyOutput = outputMime === 'image/jpeg' || outputMime === 'image/webp';
  const blob = await canvasToBlob(
    canvas,
    outputMime,
    isLossyOutput ? LOSSY_OUTPUT_QUALITY : undefined
  );

  const newSize = blob.size;
  const savedPercentage = getSavedPercentage(item.originalSize, newSize);
  const resultUrl = URL.createObjectURL(blob);

  return {
    blob,
    url: resultUrl,
    size: newSize,
    width: cropRect.width,
    height: cropRect.height,
    savedPercentage,
    format: outputMime,
  };
}

export default cropImage;
