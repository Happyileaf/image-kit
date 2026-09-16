import { ProcessedFileItem, WatermarkOptions } from '../../types';
import { ProcessResult } from '../../modules/types';
import { WatermarkTypeEnum } from '../../constants/watermark-type';
import { WatermarkPositionEnum } from '../../constants/watermark-position';
import {
  loadImageElement,
  createCanvas2D,
  fillWhiteBackground,
  canvasToBlob,
  getSavedPercentage,
} from '../canvas-utils';

/**
 * 水印输出时保留的原格式集合
 */
const WATERMARK_KEPT_MIMES = ['image/jpeg', 'image/png', 'image/webp'];

/**
 * 有损格式的固定导出质量
 * 水印属于重编码场景，固定 0.92 在画质与体积间取得稳定平衡
 */
const LOSSY_OUTPUT_QUALITY = 0.92;

/**
 * 文字水印使用的系统无衬线字体栈
 * 覆盖 macOS / Windows / Linux 及常见中文环境，避免依赖外部字体资源
 */
const SYSTEM_FONT_STACK =
  '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", sans-serif';

/**
 * 平铺模式下每个水印的旋转角度（弧度）
 * 经典斜向水印，取 -30°
 */
const TILE_ROTATION_RADIAN = (-30 * Math.PI) / 180;

/**
 * 平铺模式下水印网格间距相对水印包围盒的倍数
 */
const TILE_SPACING_FACTOR = 2.5;

/**
 * 水印包围盒接口
 * 统一描述文字或 Logo 水印在目标图片上的实际占用尺寸
 */
interface WatermarkBoundingBox {
  /** 包围盒宽度（像素） */
  width: number;
  /** 包围盒高度（像素） */
  height: number;
}

/**
 * 水印绘制载荷接口
 * 封装单个水印的包围盒与绘制动作，供锚点定位与平铺两种模式复用
 */
interface WatermarkPayload {
  /** 水印包围盒尺寸 */
  box: WatermarkBoundingBox;
  /** 以包围盒左上角为基准的水印绘制动作 */
  drawAt: (x: number, y: number) => void;
}

/**
 * 解析水印输出格式
 *
 * @description 原格式为 JPEG / PNG / WebP 时保持原格式输出，其余格式回退为 JPEG
 * @param originalType - 原始图片 MIME 类型
 * @returns 实际输出的 MIME 类型
 * @example
 * const outputMime = resolveWatermarkOutputMime('image/gif');
 * console.log(outputMime); // 'image/jpeg'
 */
function resolveWatermarkOutputMime(originalType: string): string {
  return WATERMARK_KEPT_MIMES.includes(originalType) ? originalType : 'image/jpeg';
}

/**
 * 计算九宫格锚点定位
 *
 * @description 以水印包围盒左上角为基准，按九宫格锚点语义计算水印在画布上的落点；
 * 角落锚点沿两个方向各留出边距，边中锚点居中于另一轴，中心锚点双向居中
 * @param position - 九宫格锚点位置
 * @param canvasWidth - 画布宽度（像素）
 * @param canvasHeight - 画布高度（像素）
 * @param box - 水印包围盒尺寸
 * @param margin - 锚定边距（像素）
 * @returns 水印包围盒左上角的画布坐标
 * @example
 * const point = resolveAnchorPosition(WatermarkPositionEnum.BottomRight, 800, 600, { width: 120, height: 40 }, 24);
 * console.log(point.x, point.y);
 */
function resolveAnchorPosition(
  position: WatermarkPositionEnum,
  canvasWidth: number,
  canvasHeight: number,
  box: WatermarkBoundingBox,
  margin: number
): { x: number; y: number } {
  switch (position) {
    case WatermarkPositionEnum.TopLeft:
      return { x: margin, y: margin };
    case WatermarkPositionEnum.TopCenter:
      return { x: (canvasWidth - box.width) / 2, y: margin };
    case WatermarkPositionEnum.TopRight:
      return { x: canvasWidth - box.width - margin, y: margin };
    case WatermarkPositionEnum.MiddleLeft:
      return { x: margin, y: (canvasHeight - box.height) / 2 };
    case WatermarkPositionEnum.MiddleCenter:
      return { x: (canvasWidth - box.width) / 2, y: (canvasHeight - box.height) / 2 };
    case WatermarkPositionEnum.MiddleRight:
      return { x: canvasWidth - box.width - margin, y: (canvasHeight - box.height) / 2 };
    case WatermarkPositionEnum.BottomLeft:
      return { x: margin, y: canvasHeight - box.height - margin };
    case WatermarkPositionEnum.BottomCenter:
      return { x: (canvasWidth - box.width) / 2, y: canvasHeight - box.height - margin };
    case WatermarkPositionEnum.BottomRight:
      return { x: canvasWidth - box.width - margin, y: canvasHeight - box.height - margin };
  }
}

/**
 * 构建文字水印绘制载荷
 *
 * @description 字号按图片宽度等比缩放，通过 measureText 测量文字宽度、以字号估算文字高度得到包围盒；
 * 绘制时统一使用左对齐与顶部基线，使包围盒与绘制原点语义一致
 * @param ctx - 2D 渲染上下文
 * @param imageWidth - 目标图片宽度（像素）
 * @param options - 水印参数
 * @param options.text - 水印文字内容
 * @param options.color - 文字颜色
 * @param options.fontSizeRatio - 字号相对图片宽度的比例
 * @returns 文字水印绘制载荷；文字为空白时返回 null
 * @example
 * const payload = buildTextPayload(ctx, 1920, options);
 */
function buildTextPayload(
  ctx: CanvasRenderingContext2D,
  imageWidth: number,
  options: WatermarkOptions
): WatermarkPayload | null {
  /** 去除首尾空白后的有效水印文字 */
  const safeText = options.text.trim();
  if (!safeText) {
    return null;
  }

  /** 字号下限 1 像素，避免极小比例产生非法字号 */
  const fontSize = Math.max(1, Math.round(options.fontSizeRatio * imageWidth));
  ctx.font = `${fontSize}px ${SYSTEM_FONT_STACK}`;
  ctx.fillStyle = options.color;
  ctx.textAlign = 'left';
  ctx.textBaseline = 'top';

  /** 以 measureText 实测宽度、字号估算高度得到的文字包围盒 */
  const box: WatermarkBoundingBox = {
    width: ctx.measureText(safeText).width,
    height: fontSize,
  };

  return {
    box,
    drawAt: (x: number, y: number) => {
      ctx.fillText(safeText, x, y);
    },
  };
}

/**
 * 构建 Logo 水印绘制载荷
 *
 * @description Logo 从本地读取的 Data URL 加载，宽度按图片宽度等比缩放，高度按 Logo 原始宽高比推导；
 * logoDataUrl 为空或 Logo 解码失败时返回 null，此时水印处理退化为直接输出原图，
 * 保证批量任务不因单个无效 Logo 而中断
 * @param ctx - 2D 渲染上下文
 * @param imageWidth - 目标图片宽度（像素）
 * @param options - 水印参数
 * @param options.logoDataUrl - 本地读取的 Logo 图片 Data URL（绝不上传）
 * @param options.logoWidthRatio - Logo 宽度相对图片宽度的比例
 * @returns Logo 水印绘制载荷；无有效 Logo 时返回 null
 * @example
 * const payload = await buildLogoPayload(ctx, 1920, options);
 */
async function buildLogoPayload(
  ctx: CanvasRenderingContext2D,
  imageWidth: number,
  options: WatermarkOptions
): Promise<WatermarkPayload | null> {
  if (!options.logoDataUrl) {
    return null;
  }

  let logoImg: HTMLImageElement;
  try {
    logoImg = await loadImageElement(options.logoDataUrl);
  } catch {
    return null;
  }

  /** Logo 绘制宽度下限 1 像素，避免极小比例产生非法尺寸 */
  const logoWidth = Math.max(1, Math.round(options.logoWidthRatio * imageWidth));
  /** 按 Logo 原始宽高比推导的绘制高度 */
  const logoHeight = Math.max(
    1,
    Math.round((logoWidth * logoImg.naturalHeight) / logoImg.naturalWidth)
  );

  return {
    box: { width: logoWidth, height: logoHeight },
    drawAt: (x: number, y: number) => {
      ctx.drawImage(logoImg, x, y, logoWidth, logoHeight);
    },
  };
}

/**
 * 平铺绘制水印
 *
 * @description 将画布原点平移至中心后整体旋转 -30°，在覆盖旋转后可视区域的网格上重复绘制水印；
 * 网格间距取水印包围盒的 2.5 倍，覆盖范围以画布对角线为界并各外扩一个间距，保证斜向无留白
 * @param ctx - 2D 渲染上下文
 * @param canvasWidth - 画布宽度（像素）
 * @param canvasHeight - 画布高度（像素）
 * @param payload - 水印绘制载荷
 * @returns 无返回值
 * @example
 * drawTiledWatermark(ctx, 800, 600, payload);
 */
function drawTiledWatermark(
  ctx: CanvasRenderingContext2D,
  canvasWidth: number,
  canvasHeight: number,
  payload: WatermarkPayload
): void {
  /** 水平方向网格间距（像素） */
  const gapX = payload.box.width * TILE_SPACING_FACTOR;
  /** 垂直方向网格间距（像素） */
  const gapY = payload.box.height * TILE_SPACING_FACTOR;
  /** 画布对角线长度，旋转后可视区域在任意轴向上的半跨度不超过其一半 */
  const diagonal = Math.hypot(canvasWidth, canvasHeight);

  ctx.save();
  ctx.translate(canvasWidth / 2, canvasHeight / 2);
  ctx.rotate(TILE_ROTATION_RADIAN);

  for (let y = -diagonal / 2 - gapY; y <= diagonal / 2 + gapY; y += gapY) {
    for (let x = -diagonal / 2 - gapX; x <= diagonal / 2 + gapX; x += gapX) {
      payload.drawAt(x, y);
    }
  }

  ctx.restore();
}

/**
 * 在浏览器本地为图片添加水印
 *
 * @description 基于 HTML5 Canvas 在原图上叠加水印，全程不离开浏览器内存；
 * 支持文字与 Logo 两种水印，全部几何量（字号、Logo 宽度、边距）均相对每张图片自身宽度归一化，
 * 保证批量不同尺寸图片时水印的相对大小与位置一致；
 * 九宫格锚点定位，开启平铺后忽略锚点并以 -30° 斜向网格铺满整图；
 * 文字为空白或 Logo 无效时退化为不叠加水印直接输出；
 * 输出保持原格式（JPEG / PNG / WebP，其余回退 JPEG），输出为 JPEG 前填充白色背景，
 * 有损格式按固定 0.92 质量导出
 * @param item - 待处理的文件项
 * @param options - 水印参数
 * @param options.type - 水印类型（文字 / Logo 图片）
 * @param options.text - 水印文字内容（文字类型）
 * @param options.color - 文字颜色（文字类型）
 * @param options.fontSizeRatio - 字号相对图片宽度的比例（文字类型）
 * @param options.logoDataUrl - 本地读取的 Logo 图片 Data URL（Logo 类型，绝不上传）
 * @param options.logoWidthRatio - Logo 宽度相对图片宽度的比例（Logo 类型）
 * @param options.position - 九宫格锚点位置（平铺时忽略）
 * @param options.marginRatio - 锚定边距相对图片宽度的比例
 * @param options.opacity - 不透明度（0 到 100）
 * @param options.tiled - 是否以斜向网格平铺整张图片
 * @returns 处理结果（含 Blob、预览地址、尺寸与体积信息）
 * @throws {Error} 图片加载失败或画布导出失败时抛出异常
 * @example
 * const result = await watermarkImage(item, {
 *   type: WatermarkTypeEnum.Text,
 *   text: '© Image Kit',
 *   color: '#ffffff',
 *   fontSizeRatio: 0.05,
 *   logoDataUrl: null,
 *   logoWidthRatio: 0.15,
 *   position: WatermarkPositionEnum.BottomRight,
 *   marginRatio: 0.03,
 *   opacity: 60,
 *   tiled: false,
 * });
 * console.log(result.size, result.format);
 */
async function watermarkImage(
  item: ProcessedFileItem,
  options: WatermarkOptions
): Promise<ProcessResult> {
  let img: HTMLImageElement;
  try {
    img = await loadImageElement(item.previewUrl);
  } catch {
    throw new Error('Failed to load image for watermarking');
  }

  const sourceWidth = img.naturalWidth;
  const sourceHeight = img.naturalHeight;
  const { canvas, ctx } = createCanvas2D(sourceWidth, sourceHeight);

  const outputMime = resolveWatermarkOutputMime(item.originalType);
  if (outputMime === 'image/jpeg') {
    fillWhiteBackground(ctx, sourceWidth, sourceHeight);
  }

  ctx.drawImage(img, 0, 0, sourceWidth, sourceHeight);

  /** 水印绘制载荷，文字为空白或 Logo 无效时为 null */
  const payload =
    options.type === WatermarkTypeEnum.Text
      ? buildTextPayload(ctx, sourceWidth, options)
      : await buildLogoPayload(ctx, sourceWidth, options);

  if (payload) {
    /** 约束在 0 到 100 后换算为 0 到 1 的水印不透明度 */
    const safeOpacity = Math.min(100, Math.max(0, options.opacity)) / 100;
    ctx.save();
    ctx.globalAlpha = safeOpacity;

    if (options.tiled) {
      drawTiledWatermark(ctx, sourceWidth, sourceHeight, payload);
    } else {
      /** 锚定边距下限 0，相对图片宽度归一化 */
      const margin = Math.max(0, options.marginRatio) * sourceWidth;
      const point = resolveAnchorPosition(
        options.position,
        sourceWidth,
        sourceHeight,
        payload.box,
        margin
      );
      payload.drawAt(point.x, point.y);
    }

    ctx.restore();
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

export default watermarkImage;
