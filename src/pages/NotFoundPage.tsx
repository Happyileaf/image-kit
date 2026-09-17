import { Link } from 'react-router-dom';
import { Home } from 'lucide-react';
import { Seo } from '../components/seo/Seo';
import { NOT_FOUND_META } from '../constants/seo';

export function NotFoundPage() {
  return (
    <>
      <Seo
        title={NOT_FOUND_META.title}
        description={NOT_FOUND_META.description}
        path="/404"
      />
      <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 py-16 text-center">
        <p className="text-7xl font-bold text-stone-900 dark:text-stone-100">404</p>
        <h1 className="mt-4 text-xl font-semibold text-stone-900 dark:text-stone-100">
          Page Not Found
        </h1>
        <p className="mt-2 max-w-md text-sm text-stone-500 dark:text-stone-400">
          The page you are looking for might have been removed, had its name
          changed, or is temporarily unavailable.
        </p>
        <Link
          to="/"
          className="mt-6 inline-flex items-center gap-2 rounded-lg bg-stone-900 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-stone-800 dark:bg-stone-100 dark:text-stone-900 dark:hover:bg-white"
        >
          <Home className="h-4 w-4" />
          <span>Back to Home</span>
        </Link>
      </div>
    </>
  );
}
