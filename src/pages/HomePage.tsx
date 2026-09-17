import { useNavigate } from 'react-router-dom';
import { ToolId } from '../types';
import { useI18n } from '../i18n/context';
import { Seo } from '../components/seo/Seo';
import { Hero } from '../components/home/Hero';
import { ToolsGrid } from '../components/home/ToolsGrid';
import { HOME_META, getHomeJsonLd } from '../constants/seo';
import { createSamplePhoto } from '../utils/imageProcessor';

export function HomePage() {
  const navigate = useNavigate();
  const { language } = useI18n();

  const handleSelectTool = (toolId: ToolId) => {
    navigate(`/tools/${toolId}`);
  };

  const handleTrySample = async () => {
    try {
      const sample = await createSamplePhoto('mountain');
      navigate(`/tools/compress`, { state: { initialFiles: [sample] } });
    } catch (err) {
      console.error('Failed generating sample:', err);
      navigate(`/tools/compress`);
    }
  };

  return (
    <>
      <Seo
        title={HOME_META[language].title}
        description={HOME_META[language].description}
        path="/"
        jsonLd={getHomeJsonLd(language)}
      />
      <Hero onSelectTool={handleSelectTool} onTrySample={handleTrySample} />
      <ToolsGrid onSelectTool={handleSelectTool} />
    </>
  );
}
