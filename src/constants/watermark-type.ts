/**
 * 水印类型枚举
 * 表示 Watermark 工具生成水印内容的来源方式
 */
export enum WatermarkTypeEnum {
  /**
   * 文字水印
   */
  Text = 'Text',
  /**
   * Logo 图片水印
   */
  Logo = 'Logo',
}

/**
 * 水印类型名称Map
 */
export const WatermarkTypeLabelMap = {
  /**
   * 文字
   */
  [WatermarkTypeEnum.Text]: '文字',
  /**
   * Logo 图片
   */
  [WatermarkTypeEnum.Logo]: 'Logo 图片',
};

/**
 * 水印类型选项数据源
 */
export const WatermarkTypeOptions = [
  {
    label: WatermarkTypeLabelMap[WatermarkTypeEnum.Text],
    value: WatermarkTypeEnum.Text,
  },
  {
    label: WatermarkTypeLabelMap[WatermarkTypeEnum.Logo],
    value: WatermarkTypeEnum.Logo,
  },
];
