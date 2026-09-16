import { ToolId } from '../types';
import { ToolModule } from './types';
import { compressModule } from './compress';
import { convertModule } from './convert';

/**
 * 工具模块注册表
 * key 为工具唯一标识，value 为对应的工具模块；仅注册已实现的工具
 */
export const TOOL_MODULES: Partial<Record<ToolId, ToolModule<any>>> = {
  /** 图片压缩工具模块 */
  compress: compressModule,
  /** 图片格式转换工具模块 */
  convert: convertModule,
};

/**
 * 获取工具模块
 *
 * @description 根据工具唯一标识从注册表中获取对应的工具模块
 * @param id - 工具唯一标识
 * @returns 对应的工具模块，未注册时返回 undefined
 * @example
 * const toolModule = getToolModule('compress');
 */
export function getToolModule(id: ToolId): ToolModule<any> | undefined {
  return TOOL_MODULES[id];
}
