import { ConvertOptions } from '../types';
import { convertImage } from '../utils/imageProcessor';
import { ConverterSettings } from '../components/tools/ConverterSettings';
import { ToolModule } from './types';

/**
 * 图片格式转换工具模块
 * 包装 convertImage 处理器与 ConverterSettings 设置面板
 */
export const convertModule: ToolModule<ConvertOptions> = {
  /** 工具唯一标识 */
  id: 'convert',
  /** 工具默认参数 */
  defaultOptions: {
    targetFormat: 'image/webp',
    quality: 80,
  },
  /** 工具处理器 */
  processor: convertImage,
  /** 工具设置面板组件 */
  SettingsPanel: ConverterSettings,
};
