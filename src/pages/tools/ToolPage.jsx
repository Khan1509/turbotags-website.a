import React, { Suspense } from 'react';
import usePageMeta from '../../hooks/usePageMeta';
import Breadcrumbs from '../../components/ui/Breadcrumbs';
import ToolSchema from '../../components/schemas/ToolSchema';
import LazySection from '../../components/utils/LazySection';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

// Lazy load heavy components for better FCP/LCP
const TagGenerator = React.lazy(() => import('../../components/TagGenerator'));


const ToolPage = ({ pageConfig }) => {
  const {
    pageTitle,
    pageDescription,
    heroTitle,
    heroSubtitle,
    introContent,
    tagGeneratorProps,
    breadcrumbTrail,
    toolSchema
  } = pageConfig;

  usePageMeta(pageTitle, pageDescription);

  return (
    <>
      {toolSchema && <ToolSchema toolConfig={toolSchema} />}
      <div className="container mx-auto max-w-7xl space-y-8 px-4 py-8 sm:space-y-12 sm:px-6 md:px-8">
        <div>
          <Breadcrumbs trail={breadcrumbTrail} />
        </div>
        
        <header className="text-center">
          <h1 className="h1 font-extrabold text-tt-dark-violet">{heroTitle}</h1>
          <p className="mt-4 text-lg md:text-xl text-gray-700 max-w-3xl mx-auto">{heroSubtitle}</p>
        </header>

        <section className="bg-white p-6 rounded-xl shadow-md">
          <div className="prose prose-lg max-w-none text-gray-800 leading-relaxed">
            {introContent}
          </div>
        </section>
        
        <LazySection threshold={0.2}>
          <Suspense fallback={
            <div className="min-h-96 flex items-center justify-center">
              <LoadingSpinner size="large" ariaLabel="Loading tag generator..." />
            </div>
          }>
            <TagGenerator {...tagGeneratorProps} />
          </Suspense>
        </LazySection>
      </div>
    </>
  );
};

export default ToolPage;
