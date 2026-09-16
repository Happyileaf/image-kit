import { CompressOptions } from '../types';
import { compressImage } from '../utils/imageProcessor';
import { CompressorSettings } from '../components/tools/CompressorSettings';
import { ToolModule } from './types';

/**
 * 图片压缩工具模块
 * 包装 compressImage 处理器与 CompressorSettings 设置面板
 */
export const compressModule: ToolModule<CompressOptions> = {
  /** 工具唯一标识 */
  id: 'compress',
  /** 工具默认参数 */
  defaultOptions: {
    quality: 80,
    format: 'keep',
    maxWidthOrHeight: 0,
  },
  /** 工具处理器 */
  processor: compressImage,
  /** 工具设置面板组件 */
  SettingsPanel: CompressorSettings,
};
