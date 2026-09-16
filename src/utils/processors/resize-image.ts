import { ProcessedFileItem, ResizeOptions } from '../../types';
import { ProcessResult } from '../../modules/types';
import { ResizeModeEnum } from '../../constants/resize-mode';
import {
  loadImageElement,
  createCanvas2D,
  fillWhiteBackground,
  canvasToBlob,
  getSavedPercentage,
} from '../canvas-utils';

/**
 * 尺寸调整输出时保留的原格式集合
 */
const RESIZE_KEPT_MIMES = ['image/jpeg', 'image/png', 'image/webp'];

/**
 * 目标宽高的最小像素值
 */
const MIN_DIMENSION = 1;

/**
 * 百分比模式下允许的最小缩放百分比
 */
const MIN_PERCENT = 10;

/**
 * 百分比模式下允许的最大缩放百分比
 */
const MAX_PERCENT = 200;

/**
 * 触发多步降采样的缩放倍数阈值
 * 目标尺寸小于原尺寸一半（缩放倍数大于 2）时启用
 */
const DOWNSAMPLE_STEP_THRESHOLD = 2;

/**
 * 将尺寸数值约束为合法像素值
 *
 * @description 对输入取整并保证不小于最小像素值，避免非法画布尺寸
 * @param value - 待约束的尺寸数值
 * @returns 不小于 1 的整数像素值
 * @example
 * const width = clampDimension(0.4);
 * console.log(width); // 1
 */
function clampDimension(value: number): number {
  return Math.max(MIN_DIMENSION, Math.round(value));
}

/**
 * 解析尺寸调整输出格式
 *
 * @description 原格式为 JPEG / PNG / WebP 时保持原格式输出，其余格式回退为 JPEG
 * @param originalType - 原始图片 MIME 类型
 * @returns 实际输出的 MIME 类型
 * @example
 * const outputMime = resolveResizeOutputMime('image/gif');
 * console.log(outputMime); // 'image/jpeg'
 */
function resolveResizeOutputMime(originalType: string): string {
  return RESIZE_KEPT_MIMES.includes(originalType) ? originalType : 'image/jpeg';
}

/**
 * 计算目标输出尺寸
 *
 * @description 像素模式下直接取目标宽高（锁定宽高比时以宽度为驱动，按原图宽高比推导高度，
 * 保证批量处理不同尺寸图片时语义一致；未锁定时按精确宽高输出，允许变形）；
 * 百分比模式下按缩放百分比等比缩放原图宽高，百分比约束在 10 到 200 之间
 * @param sourceWidth - 原图宽度（像素）
 * @param sourceHeight - 原图高度（像素）
 * @param options - 尺寸调整参数
 * @param options.mode - 尺寸调整模式（像素 / 百分比）
 * @param options.width - 目标宽度（像素模式）
 * @param options.height - 目标高度（像素模式且未锁定宽高比时生效）
 * @param options.percent - 缩放百分比（百分比模式）
 * @param options.lockAspect - 是否锁定宽高比
 * @returns 目标宽度与高度（均为不小于 1 的整数像素值）
 * @example
 * const size = resolveTargetSize(4000, 3000, options);
 * console.log(size.width, size.height);
 */
function resolveTargetSize(
  sourceWidth: number,
  sourceHeight: number,
  options: ResizeOptions
): { width: number; height: number } {
  if (options.mode === ResizeModeEnum.Percent) {
    /** 约束在允许区间内的缩放百分比 */
    const safePercent = Math.min(MAX_PERCENT, Math.max(MIN_PERCENT, options.percent));
    const scale = safePercent / 100;
    return {
      width: clampDimension(sourceWidth * scale),
      height: clampDimension(sourceHeight * scale),
    };
  }

  const targetWidth = clampDimension(options.width);
  if (options.lockAspect) {
    /** 原图宽高比，用于按目标宽度推导目标高度 */
    const sourceAspect = sourceWidth / sourceHeight;
    return { width: targetWidth, height: clampDimension(targetWidth / sourceAspect) };
  }

  return { width: targetWidth, height: clampDimension(options.height) };
}

/**
 * 在浏览器本地调整图片尺寸
 *
 * @description 基于 HTML5 Canvas 对图片做像素或百分比缩放，全程不离开浏览器内存；
 * 当缩放倍数大于 2 时采用多步降采样（每次减半，直至落入 2 倍以内再一步到目标尺寸），
 * 保证大幅缩小时输出无明显锯齿；放大场景由 Canvas 平滑插值直接完成；
 * 输出保持原格式（JPEG / PNG / WebP，其余回退 JPEG），输出为 JPEG 前填充白色背景，
 * 有损格式按用户设定质量导出
 * @param item - 待处理的文件项
 * @param options - 尺寸调整参数
 * @param options.mode - 尺寸调整模式（像素 / 百分比）
 * @param options.width - 目标宽度（像素模式）
 * @param options.height - 目标高度（像素模式且未锁定宽高比时生效）
 * @param options.percent - 缩放百分比（百分比模式，10 到 200）
 * @param options.lockAspect - 是否锁定宽高比
 * @param options.quality - 有损格式导出质量（1 到 100）
 * @returns 处理结果（含 Blob、预览地址、尺寸与体积信息）
 * @throws {Error} 图片加载失败或画布导出失败时抛出异常
 * @example
 * const result = await resizeImage(item, {
 *   mode: ResizeModeEnum.Percent,
 *   width: 1920,
 *   height: 1080,
 *   percent: 50,
 *   lockAspect: true,
 *   quality: 90,
 * });
 * console.log(result.width, result.height);
 */
async function resizeImage(
  item: ProcessedFileItem,
  options: ResizeOptions
): Promise<ProcessResult> {
  let img: HTMLImageElement;
  try {
    img = await loadImageElement(item.previewUrl);
  } catch {
    throw new Error('Failed to load image for resizing');
  }

  const sourceWidth = img.naturalWidth;
  const sourceHeight = img.naturalHeight;
  const { width: targetWidth, height: targetHeight } = resolveTargetSize(
    sourceWidth,
    sourceHeight,
    options
  );

  /** 当前降采样来源（原图或上一步的减半画布） */
  let stepSource: HTMLImageElement | HTMLCanvasElement = img;
  /** 当前降采样来源的宽度（像素） */
  let currentWidth = sourceWidth;
  /** 当前降采样来源的高度（像素） */
  let currentHeight = sourceHeight;

  while (
    currentWidth / DOWNSAMPLE_STEP_THRESHOLD >= targetWidth &&
    currentHeight / DOWNSAMPLE_STEP_THRESHOLD >= targetHeight
  ) {
    const stepWidth = Math.round(currentWidth / DOWNSAMPLE_STEP_THRESHOLD);
    const stepHeight = Math.round(currentHeight / DOWNSAMPLE_STEP_THRESHOLD);
    const { canvas: stepCanvas, ctx: stepCtx } = createCanvas2D(stepWidth, stepHeight);
    stepCtx.imageSmoothingEnabled = true;
    stepCtx.imageSmoothingQuality = 'high';
    stepCtx.drawImage(stepSource, 0, 0, stepWidth, stepHeight);
    stepSource = stepCanvas;
    currentWidth = stepWidth;
    currentHeight = stepHeight;
  }

  const { canvas, ctx } = createCanvas2D(targetWidth, targetHeight);

  const outputMime = resolveResizeOutputMime(item.originalType);
  if (outputMime === 'image/jpeg') {
    fillWhiteBackground(ctx, targetWidth, targetHeight);
  }

  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';
  ctx.drawImage(stepSource, 0, 0, targetWidth, targetHeight);

  const isLossyOutput = outputMime === 'image/jpeg' || outputMime === 'image/webp';
  /** 约束在 1 到 100 后换算为 0 到 1 的导出质量 */
  const outputQuality = Math.min(100, Math.max(1, options.quality)) / 100;
  const blob = await canvasToBlob(
    canvas,
    outputMime,
    isLossyOutput ? outputQuality : undefined
  );

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

export default resizeImage;
