import React from 'react';
import { Helmet } from 'react-helmet-async';
import {
  SITE_NAME,
  SITE_URL,
  DEFAULT_OG_IMAGE,
} from '../config/seo';

export interface SeoProps {
  title: string;
  description: string;
  image?: string;
  canonical?: string;
  type?: 'website' | 'article';
  jsonLd?: object | object[];
}

const Seo: React.FC<SeoProps> = ({
  title,
  description,
  image,
  canonical,
  type = 'website',
  jsonLd,
}) => {
  const ogImage = image ? image : DEFAULT_OG_IMAGE;
  const canonicalUrl = canonical
    ? `${SITE_URL}${canonical.startsWith('/') ? canonical : `/${canonical}`}`
    : SITE_URL;

  const jsonLdArray = jsonLd
    ? Array.isArray(jsonLd)
      ? jsonLd
      : [jsonLd]
    : [];

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonicalUrl} />

      {/* Open Graph */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:locale" content="es_GT" />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />

      {/* JSON-LD */}
      {jsonLdArray.map((schema, index) => (
        <script type="application/ld+json" key={index}>
          {JSON.stringify(schema)}
        </script>
      ))}
    </Helmet>
  );
};

export default Seo;
