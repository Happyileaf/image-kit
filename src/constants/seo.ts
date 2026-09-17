import { ToolDefinition } from '../types';

/**
 * 站点基础配置
 *
 * ⚠️ 修改域名时需同步更新以下文件（无法读取此常量）：
 *   - index.html（canonical、og:url、og:image、twitter:image）
 *   - public/robots.txt（Sitemap 行）
 *   - public/sitemap.xml（所有 <loc> 标签）
 */
export const SITE_URL = 'https://image-kit.contextlab.top';
export const SITE_NAME = 'ImageKit';
export const DEFAULT_OG_IMAGE = `${SITE_URL}/og-image.png`;

/**
 * 页面元信息接口
 */
export interface PageMeta {
  title: string;
  description: string;
}

/**
 * 首页元信息（中英文）
 */
export const HOME_META: Record<'en' | 'zh', PageMeta> = {
  en: {
    title: 'Free Privacy-First Image Tools — Compress, Convert, Resize & More | ImageKit',
    description:
      'Compress, convert, resize, crop, rotate, watermark, and blur images entirely in your browser. No uploads, no login, 100% local processing. Free and privacy-first.',
  },
  zh: {
    title: '免费隐私优先的图片工具 — 压缩、转换、裁剪等 | ImageKit',
    description:
      '完全在浏览器中压缩、转换、调整尺寸、裁剪、旋转、加水印和模糊图片。无需上传，无需登录，100% 本地处理。免费且注重隐私。',
  },
};

/**
 * 关于页元信息
 */
export const ABOUT_META: Record<'en' | 'zh', PageMeta> = {
  en: {
    title: 'About ImageKit — Why Local-First Image Tools',
    description:
      'Learn why ImageKit processes all images locally in your browser. No server uploads, no tracking, no login — just fast, private image editing tools.',
  },
  zh: {
    title: '关于 ImageKit — 为什么选择本地优先的图片工具',
    description:
      '了解 ImageKit 为何在浏览器中本地处理所有图片。无需服务器上传，无追踪，无需登录 —— 快速、私密的图片编辑工具。',
  },
};

/**
 * 隐私页元信息
 */
export const PRIVACY_META: Record<'en' | 'zh', PageMeta> = {
  en: {
    title: 'Privacy & Security — Your Images Never Leave Your Device | ImageKit',
    description:
      'ImageKit never uploads your images. All processing happens locally in your browser using Canvas and Web APIs. Verify it yourself with DevTools.',
  },
  zh: {
    title: '隐私与安全 — 你的图片永远不会离开设备 | ImageKit',
    description:
      'ImageKit 从不上传你的图片。所有处理都在浏览器中使用 Canvas 和 Web API 本地完成。你可以通过开发者工具自行验证。',
  },
};

/**
 * 404 页面元信息
 */
export const NOT_FOUND_META: PageMeta = {
  title: 'Page Not Found | ImageKit',
  description: 'The page you are looking for does not exist.',
};

/**
 * 根据工具定义生成工具页元信息
 * 从 ToolDefinition 的 name 和 fullDesc 动态派生，不硬编码工具列表
 */
export const getToolMeta = (tool: ToolDefinition): PageMeta => {
  const title = `${tool.name} — Free Online Tool, No Upload | ${SITE_NAME}`;
  // description 使用工具的 fullDesc，确保关键词丰富
  const description = tool.fullDesc;
  return { title, description };
};

/**
 * 生成页面完整 URL（用于 canonical 和 og:url）
 */
export const getPageUrl = (path: string): string => {
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${SITE_URL}${cleanPath}`;
};

/**
 * 生成面包屑 URL 路径
 */
export const getToolPath = (toolId: string): string => `/tools/${toolId}`;

// ---------------------------------------------------------------------------
// JSON-LD 结构化数据生成函数
// ---------------------------------------------------------------------------

/**
 * 首页：WebApplication + Organization
 */
export const getHomeJsonLd = (language: 'en' | 'zh') => {
  const isZh = language === 'zh';
  return {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: SITE_NAME,
    url: SITE_URL,
    description: HOME_META[language].description,
    applicationCategory: 'MultimediaApplication',
    operatingSystem: 'Web',
    browserRequirements: 'Requires JavaScript',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    featureList: isZh
      ? ['图片压缩', '格式转换', '调整尺寸', '裁剪', '旋转翻转', '水印', '模糊打码']
      : [
          'Image compression',
          'Format conversion',
          'Resize',
          'Crop',
          'Rotate & flip',
          'Watermark',
          'Blur & redact',
        ],
    publisher: {
      '@type': 'Organization',
      name: SITE_NAME,
      url: SITE_URL,
    },
  };
};

/**
 * 工具页：SoftwareApplication + BreadcrumbList
 */
export const getToolJsonLd = (tool: ToolDefinition, language: 'en' | 'zh') => {
  const toolUrl = getPageUrl(getToolPath(tool.id));
  const isZh = language === 'zh';

  return [
    {
      '@context': 'https://schema.org',
      '@type': 'SoftwareApplication',
      name: tool.name,
      url: toolUrl,
      description: tool.fullDesc,
      applicationCategory: 'MultimediaApplication',
      operatingSystem: 'Web',
      offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'USD',
      },
      featureList: tool.features,
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: isZh ? '首页' : 'Home',
          item: SITE_URL,
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: tool.name,
          item: toolUrl,
        },
      ],
    },
  ];
};

/**
 * 关于页：AboutPage
 */
export const getAboutJsonLd = () => ({
  '@context': 'https://schema.org',
  '@type': 'AboutPage',
  name: `About ${SITE_NAME}`,
  url: getPageUrl('/about'),
  description: ABOUT_META.en.description,
  mainEntity: {
    '@type': 'Organization',
    name: SITE_NAME,
    url: SITE_URL,
  },
});

/**
 * 隐私页：PrivacyPolicy
 */
export const getPrivacyJsonLd = () => ({
  '@context': 'https://schema.org',
  '@type': 'PrivacyPolicy',
  name: `${SITE_NAME} Privacy Policy`,
  url: getPageUrl('/privacy'),
  description: PRIVACY_META.en.description,
});
