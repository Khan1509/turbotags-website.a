import React from 'react';

const FaqSchema = ({ faqData }) => {
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqData.map(item => ({
      "@type": "Question",
      "name": item.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": item.answer
      }
    }))
  };

  return (
    <script type="application/ld+json">
      {JSON.stringify(faqJsonLd)}
    </script>
  );
};

export default FaqSchema;
