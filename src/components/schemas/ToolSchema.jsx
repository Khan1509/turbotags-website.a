import React from 'react';

const ToolSchema = ({ toolConfig }) => {
  const {
    name,
    description,
    url,
    platform = "YouTube, Instagram, TikTok, Facebook",
    price = "0",
    priceCurrency = "USD",
    operatingSystem = "Any",
    applicationCategory = "WebApplication",
    functionType = "Tag and Hashtag Generation"
  } = toolConfig;

  const schemaData = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": name,
    "description": description,
    "url": url,
    "applicationCategory": applicationCategory,
    "operatingSystem": operatingSystem,
    "offers": {
      "@type": "Offer",
      "price": price,
      "priceCurrency": priceCurrency,
      "availability": "https://schema.org/InStock"
    },
    "author": {
      "@type": "Organization",
      "name": "TurboTags",
      "url": "https://turbotags.app"
    },
    "publisher": {
      "@type": "Organization",
      "name": "TurboTags",
      "url": "https://turbotags.app"
    }
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
    />
  );
};

export default ToolSchema;