import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';
import BreadcrumbSchema from '../schemas/BreadcrumbSchema';

const Breadcrumbs = ({ trail }) => {
  if (!trail || trail.length === 0) {
    return null;
  }

  return (
    <>
      <BreadcrumbSchema trail={trail} />
      <nav aria-label="Breadcrumb" className="bg-gray-50 px-4 py-2 rounded-lg border border-gray-200">
        <ol className="flex items-center space-x-2 text-sm text-gray-500">
          <li>
            <Link to="/" className="flex items-center hover:text-tt-dark-violet transition-colors" title="Go to Homepage">
              <Home className="h-4 w-4" />
              <span className="sr-only">Home</span>
            </Link>
          </li>
          {trail.map((item, index) => (
            <li key={index} className="flex items-center">
              <ChevronRight className="h-4 w-4 text-gray-400" />
              {index === trail.length - 1 ? (
                <span className="font-semibold text-gray-700 ml-2" aria-current="page">
                  {item.name}
                </span>
              ) : (
                <Link to={item.path} className="ml-2 hover:text-tt-dark-violet transition-colors">
                  {item.name}
                </Link>
              )}
            </li>
          ))}
        </ol>
      </nav>
    </>
  );
};

export default Breadcrumbs;
