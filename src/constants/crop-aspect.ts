/**
 * 裁剪宽高比枚举
 * 表示 Crop 工具选区编辑器的比例锁定模式
 */
export enum CropAspectEnum {
  /**
   * 自由比例，不锁定宽高比
   */
  Free = 'Free',
  /**
   * 1:1 正方形比例
   */
  Ratio1x1 = 'Ratio1x1',
  /**
   * 4:3 标准画幅比例
   */
  Ratio4x3 = 'Ratio4x3',
  /**
   * 3:2 经典相机画幅比例
   */
  Ratio3x2 = 'Ratio3x2',
  /**
   * 16:9 宽屏比例
   */
  Ratio16x9 = 'Ratio16x9',
}

/**
 * 裁剪宽高比名称Map
 */
export const CropAspectLabelMap = {
  /**
   * 自由比例
   */
  [CropAspectEnum.Free]: '自由比例',
  /**
   * 1:1 正方形
   */
  [CropAspectEnum.Ratio1x1]: '1:1 正方形',
  /**
   * 4:3 标准画幅
   */
  [CropAspectEnum.Ratio4x3]: '4:3 标准画幅',
  /**
   * 3:2 经典画幅
   */
  [CropAspectEnum.Ratio3x2]: '3:2 经典画幅',
  /**
   * 16:9 宽屏
   */
  [CropAspectEnum.Ratio16x9]: '16:9 宽屏',
};

/**
 * 裁剪宽高比选项数据源
 */
export const CropAspectOptions = [
  {
    label: CropAspectLabelMap[CropAspectEnum.Free],
    value: CropAspectEnum.Free,
  },
  {
    label: CropAspectLabelMap[CropAspectEnum.Ratio1x1],
    value: CropAspectEnum.Ratio1x1,
  },
  {
    label: CropAspectLabelMap[CropAspectEnum.Ratio4x3],
    value: CropAspectEnum.Ratio4x3,
  },
  {
    label: CropAspectLabelMap[CropAspectEnum.Ratio3x2],
    value: CropAspectEnum.Ratio3x2,
  },
  {
    label: CropAspectLabelMap[CropAspectEnum.Ratio16x9],
    value: CropAspectEnum.Ratio16x9,
  },
];
