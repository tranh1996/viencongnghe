import React from 'react';
import { Helmet } from 'react-helmet-async';
import { SEOConfig } from '../utils/seo';

interface SEOProps {
  config: SEOConfig;
  structuredData?: object;
}

const SEO: React.FC<SEOProps> = ({ config, structuredData }) => {
  const {
    title,
    description,
    keywords,
    canonical,
    ogImage,
    ogType = 'website',
    twitterCard = 'summary_large_image',
    noIndex = false
  } = config;

  const baseUrl = process.env.REACT_APP_BASE_URL || 'https://viencongnghe.com';
  const fullCanonicalUrl = canonical || baseUrl;

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords.join(', ')} />
      <link rel="canonical" href={fullCanonicalUrl} />
      
      {/* Robots Meta */}
      {noIndex && <meta name="robots" content="noindex, nofollow" />}
      {!noIndex && <meta name="robots" content="index, follow" />}
      
      {/* Open Graph Meta Tags */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={fullCanonicalUrl} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:site_name" content="Viện Công nghệ (RITM)" />
      <meta property="og:locale" content="vi_VN" />
      
      {/* Twitter Card Meta Tags */}
      <meta name="twitter:card" content={twitterCard} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />
      <meta name="twitter:site" content="@viencongnghe" />
      
      {/* Additional Meta Tags */}
      <meta name="author" content="Viện Công nghệ (RITM)" />
      <meta name="language" content="Vietnamese" />
      <meta name="geo.region" content="VN" />
      <meta name="geo.country" content="Vietnam" />
      
      {/* Mobile Meta Tags */}
      <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
      <meta name="theme-color" content="#0d6efd" />
      <meta name="msapplication-TileColor" content="#0d6efd" />
      
      {/* Structured Data */}
      {structuredData && (
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      )}
      
      {/* Organization Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "ResearchOrganization",
          "name": "Viện Công nghệ (RITM)",
          "alternateName": "Research Institute of Technology for Machinery",
          "description": "Viện nghiên cứu công nghệ cơ khí hàng đầu Việt Nam",
          "url": baseUrl,
          "logo": `${baseUrl}/images/logo.svg`,
          "image": `${baseUrl}/images/about/01.jpg`,
          "address": {
            "@type": "PostalAddress",
            "addressCountry": "VN",
            "addressRegion": "Hà Nội"
          },
          "contactPoint": {
            "@type": "ContactPoint",
            "contactType": "customer service",
            "availableLanguage": ["Vietnamese", "English"]
          },
          "sameAs": [
            "https://www.facebook.com/viencongnghe",
            "https://www.linkedin.com/company/viencongnghe"
          ],
          "foundingDate": "1970",
          "areaServed": "Vietnam",
          "serviceType": [
            "Công nghệ đúc",
            "Nhiệt luyện",
            "Gia công cơ khí",
            "Kiểm định vật liệu",
            "Chuyển giao công nghệ"
          ]
        })}
      </script>
    </Helmet>
  );
};

export default SEO;
