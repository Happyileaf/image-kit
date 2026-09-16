import { ComponentType } from 'react';
import { ProcessedFileItem, ToolId } from '../types';

/**
 * 工具处理结果接口
 * 与现有图片处理器（compressImage / convertImage）的返回结构保持一致
 */
export interface ProcessResult {
  /** 处理结果的二进制数据 */
  blob: Blob;
  /** 处理结果的 Object URL，用于预览与下载 */
  url: string;
  /** 处理结果的文件体积（字节） */
  size: number;
  /** 处理结果的图片宽度（像素） */
  width: number;
  /** 处理结果的图片高度（像素） */
  height: number;
  /** 相对原始文件体积节省的百分比 */
  savedPercentage: number;
  /** 处理结果的 MIME 类型 */
  format: string;
}

/**
 * 工具设置面板属性接口
 * 所有工具的设置面板组件统一接收该组属性
 */
export interface SettingsPanelProps<O> {
  /** 当前工具参数 */
  options: O;
  /** 参数变更回调 */
  onChange: (options: O) => void;
  /** 应用参数并重新处理全部文件的回调 */
  onApply: () => void;
  /** 是否正在处理中 */
  isProcessing: boolean;
  /** 当前文件数量 */
  itemCount: number;
}

/**
 * 工具模块接口
 * 每个工具抽象为自描述模块：唯一标识、默认参数、处理器与设置面板
 */
export interface ToolModule<O> {
  /** 工具唯一标识 */
  id: ToolId;
  /** 工具默认参数 */
  defaultOptions: O;
  /** 工具处理器，在浏览器本地将单个文件处理为结果 */
  processor: (item: ProcessedFileItem, options: O) => Promise<ProcessResult>;
  /** 工具设置面板组件 */
  SettingsPanel: ComponentType<SettingsPanelProps<O>>;
}
