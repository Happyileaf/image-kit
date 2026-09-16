/**
 * 尺寸调整模式枚举
 * 表示 Resize 工具计算目标尺寸的方式
 */
export enum ResizeModeEnum {
  /**
   * 按目标像素宽高精确缩放
   */
  Pixels = 'Pixels',
  /**
   * 按原图宽高百分比等比缩放
   */
  Percent = 'Percent',
}

/**
 * 尺寸调整模式名称Map
 */
export const ResizeModeLabelMap = {
  /**
   * 像素模式
   */
  [ResizeModeEnum.Pixels]: '像素',
  /**
   * 百分比模式
   */
  [ResizeModeEnum.Percent]: '百分比',
};

/**
 * 尺寸调整模式选项数据源
 */
export const ResizeModeOptions = [
  {
    label: ResizeModeLabelMap[ResizeModeEnum.Pixels],
    value: ResizeModeEnum.Pixels,
  },
  {
    label: ResizeModeLabelMap[ResizeModeEnum.Percent],
    value: ResizeModeEnum.Percent,
  },
];
