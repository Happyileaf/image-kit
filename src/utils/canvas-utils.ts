import { CompressOptions } from '../types';

/**
 * 加载图片元素
 *
 * @description 根据图片地址异步加载并返回 HTMLImageElement，加载失败时抛出异常
 * @param url - 图片地址（Object URL 或远程 URL）
 * @returns 加载完成的图片元素
 * @throws {Error} 图片解码或加载失败时抛出异常
 * @example
 * const img = await loadImageElement(previewUrl);
 * console.log(img.naturalWidth, img.naturalHeight);
 */
export function loadImageElement(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error('Failed to load image'));
    img.src = url;
  });
}

/**
 * 创建 2D 画布
 *
 * @description 创建指定尺寸的离屏 Canvas 并获取 2D 渲染上下文，获取失败时抛出异常
 * @param width - 画布宽度（像素）
 * @param height - 画布高度（像素）
 * @returns 包含画布元素与 2D 渲染上下文的对象
 * @throws {Error} 无法获取 2D 渲染上下文时抛出异常
 * @example
 * const { canvas, ctx } = createCanvas2D(800, 600);
 * ctx.drawImage(img, 0, 0);
 */
export function createCanvas2D(
  width: number,
  height: number
): { canvas: HTMLCanvasElement; ctx: CanvasRenderingContext2D } {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    throw new Error('Failed to acquire canvas 2D rendering context');
  }

  return { canvas, ctx };
}

/**
 * 填充白色背景
 *
 * @description 在画布上填充纯白背景，用于 JPEG 输出前消除透明区域产生的黑底
 * @param ctx - 2D 渲染上下文
 * @param width - 填充宽度（像素）
 * @param height - 填充高度（像素）
 * @returns 无返回值
 * @example
 * fillWhiteBackground(ctx, canvas.width, canvas.height);
 */
export function fillWhiteBackground(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number
): void {
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(0, 0, width, height);
}

/**
 * 画布转换为 Blob
 *
 * @description 将画布内容按指定格式导出为 Blob；当目标格式不受浏览器支持时自动降级为 WebP，仍失败则抛出异常
 * @param canvas - 待导出的画布元素
 * @param mime - 目标 MIME 类型，如 'image/webp'
 * @param quality - 导出质量（0 到 1，仅对有损格式生效）
 * @returns 导出的图片 Blob
 * @throws {Error} 目标格式与降级格式均导出失败时抛出异常
 * @example
 * const blob = await canvasToBlob(canvas, 'image/avif', 0.8);
 */
export function canvasToBlob(
  canvas: HTMLCanvasElement,
  mime: string,
  quality?: number
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) {
          resolve(blob);
          return;
        }

        // Fallback for formats not natively supported by browser canvas toBlob (e.g. avif in older browsers)
        canvas.toBlob(
          (fallbackBlob) => {
            if (!fallbackBlob) {
              reject(new Error('Canvas toBlob conversion failed'));
              return;
            }
            resolve(fallbackBlob);
          },
          'image/webp',
          quality
        );
      },
      mime,
      quality
    );
  });
}

/**
 * 解析压缩输出格式
 *
 * @description 根据原始图片格式与用户选择的格式选项，推导压缩后的实际输出 MIME 类型；保留原格式时若原格式不受支持则回退为 JPEG
 * @param originalType - 原始图片 MIME 类型
 * @param formatOption - 用户选择的格式选项（'keep' 表示保留原格式）
 * @returns 实际输出的 MIME 类型
 * @example
 * const outputMime = resolveCompressOutputMime('image/png', 'keep');
 */
export function resolveCompressOutputMime(
  originalType: string,
  formatOption: CompressOptions['format']
): string {
  let outputMime = originalType || 'image/jpeg';
  if (formatOption !== 'keep') {
    outputMime = formatOption;
  } else if (!['image/jpeg', 'image/webp', 'image/png'].includes(outputMime)) {
    outputMime = 'image/jpeg';
  }
  return outputMime;
}

/**
 * 计算节省百分比
 *
 * @description 根据处理前后文件体积计算体积节省的百分比（四舍五入取整）
 * @param originalSize - 处理前文件体积（字节）
 * @param newSize - 处理后文件体积（字节）
 * @returns 节省百分比（0 到 100 的整数，可能为负数表示体积增大）
 * @example
 * const saved = getSavedPercentage(1000, 600);
 * console.log(saved); // 40
 */
export function getSavedPercentage(originalSize: number, newSize: number): number {
  return Math.round(((originalSize - newSize) / originalSize) * 100);
}
