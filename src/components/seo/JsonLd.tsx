import { useEffect } from 'react';

interface JsonLdProps {
  data: Record<string, unknown> | Record<string, unknown>[];
}

/**
 * 直接向 <head> 注入 JSON-LD 结构化数据 script 标签。
 * 比 react-helmet-async 的 script prop 更可靠。
 */
export function JsonLd({ data }: JsonLdProps) {
  useEffect(() => {
    const id = 'jsonld-structured-data';
    const existing = document.getElementById(id);
    const content = JSON.stringify(data);

    if (existing) {
      existing.textContent = content;
      return;
    }

    const script = document.createElement('script');
    script.id = id;
    script.type = 'application/ld+json';
    script.textContent = content;
    document.head.appendChild(script);

    return () => {
      const el = document.getElementById(id);
      if (el) el.remove();
    };
  }, [data]);

  return null;
}
