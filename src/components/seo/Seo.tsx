import { MetaTags } from './MetaTags';
import { JsonLd } from './JsonLd';

interface SeoProps {
  title: string;
  description: string;
  path?: string;
  ogType?: 'website' | 'article';
  jsonLd?: Record<string, unknown> | Record<string, unknown>[];
}

export function Seo({
  title,
  description,
  path = '/',
  ogType = 'website',
  jsonLd,
}: SeoProps) {
  return (
    <>
      <MetaTags
        title={title}
        description={description}
        path={path}
        ogType={ogType}
      />
      {jsonLd && <JsonLd data={jsonLd} />}
    </>
  );
}
