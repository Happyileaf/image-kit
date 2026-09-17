import { useEffect } from 'react';
import { getPageUrl, DEFAULT_OG_IMAGE } from '../../constants/seo';

interface MetaTagsProps {
  title: string;
  description: string;
  path: string;
  ogType?: string;
}

interface TagDef {
  selector: string;
  attrs: Record<string, string>;
  parent?: 'head';
}

/**
 * 直接操作 DOM 管理 <title>、<meta>、<link> 标签。
 * react-helmet-async@2.0.0 的 meta/link prop 在 React 19 下不生效，
 * 因此采用与 JsonLd 相同的直接 DOM 注入策略。
 */
export function MetaTags({ title, description, path, ogType = 'website' }: MetaTagsProps) {
  useEffect(() => {
    const canonicalUrl = getPageUrl(path);
    const ogImage = DEFAULT_OG_IMAGE;

    // --- Title ---
    document.title = title;

    // --- Meta tags ---
    const metaDefs: Array<{ selector: string; attrs: Record<string, string> }> = [
      { selector: 'meta[name="description"]', attrs: { name: 'description', content: description } },
      { selector: 'meta[property="og:site_name"]', attrs: { property: 'og:site_name', content: 'ImageKit' } },
      { selector: 'meta[property="og:type"]', attrs: { property: 'og:type', content: ogType } },
      { selector: 'meta[property="og:title"]', attrs: { property: 'og:title', content: title } },
      { selector: 'meta[property="og:description"]', attrs: { property: 'og:description', content: description } },
      { selector: 'meta[property="og:url"]', attrs: { property: 'og:url', content: canonicalUrl } },
      { selector: 'meta[property="og:image"]', attrs: { property: 'og:image', content: ogImage } },
      { selector: 'meta[property="og:locale"]', attrs: { property: 'og:locale', content: 'en_US' } },
      { selector: 'meta[property="og:locale:alternate"]', attrs: { property: 'og:locale:alternate', content: 'zh_CN' } },
      { selector: 'meta[name="twitter:card"]', attrs: { name: 'twitter:card', content: 'summary_large_image' } },
      { selector: 'meta[name="twitter:title"]', attrs: { name: 'twitter:title', content: title } },
      { selector: 'meta[name="twitter:description"]', attrs: { name: 'twitter:description', content: description } },
      { selector: 'meta[name="twitter:image"]', attrs: { name: 'twitter:image', content: ogImage } },
    ];

    for (const def of metaDefs) {
      let el = document.head.querySelector(def.selector) as HTMLMetaElement | null;
      if (!el) {
        el = document.createElement('meta');
        document.head.appendChild(el);
      }
      for (const [key, value] of Object.entries(def.attrs)) {
        el.setAttribute(key, value);
      }
    }

    // --- Canonical link ---
    let canonical = document.head.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', canonicalUrl);
  }, [title, description, path, ogType]);

  return null;
}
