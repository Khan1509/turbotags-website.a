import React from 'react';

const BreadcrumbSchema = ({ trail }) => {
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": trail.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      "item": `https://turbotags.app${item.path}`
    }))
  };

  return (
    <script type="application/ld+json">
      {JSON.stringify(breadcrumbJsonLd)}
    </script>
  );
};

export default BreadcrumbSchema;
