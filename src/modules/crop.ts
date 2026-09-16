import { CropOptions } from '../types';
import { CropAspectEnum } from '../constants/crop-aspect';
import cropImage from '../utils/processors/crop-image';
import CropSettings from '../components/tools/crop-settings';
import { ToolModule } from './types';

/**
 * 图片裁剪工具模块
 * 包装 cropImage 处理器与 CropSettings 设置面板
 */
export const cropModule: ToolModule<CropOptions> = {
  /** 工具唯一标识 */
  id: 'crop',
  /** 工具默认参数：默认全图选区、自由比例 */
  defaultOptions: {
    region: { x: 0, y: 0, width: 1, height: 1 },
    aspect: CropAspectEnum.Free,
  },
  /** 工具处理器 */
  processor: cropImage,
  /** 工具设置面板组件 */
  SettingsPanel: CropSettings,
};
