/**
 * 水印位置枚举
 * 表示水印在图片上的九宫格锚点位置
 */
export enum WatermarkPositionEnum {
  /**
   * 左上角
   */
  TopLeft = 'TopLeft',
  /**
   * 顶部居中
   */
  TopCenter = 'TopCenter',
  /**
   * 右上角
   */
  TopRight = 'TopRight',
  /**
   * 左侧居中
   */
  MiddleLeft = 'MiddleLeft',
  /**
   * 正中心
   */
  MiddleCenter = 'MiddleCenter',
  /**
   * 右侧居中
   */
  MiddleRight = 'MiddleRight',
  /**
   * 左下角
   */
  BottomLeft = 'BottomLeft',
  /**
   * 底部居中
   */
  BottomCenter = 'BottomCenter',
  /**
   * 右下角
   */
  BottomRight = 'BottomRight',
}

/**
 * 水印位置名称Map
 */
export const WatermarkPositionLabelMap = {
  /**
   * 左上
   */
  [WatermarkPositionEnum.TopLeft]: '左上',
  /**
   * 顶部居中
   */
  [WatermarkPositionEnum.TopCenter]: '顶部居中',
  /**
   * 右上
   */
  [WatermarkPositionEnum.TopRight]: '右上',
  /**
   * 左侧居中
   */
  [WatermarkPositionEnum.MiddleLeft]: '左侧居中',
  /**
   * 正中心
   */
  [WatermarkPositionEnum.MiddleCenter]: '正中心',
  /**
   * 右侧居中
   */
  [WatermarkPositionEnum.MiddleRight]: '右侧居中',
  /**
   * 左下
   */
  [WatermarkPositionEnum.BottomLeft]: '左下',
  /**
   * 底部居中
   */
  [WatermarkPositionEnum.BottomCenter]: '底部居中',
  /**
   * 右下
   */
  [WatermarkPositionEnum.BottomRight]: '右下',
};

/**
 * 水印位置选项数据源
 */
export const WatermarkPositionOptions = [
  {
    label: WatermarkPositionLabelMap[WatermarkPositionEnum.TopLeft],
    value: WatermarkPositionEnum.TopLeft,
  },
  {
    label: WatermarkPositionLabelMap[WatermarkPositionEnum.TopCenter],
    value: WatermarkPositionEnum.TopCenter,
  },
  {
    label: WatermarkPositionLabelMap[WatermarkPositionEnum.TopRight],
    value: WatermarkPositionEnum.TopRight,
  },
  {
    label: WatermarkPositionLabelMap[WatermarkPositionEnum.MiddleLeft],
    value: WatermarkPositionEnum.MiddleLeft,
  },
  {
    label: WatermarkPositionLabelMap[WatermarkPositionEnum.MiddleCenter],
    value: WatermarkPositionEnum.MiddleCenter,
  },
  {
    label: WatermarkPositionLabelMap[WatermarkPositionEnum.MiddleRight],
    value: WatermarkPositionEnum.MiddleRight,
  },
  {
    label: WatermarkPositionLabelMap[WatermarkPositionEnum.BottomLeft],
    value: WatermarkPositionEnum.BottomLeft,
  },
  {
    label: WatermarkPositionLabelMap[WatermarkPositionEnum.BottomCenter],
    value: WatermarkPositionEnum.BottomCenter,
  },
  {
    label: WatermarkPositionLabelMap[WatermarkPositionEnum.BottomRight],
    value: WatermarkPositionEnum.BottomRight,
  },
];
