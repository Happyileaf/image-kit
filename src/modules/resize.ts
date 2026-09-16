import { ResizeOptions } from '../types';
import { ResizeModeEnum } from '../constants/resize-mode';
import resizeImage from '../utils/processors/resize-image';
import ResizeSettings from '../components/tools/resize-settings';
import { ToolModule } from './types';

/**
 * 图片尺寸调整工具模块
 * 包装 resizeImage 处理器与 ResizeSettings 设置面板
 */
export const resizeModule: ToolModule<ResizeOptions> = {
  /** 工具唯一标识 */
  id: 'resize',
  /** 工具默认参数 */
  defaultOptions: {
    mode: ResizeModeEnum.Percent,
    width: 1920,
    height: 1080,
    percent: 50,
    lockAspect: true,
    quality: 90,
  },
  /** 工具处理器 */
  processor: resizeImage,
  /** 工具设置面板组件 */
  SettingsPanel: ResizeSettings,
};
