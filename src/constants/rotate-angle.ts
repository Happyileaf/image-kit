/**
 * 旋转角度枚举
 * 表示以图片中心为原点的顺时针旋转角度
 */
export enum RotateAngleEnum {
  /**
   * 不旋转，保持原始朝向
   */
  Deg0 = 'Deg0',
  /**
   * 顺时针旋转 90 度
   */
  Deg90 = 'Deg90',
  /**
   * 顺时针旋转 180 度
   */
  Deg180 = 'Deg180',
  /**
   * 顺时针旋转 270 度
   */
  Deg270 = 'Deg270',
}

/**
 * 旋转角度名称Map
 */
export const RotateAngleLabelMap = {
  /**
   * 不旋转
   */
  [RotateAngleEnum.Deg0]: '不旋转',
  /**
   * 顺时针 90°
   */
  [RotateAngleEnum.Deg90]: '顺时针 90°',
  /**
   * 旋转 180°
   */
  [RotateAngleEnum.Deg180]: '旋转 180°',
  /**
   * 顺时针 270°
   */
  [RotateAngleEnum.Deg270]: '顺时针 270°',
};

/**
 * 旋转角度选项数据源
 */
export const RotateAngleOptions = [
  {
    label: RotateAngleLabelMap[RotateAngleEnum.Deg0],
    value: RotateAngleEnum.Deg0,
  },
  {
    label: RotateAngleLabelMap[RotateAngleEnum.Deg90],
    value: RotateAngleEnum.Deg90,
  },
  {
    label: RotateAngleLabelMap[RotateAngleEnum.Deg180],
    value: RotateAngleEnum.Deg180,
  },
  {
    label: RotateAngleLabelMap[RotateAngleEnum.Deg270],
    value: RotateAngleEnum.Deg270,
  },
];
