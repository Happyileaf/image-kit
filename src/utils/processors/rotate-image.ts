import { ProcessedFileItem, RotateOptions } from '../../types';
import { ProcessResult } from '../../modules/types';
import { RotateAngleEnum } from '../../constants/rotate-angle';
import {
  loadImageElement,
  createCanvas2D,
  fillWhiteBackground,
  canvasToBlob,
  getSavedPercentage,
} from '../canvas-utils';

/**
 * 旋转角度对应的弧度映射
 * Canvas 坐标系 Y 轴向下，正弧度即视觉上的顺时针旋转
 */
const ROTATE_RADIANS_MAP: Record<RotateAngleEnum, number> = {
  /** 不旋转 */
  [RotateAngleEnum.Deg0]: 0,
  /** 顺时针 90° */
  [RotateAngleEnum.Deg90]: Math.PI / 2,
  /** 顺时针 180° */
  [RotateAngleEnum.Deg180]: Math.PI,
  /** 顺时针 270° */
  [RotateAngleEnum.Deg270]: (Math.PI * 3) / 2,
};

/**
 * 有损输出格式固定使用的导出质量
 */
const ROTATE_OUTPUT_QUALITY = 0.92;

/**
 * 旋转输出时保留的原格式集合
 */
const ROTATE_KEPT_MIMES = ['image/jpeg', 'image/png', 'image/webp'];

/**
 * 解析旋转输出格式
 *
 * @description 原格式为 JPEG / PNG / WebP 时保持原格式输出，其余格式回退为 JPEG
 * @param originalType - 原始图片 MIME 类型
 * @returns 实际输出的 MIME 类型
 * @example
 * const outputMime = resolveRotateOutputMime('image/gif');
 * console.log(outputMime); // 'image/jpeg'
 */
function resolveRotateOutputMime(originalType: string): string {
  return ROTATE_KEPT_MIMES.includes(originalType) ? originalType : 'image/jpeg';
}

/**
 * 在浏览器本地旋转与翻转图片
 *
 * @description 基于 HTML5 Canvas 对图片做中心旋转变换与镜像翻转，全程不离开浏览器内存；
 * 90° / 270° 时输出宽高互换；变换顺序为平移至画布中心 → 旋转 → 翻转缩放 → 居中绘制，
 * 组合变换保证正确（如水平翻转叠加 180° 旋转等效于垂直翻转）；
 * 输出为 JPEG 前填充白色背景以消除透明黑底，有损格式以 0.92 质量重编码
 * @param item - 待处理的文件项
 * @param options - 旋转与翻转参数
 * @param options.angle - 顺时针旋转角度
 * @param options.flipHorizontal - 是否水平镜像翻转
 * @param options.flipVertical - 是否垂直镜像翻转
 * @returns 处理结果（含 Blob、预览地址、尺寸与体积信息）
 * @throws {Error} 图片加载失败或画布导出失败时抛出异常
 * @example
 * const result = await rotateImage(item, {
 *   angle: RotateAngleEnum.Deg90,
 *   flipHorizontal: false,
 *   flipVertical: false,
 * });
 * console.log(result.width, result.height);
 */
async function rotateImage(
  item: ProcessedFileItem,
  options: RotateOptions
): Promise<ProcessResult> {
  let img: HTMLImageElement;
  try {
    img = await loadImageElement(item.previewUrl);
  } catch {
    throw new Error('Failed to load image for rotation');
  }

  const sourceWidth = img.naturalWidth;
  const sourceHeight = img.naturalHeight;

  /** 是否为 90° / 270° 的直角旋转（输出宽高互换） */
  const isQuarterTurn =
    options.angle === RotateAngleEnum.Deg90 || options.angle === RotateAngleEnum.Deg270;
  const targetWidth = isQuarterTurn ? sourceHeight : sourceWidth;
  const targetHeight = isQuarterTurn ? sourceWidth : sourceHeight;

  const { canvas, ctx } = createCanvas2D(targetWidth, targetHeight);

  const outputMime = resolveRotateOutputMime(item.originalType);
  if (outputMime === 'image/jpeg') {
    fillWhiteBackground(ctx, targetWidth, targetHeight);
  }

  ctx.translate(targetWidth / 2, targetHeight / 2);
  ctx.rotate(ROTATE_RADIANS_MAP[options.angle]);
  ctx.scale(options.flipHorizontal ? -1 : 1, options.flipVertical ? -1 : 1);
  ctx.drawImage(img, -sourceWidth / 2, -sourceHeight / 2);

  const isLossyOutput = outputMime === 'image/jpeg' || outputMime === 'image/webp';
  const blob = await canvasToBlob(
    canvas,
    outputMime,
    isLossyOutput ? ROTATE_OUTPUT_QUALITY : undefined
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

export default rotateImage;
