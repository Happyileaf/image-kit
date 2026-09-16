/**
 * 打码遮盖效果枚举
 * 表示 Blur & Redact 工具对每个遮盖区域应用的视觉效果
 */
export enum BlurEffectEnum {
  /**
   * 像素化，将区域缩小后关闭平滑再放大，形成马赛克方块
   */
  Pixelate = 'Pixelate',
  /**
   * 高斯模糊，基于 Canvas filter 的柔化遮盖
   */
  Gaussian = 'Gaussian',
}

/**
 * 打码遮盖效果名称Map
 */
export const BlurEffectLabelMap = {
  /**
   * 像素化
   */
  [BlurEffectEnum.Pixelate]: '像素化',
  /**
   * 高斯模糊
   */
  [BlurEffectEnum.Gaussian]: '高斯模糊',
};

/**
 * 打码遮盖效果选项数据源
 */
export const BlurEffectOptions = [
  {
    label: BlurEffectLabelMap[BlurEffectEnum.Pixelate],
    value: BlurEffectEnum.Pixelate,
  },
  {
    label: BlurEffectLabelMap[BlurEffectEnum.Gaussian],
    value: BlurEffectEnum.Gaussian,
  },
];
