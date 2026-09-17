import { useEffect } from 'react';
import { createBrowserRouter, RouterProvider, Outlet, useLocation } from 'react-router-dom';
import { I18nProvider } from './i18n/context';
import { ThemeProvider } from './theme/context';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { HomePage } from './pages/HomePage';
import { ToolPage } from './pages/ToolPage';
import { AboutPage } from './components/pages/AboutPage';
import { PrivacyPage } from './components/pages/PrivacyPage';
import { NotFoundPage } from './pages/NotFoundPage';

/**
 * 全局布局：Navbar + 页面内容 + Footer
 * 路由切换时自动滚动到顶部
 */
function AppLayout() {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col bg-stone-50 dark:bg-stone-950 text-stone-900 dark:text-stone-100 selection:bg-stone-900 selection:text-white dark:selection:bg-stone-100 dark:selection:text-stone-900 font-sans antialiased transition-colors duration-150">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'tools/:toolId', element: <ToolPage /> },
      { path: 'about', element: <AboutPage /> },
      { path: 'privacy', element: <PrivacyPage /> },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
]);

export default function App() {
  return (
    <ThemeProvider>
      <I18nProvider>
        <RouterProvider router={router} />
      </I18nProvider>
    </ThemeProvider>
  );
}
