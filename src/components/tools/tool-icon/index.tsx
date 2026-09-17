import {
  Minimize2,
  Repeat,
  Maximize2,
  Crop,
  RotateCw,
  Stamp,
  EyeOff,
  Wand2,
  Layers,
  Sparkles
} from 'lucide-react';

/**
 * 工具图标组件属性
 */
interface ToolIconProps {
  /** 工具定义中的 iconName 字段，与 lucide 图标一一对应 */
  iconName: string;
  /** 透传给图标的样式类名，用于控制尺寸与颜色 */
  className?: string;
}

/**
 * 按工具定义的 iconName 渲染对应的 lucide 图标
 *
 * @description 全站统一的工具图标映射入口，新增工具时只需在此登记一次，
 * 导航栏、首页工具网格等所有引用处自动生效
 * @param props 组件属性
 * @param props.iconName - 工具定义中的 iconName 字段
 * @param props.className - 透传给图标的样式类名
 * @returns 对应的 lucide 图标元素，未登记的名称回退为 Sparkles
 */
export default function ToolIcon({ iconName, className }: ToolIconProps) {
  switch (iconName) {
    case 'Minimize2': return <Minimize2 className={className} />;
    case 'Repeat': return <Repeat className={className} />;
    case 'Maximize2': return <Maximize2 className={className} />;
    case 'Crop': return <Crop className={className} />;
    case 'RotateCw': return <RotateCw className={className} />;
    case 'Stamp': return <Stamp className={className} />;
    case 'EyeOff': return <EyeOff className={className} />;
    case 'Wand2': return <Wand2 className={className} />;
    case 'Layers': return <Layers className={className} />;
    default: return <Sparkles className={className} />;
  }
}
