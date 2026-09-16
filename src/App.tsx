import { Fragment, useState } from 'react';
import { PageView, ToolId } from './types';
import { I18nProvider, useI18n } from './i18n/context';
import { ThemeProvider } from './theme/context';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { Hero } from './components/home/Hero';
import { ToolsGrid } from './components/home/ToolsGrid';
import { ToolWorkspace } from './components/tools/ToolWorkspace';
import { AboutPage } from './components/pages/AboutPage';
import { PrivacyPage } from './components/pages/PrivacyPage';
import { createSamplePhoto } from './utils/imageProcessor';

function AppContent() {
  const [currentView, setCurrentView] = useState<PageView>({ type: 'home' });
  const [initialFilesForTool, setInitialFilesForTool] = useState<File[]>([]);
  const { getToolById, tools } = useI18n();

  const handleNavigate = (view: PageView) => {
    setCurrentView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectTool = (toolId: ToolId, initialFiles: File[] = []) => {
    setInitialFilesForTool(initialFiles);
    setCurrentView({ type: 'tool', toolId });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleTrySampleFromHero = async () => {
    try {
      const sample = await createSamplePhoto('mountain');
      handleSelectTool('compress', [sample]);
    } catch (err) {
      console.error('Failed generating sample:', err);
      handleSelectTool('compress');
    }
  };

  const activeTool =
    currentView.type === 'tool'
      ? getToolById(currentView.toolId) || tools[0]
      : null;

  return (
    <div className="min-h-screen flex flex-col bg-stone-50 dark:bg-stone-950 text-stone-900 dark:text-stone-100 selection:bg-stone-900 selection:text-white dark:selection:bg-stone-100 dark:selection:text-stone-900 font-sans antialiased transition-colors duration-150">
      {/* Top Navbar */}
      <Navbar currentView={currentView} onNavigate={handleNavigate} />

      {/* Main Content Area */}
      <main className="flex-1">
        {currentView.type === 'home' && (
          <div>
            <Hero
              onSelectTool={handleSelectTool}
              onTrySample={handleTrySampleFromHero}
            />
            <ToolsGrid onSelectTool={handleSelectTool} />
          </div>
        )}

        {currentView.type === 'tool' && activeTool && (
          // Keyed fragment forces a full remount of the workspace when switching tools,
          // resetting all per-tool state (keyed directly on ToolWorkspace is blocked by missing @types/react)
          <Fragment key={activeTool.id}>
            <ToolWorkspace
              tool={activeTool}
              onBack={() => handleNavigate({ type: 'home' })}
              initialFiles={initialFilesForTool}
            />
          </Fragment>
        )}

        {currentView.type === 'about' && (
          <AboutPage onNavigate={handleNavigate} />
        )}

        {currentView.type === 'privacy' && (
          <PrivacyPage onNavigate={handleNavigate} />
        )}
      </main>

      {/* Bottom Footer */}
      <Footer onNavigate={handleNavigate} />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <I18nProvider>
        <AppContent />
      </I18nProvider>
    </ThemeProvider>
  );
}

