import { BlurOptions, NormalizedRect, ProcessedFileItem } from '../../types';
import { BlurEffectEnum } from '../../constants/blur-effect';
import { ProcessResult } from '../../modules/types';
import {
  loadImageElement,
  createCanvas2D,
  fillWhiteBackground,
  canvasToBlob,
  getSavedPercentage,
} from '../canvas-utils';

/**
 * 打码输出时保留的原格式集合
 */
const BLUR_KEPT_MIMES = ['image/jpeg', 'image/png', 'image/webp'];

/**
 * 有损格式的固定导出质量
 * 打码属于重编码场景，固定 0.92 在画质与体积间取得稳定平衡
 */
const LOSSY_OUTPUT_QUALITY = 0.92;

/**
 * 打码区域的最小像素尺寸
 * 避免归一化选区换算后产生 0 像素的非法画布
 */
const MIN_REGION_PIXEL_SIZE = 1;

/**
 * 像素化块大小相对区域短边的最大占比
 * strength 为 100 时块大小等于区域短边的 10%
 */
const PIXELATE_BLOCK_MAX_RATIO = 0.1;

/**
 * 高斯模糊半径相对区域短边的最大占比
 * strength 为 100 时半径等于区域短边的 5%
 */
const GAUSSIAN_RADIUS_MAX_RATIO = 0.05;

/**
 * 像素化块大小下限（像素）
 */
const MIN_PIXELATE_BLOCK_SIZE = 2;

/**
 * 高斯模糊半径下限（像素）
 */
const MIN_GAUSSIAN_RADIUS = 1;

/**
 * 像素打码区域接口
 * 描述在原始图片像素坐标系下的打码矩形
 */
interface PixelRegionRect {
  /** 打码区域左上角横坐标（像素） */
  sx: number;
  /** 打码区域左上角纵坐标（像素） */
  sy: number;
  /** 打码区域宽度（像素） */
  width: number;
  /** 打码区域高度（像素） */
  height: number;
}

/**
 * 解析打码输出格式
 *
 * @description 原格式为 JPEG / PNG / WebP 时保持原格式输出，其余格式回退为 JPEG
 * @param originalType - 原始图片 MIME 类型
 * @returns 实际输出的 MIME 类型
 * @example
 * const outputMime = resolveBlurOutputMime('image/gif');
 * console.log(outputMime); // 'image/jpeg'
 */
function resolveBlurOutputMime(originalType: string): string {
  return BLUR_KEPT_MIMES.includes(originalType) ? originalType : 'image/jpeg';
}

/**
 * 将归一化选区换算为像素打码区域
 *
 * @description 归一化坐标先按图片原始宽高放大，再四向 clamp 到图片范围内，
 * 宽高下限 1 像素，保证任意输入都能得到合法的非空打码矩形
 * @param region - 0 到 1 归一化选区
 * @param sourceWidth - 原始图片宽度（像素）
 * @param sourceHeight - 原始图片高度（像素）
 * @returns 像素坐标系下的打码区域
 * @example
 * const rect = resolvePixelRegionRect({ x: 0.1, y: 0.1, width: 0.5, height: 0.5 }, 1920, 1080);
 */
function resolvePixelRegionRect(
  region: NormalizedRect,
  sourceWidth: number,
  sourceHeight: number
): PixelRegionRect {
  /** 宽高 clamp 到 0 到 1 后换算为像素，下限 1 像素 */
  const width = Math.max(
    MIN_REGION_PIXEL_SIZE,
    Math.round(Math.min(1, Math.max(0, region.width)) * sourceWidth)
  );
  const height = Math.max(
    MIN_REGION_PIXEL_SIZE,
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
 * 计算像素化块大小
 *
 * @description 块大小随强度线性增长，上限为区域短边的 10%，下限 2 像素；
 * 相对区域尺寸取值，保证不同尺寸图片的同相对位置选区获得一致的视觉遮盖强度
 * @param strength - 遮盖强度（1 到 100）
 * @param regionWidth - 打码区域宽度（像素）
 * @param regionHeight - 打码区域高度（像素）
 * @returns 像素化块边长（像素）
 * @example
 * const blockSize = resolvePixelateBlockSize(50, 200, 100);
 * console.log(blockSize); // 5
 */
function resolvePixelateBlockSize(strength: number, regionWidth: number, regionHeight: number): number {
  const minSide = Math.min(regionWidth, regionHeight);
  return Math.max(
    MIN_PIXELATE_BLOCK_SIZE,
    Math.round((strength / 100) * PIXELATE_BLOCK_MAX_RATIO * minSide)
  );
}

/**
 * 计算高斯模糊半径
 *
 * @description 半径随强度线性增长，上限为区域短边的 5%，下限 1 像素；
 * 相对区域尺寸取值，保证不同尺寸图片的同相对位置选区获得一致的视觉遮盖强度
 * @param strength - 遮盖强度（1 到 100）
 * @param regionWidth - 打码区域宽度（像素）
 * @param regionHeight - 打码区域高度（像素）
 * @returns 高斯模糊半径（像素）
 * @example
 * const radius = resolveGaussianRadius(50, 200, 100);
 * console.log(radius); // 3
 */
function resolveGaussianRadius(strength: number, regionWidth: number, regionHeight: number): number {
  const minSide = Math.min(regionWidth, regionHeight);
  return Math.max(
    MIN_GAUSSIAN_RADIUS,
    Math.round((strength / 100) * GAUSSIAN_RADIUS_MAX_RATIO * minSide)
  );
}

/**
 * 对区域画布施加像素化（马赛克）
 *
 * @description 将区域先缩小到按块大小折算的微型画布，再关闭图像平滑放大回原尺寸，
 * 形成硬边马赛克方块；全浏览器兼容，处理后恢复图像平滑开关
 * @param extract - 提取出的区域画布及其 2D 上下文
 * @param width - 区域宽度（像素）
 * @param height - 区域高度（像素）
 * @param blockSize - 像素化块边长（像素）
 * @returns 无返回值
 * @example
 * applyPixelateEffect(extract, 200, 100, 10);
 */
function applyPixelateEffect(
  extract: { canvas: HTMLCanvasElement; ctx: CanvasRenderingContext2D },
  width: number,
  height: number,
  blockSize: number
): void {
  const tinyWidth = Math.max(1, Math.round(width / blockSize));
  const tinyHeight = Math.max(1, Math.round(height / blockSize));
  const tiny = createCanvas2D(tinyWidth, tinyHeight);
  tiny.ctx.imageSmoothingEnabled = false;
  tiny.ctx.drawImage(extract.canvas, 0, 0, width, height, 0, 0, tinyWidth, tinyHeight);

  extract.ctx.imageSmoothingEnabled = false;
  extract.ctx.clearRect(0, 0, width, height);
  extract.ctx.drawImage(tiny.canvas, 0, 0, tinyWidth, tinyHeight, 0, 0, width, height);
  extract.ctx.imageSmoothingEnabled = true;
}

/**
 * 对区域画布施加高斯模糊
 *
 * @description 基于 Canvas 2D 的 ctx.filter 施加柔化遮盖；设置后读回 filter 做能力检测，
 * 浏览器不回填 blur 值视为不支持并返回 false，由调用方降级为像素化；使用后复位为 'none'
 * @param extract - 提取出的区域画布及其 2D 上下文
 * @param width - 区域宽度（像素）
 * @param height - 区域高度（像素）
 * @param radius - 高斯模糊半径（像素）
 * @returns 滤镜是否生效，false 表示浏览器不支持 ctx.filter
 * @example
 * const applied = applyGaussianBlurEffect(extract, 200, 100, 5);
 */
function applyGaussianBlurEffect(
  extract: { canvas: HTMLCanvasElement; ctx: CanvasRenderingContext2D },
  width: number,
  height: number,
  radius: number
): boolean {
  const filtered = createCanvas2D(width, height);
  filtered.ctx.filter = `blur(${radius}px)`;
  /** 读回检测：不支持 ctx.filter 的浏览器赋值后读回仍为 'none' */
  const isFilterSupported = filtered.ctx.filter.includes('blur(');
  if (!isFilterSupported) {
    filtered.ctx.filter = 'none';
    return false;
  }

  filtered.ctx.drawImage(extract.canvas, 0, 0);
  filtered.ctx.filter = 'none';
  extract.ctx.clearRect(0, 0, width, height);
  extract.ctx.drawImage(filtered.canvas, 0, 0);
  return true;
}

/**
 * 在浏览器本地对图片区域打码遮盖
 *
 * @description 基于 HTML5 Canvas 逐区域处理：先将区域像素提取到临时画布，
 * 再按所选效果（像素化 / 高斯模糊）遮盖，最后绘制回主画布原位置，全程不离开浏览器内存；
 * 选区以 0 到 1 归一化坐标描述，相对每张图片自身宽高换算，保证批量不同尺寸图片的相对位置一致；
 * 遮盖强度相对区域短边映射为像素值，保证视觉效果与图片尺寸无关；
 * 高斯模糊依赖 ctx.filter，不支持的浏览器自动降级为像素化，不报错；
 * regions 为空数组时不做任何遮盖处理，直接按原格式重编码输出；
 * 输出保持原格式（JPEG / PNG / WebP，其余回退 JPEG），输出为 JPEG 前填充白色背景，
 * 有损格式按固定 0.92 质量导出
 * @param item - 待处理的文件项
 * @param options - 打码参数
 * @param options.effect - 应用于每个区域的遮盖效果
 * @param options.strength - 遮盖强度（1 到 100），相对区域尺寸映射为像素值
 * @param options.regions - 归一化打码选区数组，空数组表示不遮盖直接导出
 * @returns 处理结果（含 Blob、预览地址、尺寸与体积信息）
 * @throws {Error} 图片加载失败或画布导出失败时抛出异常
 * @example
 * const result = await blurImage(item, {
 *   effect: BlurEffectEnum.Pixelate,
 *   strength: 50,
 *   regions: [{ x: 0.1, y: 0.1, width: 0.3, height: 0.2 }],
 * });
 * console.log(result.width, result.height);
 */
async function blurImage(item: ProcessedFileItem, options: BlurOptions): Promise<ProcessResult> {
  let img: HTMLImageElement;
  try {
    img = await loadImageElement(item.previewUrl);
  } catch {
    throw new Error('Failed to load image for blurring');
  }

  const sourceWidth = img.naturalWidth;
  const sourceHeight = img.naturalHeight;
  const { canvas, ctx } = createCanvas2D(sourceWidth, sourceHeight);

  const outputMime = resolveBlurOutputMime(item.originalType);
  if (outputMime === 'image/jpeg') {
    fillWhiteBackground(ctx, sourceWidth, sourceHeight);
  }

  ctx.drawImage(img, 0, 0);

  for (const region of options.regions) {
    const rect = resolvePixelRegionRect(region, sourceWidth, sourceHeight);
    const extract = createCanvas2D(rect.width, rect.height);
    extract.ctx.drawImage(
      canvas,
      rect.sx,
      rect.sy,
      rect.width,
      rect.height,
      0,
      0,
      rect.width,
      rect.height
    );

    if (options.effect === BlurEffectEnum.Gaussian) {
      const radius = resolveGaussianRadius(options.strength, rect.width, rect.height);
      const applied = applyGaussianBlurEffect(extract, rect.width, rect.height, radius);
      if (!applied) {
        const blockSize = resolvePixelateBlockSize(options.strength, rect.width, rect.height);
        applyPixelateEffect(extract, rect.width, rect.height, blockSize);
      }
    } else {
      const blockSize = resolvePixelateBlockSize(options.strength, rect.width, rect.height);
      applyPixelateEffect(extract, rect.width, rect.height, blockSize);
    }

    ctx.drawImage(extract.canvas, rect.sx, rect.sy);
  }

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
    width: sourceWidth,
    height: sourceHeight,
    savedPercentage,
    format: outputMime,
  };
}

export default blurImage;
