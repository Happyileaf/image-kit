import { BlurOptions } from '../types';
import { BlurEffectEnum } from '../constants/blur-effect';
import blurImage from '../utils/processors/blur-image';
import BlurSettings from '../components/tools/blur-settings';
import { ToolModule } from './types';

/**
 * 图片打码遮盖工具模块
 * 包装 blurImage 处理器与 BlurSettings 设置面板
 */
export const blurModule: ToolModule<BlurOptions> = {
  /** 工具唯一标识 */
  id: 'blur',
  /** 工具默认参数：默认像素化效果、中等强度、无打码区域 */
  defaultOptions: {
    effect: BlurEffectEnum.Pixelate,
    strength: 50,
    regions: [],
  },
  /** 工具处理器 */
  processor: blurImage,
  /** 工具设置面板组件 */
  SettingsPanel: BlurSettings,
};
