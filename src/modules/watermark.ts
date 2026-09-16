import { WatermarkOptions } from '../types';
import { WatermarkTypeEnum } from '../constants/watermark-type';
import { WatermarkPositionEnum } from '../constants/watermark-position';
import watermarkImage from '../utils/processors/watermark-image';
import WatermarkSettings from '../components/tools/watermark-settings';
import { ToolModule } from './types';

/**
 * 图片水印工具模块
 * 包装 watermarkImage 处理器与 WatermarkSettings 设置面板
 */
export const watermarkModule: ToolModule<WatermarkOptions> = {
  /** 工具唯一标识 */
  id: 'watermark',
  /** 工具默认参数 */
  defaultOptions: {
    type: WatermarkTypeEnum.Text,
    text: '© Image Kit',
    color: '#ffffff',
    fontSizeRatio: 0.05,
    logoDataUrl: null,
    logoWidthRatio: 0.15,
    position: WatermarkPositionEnum.BottomRight,
    marginRatio: 0.03,
    opacity: 60,
    tiled: false,
  },
  /** 工具处理器 */
  processor: watermarkImage,
  /** 工具设置面板组件 */
  SettingsPanel: WatermarkSettings,
};
