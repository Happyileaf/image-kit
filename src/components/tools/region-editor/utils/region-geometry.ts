import { NormalizedRect } from '../../../../types';
import { CropAspectEnum } from '../../../../constants/crop-aspect';
import {
  MIN_REGION_RATIO,
  ASPECT_MATCH_TOLERANCE,
  CROP_ASPECT_RATIO_MAP,
} from '../constants';
import { NormalizedPoint, RegionResizeHandle } from '../types';

/**
 * 像素空间矩形接口
 * 以图片左上角为原点的四边位置，单位为像素
 */
interface PixelRectEdges {
  /** 左边缘横坐标 */
  left: number;
  /** 上边缘纵坐标 */
  top: number;
  /** 右边缘横坐标 */
  right: number;
  /** 下边缘纵坐标 */
  bottom: number;
}

/**
 * 数值范围约束
 *
 * @description 将数值约束到指定的闭区间内
 * @param value - 待约束的数值
 * @param min - 区间下限
 * @param max - 区间上限
 * @returns 约束后的数值
 * @example
 * const safe = clampNumber(1.2, 0, 1);
 * console.log(safe); // 1
 */
export function clampNumber(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

/**
 * 解析比例锁定的像素宽高比
 *
 * @description 将裁剪宽高比枚举换算为像素空间的宽高比；自由比例返回 null 表示不约束
 * @param aspect - 裁剪宽高比枚举
 * @returns 像素宽高比（宽 / 高），自由比例时为 null
 * @example
 * const ratio = resolveAspectRatioValue(CropAspectEnum.Ratio16x9);
 * console.log(ratio); // 1.777...
 */
export function resolveAspectRatioValue(aspect: CropAspectEnum): number | null {
  return CROP_ASPECT_RATIO_MAP[aspect];
}

/**
 * 将选区约束到图片范围内
 *
 * @description 宽高先约束到 [最小归一化尺寸, 1]，位置再约束使选区完整落在单位矩形内
 * @param region - 待约束的归一化选区
 * @returns 约束后的归一化选区
 * @example
 * const safe = clampRegionToUnit({ x: 0.9, y: 0, width: 0.5, height: 0.5 });
 * console.log(safe.x); // 0.5
 */
export function clampRegionToUnit(region: NormalizedRect): NormalizedRect {
  const width = clampNumber(region.width, MIN_REGION_RATIO, 1);
  const height = clampNumber(region.height, MIN_REGION_RATIO, 1);
  return {
    x: clampNumber(region.x, 0, 1 - width),
    y: clampNumber(region.y, 0, 1 - height),
    width,
    height,
  };
}

/**
 * 替换区域数组中指定索引的选区
 *
 * @description 以不可变方式生成新数组，为多区域模式预留的数组级操作
 * @param regions - 原区域数组
 * @param index - 待替换的索引
 * @param next - 新选区
 * @returns 替换后的新数组
 * @example
 * const nextRegions = replaceRegionAt(regions, 0, nextRegion);
 */
export function replaceRegionAt(
  regions: NormalizedRect[],
  index: number,
  next: NormalizedRect
): NormalizedRect[] {
  return regions.map((region, i) => (i === index ? next : region));
}

/**
 * 将初始选区校正为符合比例的选区
 *
 * @description 自由比例时仅做边界约束；比例锁定时，若初始选区已符合目标比例
 * （相对误差在容差内）则保留原选区，否则返回符合比例的居中最大矩形
 * @param region - 初始归一化选区
 * @param aspectRatio - 目标像素宽高比，自由比例时为 null
 * @param imageWidth - 图片原始宽度（像素）
 * @param imageHeight - 图片原始高度（像素）
 * @returns 校正后的归一化选区
 * @example
 * const region = fitRegionToAspect(initialRegion, 16 / 9, 1920, 1080);
 */
export function fitRegionToAspect(
  region: NormalizedRect,
  aspectRatio: number | null,
  imageWidth: number,
  imageHeight: number
): NormalizedRect {
  const safeRegion = clampRegionToUnit(region);
  if (!aspectRatio) {
    return safeRegion;
  }

  const currentRatio =
    (safeRegion.width * imageWidth) / (safeRegion.height * imageHeight);
  if (Math.abs(currentRatio - aspectRatio) / aspectRatio < ASPECT_MATCH_TOLERANCE) {
    return safeRegion;
  }

  let regionWidthPx = imageWidth;
  let regionHeightPx = regionWidthPx / aspectRatio;
  if (regionHeightPx > imageHeight) {
    regionHeightPx = imageHeight;
    regionWidthPx = regionHeightPx * aspectRatio;
  }

  return {
    x: (imageWidth - regionWidthPx) / 2 / imageWidth,
    y: (imageHeight - regionHeightPx) / 2 / imageHeight,
    width: regionWidthPx / imageWidth,
    height: regionHeightPx / imageHeight,
  };
}

/**
 * 拖拽建框
 *
 * @description 以拖拽起点为锚点、当前指针位置为对角点构造选区；
 * 比例锁定时在像素空间内按锚点向外扩展并保持宽高比，双侧均受图片边界约束；
 * 自由比例时直接取两点包围盒；结果保证不小于最小归一化尺寸
 * @param startPoint - 拖拽起点（归一化坐标）
 * @param currentPoint - 当前指针位置（归一化坐标）
 * @param aspectRatio - 目标像素宽高比，自由比例时为 null
 * @param imageWidth - 图片原始宽度（像素）
 * @param imageHeight - 图片原始高度（像素）
 * @returns 新建归一化选区
 * @example
 * const region = createRegion({ x: 0.2, y: 0.2 }, { x: 0.6, y: 0.5 }, null, 1920, 1080);
 */
export function createRegion(
  startPoint: NormalizedPoint,
  currentPoint: NormalizedPoint,
  aspectRatio: number | null,
  imageWidth: number,
  imageHeight: number
): NormalizedRect {
  const anchorX = clampNumber(startPoint.x, 0, 1) * imageWidth;
  const anchorY = clampNumber(startPoint.y, 0, 1) * imageHeight;
  const pointerX = clampNumber(currentPoint.x, 0, 1) * imageWidth;
  const pointerY = clampNumber(currentPoint.y, 0, 1) * imageHeight;
  const minWidth = MIN_REGION_RATIO * imageWidth;
  const minHeight = MIN_REGION_RATIO * imageHeight;

  const signX = pointerX >= anchorX ? 1 : -1;
  const signY = pointerY >= anchorY ? 1 : -1;
  const availableWidth = signX > 0 ? imageWidth - anchorX : anchorX;
  const availableHeight = signY > 0 ? imageHeight - anchorY : anchorY;

  let regionWidthPx = Math.abs(pointerX - anchorX);
  let regionHeightPx = Math.abs(pointerY - anchorY);

  if (aspectRatio) {
    regionWidthPx = clampNumber(regionWidthPx, minWidth, Math.max(availableWidth, minWidth));
    regionHeightPx = regionWidthPx / aspectRatio;
    if (regionHeightPx > availableHeight) {
      regionHeightPx = Math.max(availableHeight, minHeight);
      regionWidthPx = regionHeightPx * aspectRatio;
    }
  } else {
    regionWidthPx = clampNumber(regionWidthPx, minWidth, Math.max(availableWidth, minWidth));
    regionHeightPx = clampNumber(regionHeightPx, minHeight, Math.max(availableHeight, minHeight));
  }

  const left = signX > 0 ? anchorX : anchorX - regionWidthPx;
  const top = signY > 0 ? anchorY : anchorY - regionHeightPx;

  return {
    x: left / imageWidth,
    y: top / imageHeight,
    width: regionWidthPx / imageWidth,
    height: regionHeightPx / imageHeight,
  };
}

/**
 * 整框移动选区
 *
 * @description 按归一化位移平移选区，并约束选区完整停留在图片范围内
 * @param startRegion - 拖拽开始时的选区快照
 * @param delta - 归一化位移量
 * @param delta.x - 水平位移（0 到 1，相对图片宽度）
 * @param delta.y - 垂直位移（0 到 1，相对图片高度）
 * @returns 移动后的归一化选区
 * @example
 * const moved = moveRegion(startRegion, { x: 0.05, y: -0.02 });
 */
export function moveRegion(
  startRegion: NormalizedRect,
  delta: NormalizedPoint
): NormalizedRect {
  return {
    ...startRegion,
    x: clampNumber(startRegion.x + delta.x, 0, 1 - startRegion.width),
    y: clampNumber(startRegion.y + delta.y, 0, 1 - startRegion.height),
  };
}

/**
 * 手柄缩放选区
 *
 * @description 在像素空间内按手柄方位调整选区：角手柄以对角为锚点，
 * 边手柄以对边为锚点并保持另一轴中心不变；比例锁定时由主动边推导从动边，
 * 双向均受图片边界与最小尺寸约束
 * @param startRegion - 拖拽开始时的选区快照
 * @param handle - 被拖动的手柄方位
 * @param currentPoint - 当前指针位置（归一化坐标）
 * @param aspectRatio - 目标像素宽高比，自由比例时为 null
 * @param imageWidth - 图片原始宽度（像素）
 * @param imageHeight - 图片原始高度（像素）
 * @returns 缩放后的归一化选区
 * @example
 * const resized = resizeRegion(startRegion, 'se', { x: 0.8, y: 0.7 }, 16 / 9, 1920, 1080);
 */
export function resizeRegion(
  startRegion: NormalizedRect,
  handle: RegionResizeHandle,
  currentPoint: NormalizedPoint,
  aspectRatio: number | null,
  imageWidth: number,
  imageHeight: number
): NormalizedRect {
  const start: PixelRectEdges = {
    left: startRegion.x * imageWidth,
    top: startRegion.y * imageHeight,
    right: (startRegion.x + startRegion.width) * imageWidth,
    bottom: (startRegion.y + startRegion.height) * imageHeight,
  };
  const pointerX = clampNumber(currentPoint.x, 0, 1) * imageWidth;
  const pointerY = clampNumber(currentPoint.y, 0, 1) * imageHeight;
  const minWidth = MIN_REGION_RATIO * imageWidth;
  const minHeight = MIN_REGION_RATIO * imageHeight;

  let { left, top, right, bottom } = start;

  if (!aspectRatio) {
    if (handle.includes('w')) {
      left = clampNumber(pointerX, 0, right - minWidth);
    }
    if (handle.includes('e')) {
      right = clampNumber(pointerX, left + minWidth, imageWidth);
    }
    if (handle.includes('n')) {
      top = clampNumber(pointerY, 0, bottom - minHeight);
    }
    if (handle.includes('s')) {
      bottom = clampNumber(pointerY, top + minHeight, imageHeight);
    }
  } else if (handle === 'e' || handle === 'w') {
    /** 边中手柄：水平为主动边，垂直方向绕中心对称伸缩 */
    const anchorX = handle === 'e' ? left : right;
    const maxWidth = handle === 'e' ? imageWidth - anchorX : anchorX;
    let regionWidthPx = clampNumber(Math.abs(pointerX - anchorX), minWidth, Math.max(maxWidth, minWidth));
    let regionHeightPx = regionWidthPx / aspectRatio;
    if (regionHeightPx > imageHeight) {
      regionHeightPx = imageHeight;
      regionWidthPx = regionHeightPx * aspectRatio;
    }
    const centerY = (start.top + start.bottom) / 2;
    top = clampNumber(centerY - regionHeightPx / 2, 0, imageHeight - regionHeightPx);
    bottom = top + regionHeightPx;
    if (handle === 'e') {
      right = left + regionWidthPx;
    } else {
      left = right - regionWidthPx;
    }
  } else if (handle === 'n' || handle === 's') {
    /** 边中手柄：垂直为主动边，水平方向绕中心对称伸缩 */
    const anchorY = handle === 's' ? top : bottom;
    const maxHeight = handle === 's' ? imageHeight - anchorY : anchorY;
    let regionHeightPx = clampNumber(Math.abs(pointerY - anchorY), minHeight, Math.max(maxHeight, minHeight));
    let regionWidthPx = regionHeightPx * aspectRatio;
    if (regionWidthPx > imageWidth) {
      regionWidthPx = imageWidth;
      regionHeightPx = regionWidthPx / aspectRatio;
    }
    const centerX = (start.left + start.right) / 2;
    left = clampNumber(centerX - regionWidthPx / 2, 0, imageWidth - regionWidthPx);
    right = left + regionWidthPx;
    if (handle === 's') {
      bottom = top + regionHeightPx;
    } else {
      top = bottom - regionHeightPx;
    }
  } else {
    /** 角手柄：以对角为锚点，宽度为主动量，高度按比例推导 */
    const anchorX = handle.includes('w') ? start.right : start.left;
    const anchorY = handle.includes('n') ? start.bottom : start.top;
    const signX = handle.includes('w') ? -1 : 1;
    const signY = handle.includes('n') ? -1 : 1;
    const availableWidth = signX > 0 ? imageWidth - anchorX : anchorX;
    const availableHeight = signY > 0 ? imageHeight - anchorY : anchorY;
    let regionWidthPx = clampNumber(Math.abs(pointerX - anchorX), minWidth, Math.max(availableWidth, minWidth));
    let regionHeightPx = regionWidthPx / aspectRatio;
    if (regionHeightPx > availableHeight) {
      regionHeightPx = Math.max(availableHeight, minHeight);
      regionWidthPx = regionHeightPx * aspectRatio;
    }
    left = signX > 0 ? anchorX : anchorX - regionWidthPx;
    right = left + regionWidthPx;
    top = signY > 0 ? anchorY : anchorY - regionHeightPx;
    bottom = top + regionHeightPx;
  }

  return {
    x: left / imageWidth,
    y: top / imageHeight,
    width: (right - left) / imageWidth,
    height: (bottom - top) / imageHeight,
  };
}

/**
 * 蒙版切片接口
 * 描述一块暗色遮罩在单位矩形内的位置与尺寸（归一化坐标）
 */
export interface MaskPiece {
  /** 左边缘（0 到 1，相对舞台宽度） */
  x: number;
  /** 上边缘（0 到 1，相对舞台高度） */
  y: number;
  /** 宽度（0 到 1，相对舞台宽度） */
  width: number;
  /** 高度（0 到 1，相对舞台高度） */
  height: number;
}

/**
 * 构造选区外暗色蒙版的切片集合
 *
 * @description 以全部选区的纵边界切分水平行带，每个行带内按覆盖选区的横区间
 * 排序合并后填充空隙，使蒙版恰好覆盖所有选区之外的区域；单区域时退化为
 * 上下整宽加中间左右四片，区域重叠时按并集处理；空数组返回整幅蒙版
 * @param regions - 全部归一化选区
 * @returns 蒙版切片数组，直接用于绝对定位渲染
 * @example
 * const pieces = buildMaskPieces([{ x: 0.2, y: 0.2, width: 0.3, height: 0.3 }]);
 * console.log(pieces.length); // 4
 */
export function buildMaskPieces(regions: NormalizedRect[]): MaskPiece[] {
  if (regions.length === 0) {
    return [{ x: 0, y: 0, width: 1, height: 1 }];
  }

  const yBounds = Array.from(
    new Set([0, ...regions.flatMap((region) => [region.y, region.y + region.height]), 1]),
  ).sort((a, b) => a - b);

  const pieces: MaskPiece[] = [];
  for (let index = 0; index < yBounds.length - 1; index += 1) {
    const bandTop = yBounds[index];
    const bandBottom = yBounds[index + 1];
    if (bandBottom - bandTop <= 0) continue;

    const coveringIntervals = regions
      .filter((region) => region.y <= bandTop && region.y + region.height >= bandBottom)
      .map((region) => ({ left: region.x, right: region.x + region.width }))
      .sort((a, b) => a.left - b.left);

    let cursor = 0;
    for (const interval of coveringIntervals) {
      if (interval.left > cursor) {
        pieces.push({
          x: cursor,
          y: bandTop,
          width: interval.left - cursor,
          height: bandBottom - bandTop,
        });
      }
      cursor = Math.max(cursor, interval.right);
    }
    if (cursor < 1) {
      pieces.push({ x: cursor, y: bandTop, width: 1 - cursor, height: bandBottom - bandTop });
    }
  }

  return pieces;
}
