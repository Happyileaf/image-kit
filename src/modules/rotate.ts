import { RotateOptions } from '../types';
import { RotateAngleEnum } from '../constants/rotate-angle';
import rotateImage from '../utils/processors/rotate-image';
import RotateSettings from '../components/tools/rotate-settings';
import { ToolModule } from './types';

/**
 * 图片旋转与翻转工具模块
 * 包装 rotateImage 处理器与 RotateSettings 设置面板
 */
export const rotateModule: ToolModule<RotateOptions> = {
  /** 工具唯一标识 */
  id: 'rotate',
  /** 工具默认参数 */
  defaultOptions: {
    angle: RotateAngleEnum.Deg90,
    flipHorizontal: false,
    flipVertical: false,
  },
  /** 工具处理器 */
  processor: rotateImage,
  /** 工具设置面板组件 */
  SettingsPanel: RotateSettings,
};
