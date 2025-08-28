import React from 'react';
import { Link } from 'react-router-dom';
import { AlertTriangle, Home } from 'lucide-react';
import usePageMeta from '../hooks/usePageMeta';

const NotFoundPage = () => {
  usePageMeta('404: Page Not Found - TurboTags', 'The page you are looking for does not exist.');

  return (
    <div className="flex flex-col items-center justify-center text-center py-20 px-4">
      <AlertTriangle className="h-24 w-24 text-yellow-500 mb-4" />
      <h1 className="text-6xl font-extrabold text-tt-dark-violet mb-2">404</h1>
      <h2 className="text-3xl font-bold text-gray-800 mb-4">Page Not Found</h2>
      <p className="text-gray-600 mb-8 max-w-md">
        Oops! The page you're looking for seems to have gone on a vacation. Let's get you back home.
      </p>
      <Link
        to="/"
        className="btn-primary"
      >
        <Home className="mr-2 h-5 w-5" />
        Go to Homepage
      </Link>
    </div>
  );
};

export default NotFoundPage;
