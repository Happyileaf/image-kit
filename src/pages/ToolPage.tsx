import { useParams, useLocation, Navigate } from 'react-router-dom';
import { useI18n } from '../i18n/context';
import { Seo } from '../components/seo/Seo';
import { ToolWorkspace } from '../components/tools/ToolWorkspace';
import { getToolMeta, getToolJsonLd } from '../constants/seo';

interface ToolPageLocationState {
  initialFiles?: File[];
}

export function ToolPage() {
  const { toolId } = useParams<{ toolId: string }>();
  const location = useLocation();
  const { getToolById, language } = useI18n();

  const tool = toolId ? getToolById(toolId as any) : undefined;

  // Invalid or unavailable tool → redirect to home
  if (!tool || !tool.isAvailable) {
    return <Navigate to="/" replace />;
  }

  const state = location.state as ToolPageLocationState | null;
  const initialFiles = state?.initialFiles ?? [];

  const meta = getToolMeta(tool);

  return (
    <>
      <Seo
        title={meta.title}
        description={meta.description}
        path={`/tools/${tool.id}`}
        jsonLd={getToolJsonLd(tool, language)}
      />
      <ToolWorkspace
        tool={tool}
        initialFiles={initialFiles}
      />
    </>
  );
}
