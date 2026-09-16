import { RotateAngleEnum } from './constants/rotate-angle';
import { ResizeModeEnum } from './constants/resize-mode';

export type ToolId = 
  | 'compress'
  | 'convert'
  | 'resize'
  | 'crop'
  | 'rotate'
  | 'watermark'
  | 'blur'
  | 'remove-bg'
  | 'batch-rename';

export type ToolCategory = 'essentials' | 'edit' | 'advanced';

export interface ToolDefinition {
  id: ToolId;
  name: string;
  shortDesc: string;
  fullDesc: string;
  category: ToolCategory;
  isAvailable: boolean;
  iconName: string;
  badge?: string;
  acceptedFormats: string;
  features: string[];
}

export type ProcessingStatus = 'idle' | 'reading' | 'processing' | 'done' | 'error';

export interface ProcessedFileItem {
  id: string;
  file: File;
  name: string;
  originalSize: number;
  originalWidth: number;
  originalHeight: number;
  originalType: string;
  previewUrl: string;
  status: ProcessingStatus;
  progress: number;
  resultBlob: Blob | null;
  resultUrl: string | null;
  resultSize: number | null;
  resultWidth: number | null;
  resultHeight: number | null;
  resultType: string | null;
  savedPercentage: number | null;
  errorMessage?: string;
}

export interface CompressOptions {
  quality: number; // 1 to 100
  format: 'keep' | 'image/jpeg' | 'image/webp';
  maxWidthOrHeight: number; // 0 for original
}

export type TargetFormat = 'image/webp' | 'image/jpeg' | 'image/png' | 'image/avif';

export interface ConvertOptions {
  targetFormat: TargetFormat;
  quality: number; // 1 to 100 (for lossy formats)
}

export interface RotateOptions {
  angle: RotateAngleEnum; // clockwise rotation angle
  flipHorizontal: boolean;
  flipVertical: boolean;
}

export interface ResizeOptions {
  mode: ResizeModeEnum; // pixel-based or percentage-based resizing
  width: number; // target width in pixels (pixels mode)
  height: number; // target height in pixels (pixels mode, used when aspect lock is off)
  percent: number; // scale percentage (percent mode), 10 to 200
  lockAspect: boolean; // when locked, height is derived from width per-image aspect ratio
  quality: number; // 1 to 100 (for lossy output formats)
}

export type PageView = 
  | { type: 'home' }
  | { type: 'tool'; toolId: ToolId }
  | { type: 'about' }
  | { type: 'privacy' };
