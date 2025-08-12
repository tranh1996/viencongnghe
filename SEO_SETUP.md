# SEO Setup Guide - Viện Công nghệ (RITM) Website

## Overview

This guide explains how to set up and configure the comprehensive SEO system implemented for the Viện Công nghệ (RITM) website.

## Features Implemented

### ✅ SEO Optimizations
- **Meta Tags**: Title, description, keywords for each page
- **Open Graph**: Social media sharing optimization
- **Twitter Cards**: Twitter sharing optimization
- **Canonical URLs**: Automatic canonical URL generation
- **Structured Data**: JSON-LD schema markup
- **Heading Structure**: Proper H1, H2, H3 hierarchy
- **Image Optimization**: Automatic ALT tags and titles

### ✅ Server-Side Rendering Support
- **React Helmet Async**: Dynamic meta tag management
- **SEO Component**: Centralized SEO management
- **Page-specific SEO**: Individual SEO configs for each page

### ✅ Google Analytics
- **GA4 Integration**: Modern Google Analytics 4 setup
- **Event Tracking**: Custom event tracking for images and interactions
- **Page View Tracking**: Automatic page view tracking

### ✅ Sitemap Generation
- **Automatic Sitemap**: XML sitemap generation
- **Robots.txt**: Search engine crawling instructions
- **Sitemap Index**: Support for multiple sitemaps

## Setup Instructions

### 1. Install Dependencies

```bash
npm install react-helmet-async react-ga4
```

### 2. Environment Configuration

Create a `.env` file in the root directory:

```env
# Base URL for the website
REACT_APP_BASE_URL=https://viencongnghe.com

# Google Analytics 4 Measurement ID
REACT_APP_GA_MEASUREMENT_ID=G-XXXXXXXXXX

# Environment
NODE_ENV=production
```

### 3. Google Analytics Setup

1. **Create GA4 Property**:
   - Go to [Google Analytics](https://analytics.google.com/)
   - Create a new GA4 property for your website
   - Get your Measurement ID (format: G-XXXXXXXXXX)

2. **Configure Environment Variable**:
   - Add your Measurement ID to the `.env` file
   - Replace `G-XXXXXXXXXX` with your actual ID

3. **Verify Installation**:
   - Check browser console for GA initialization messages
   - Verify page views are being tracked in GA4 dashboard

### 4. Generate Sitemap

```bash
npm run generate-sitemap
```

This will create:
- `public/sitemap.xml` - Main sitemap
- `public/robots.txt` - Robots file
- `public/sitemap-index.xml` - Sitemap index

### 5. SEO Configuration

#### Page-Specific SEO

Each page has its own SEO configuration in `src/utils/seo.ts`:

```typescript
export const PAGE_SEO_DATA: PageSEOData = {
  home: {
    title: 'Viện Công nghệ (RITM) - Nghiên cứu & Phát triển Công nghệ Cơ khí',
    description: 'Viện Công nghệ (RITM) - Đơn vị nghiên cứu công nghệ cơ khí hàng đầu Việt Nam...',
    keywords: ['viện công nghệ', 'RITM', 'nghiên cứu cơ khí', ...],
    canonical: `${BASE_URL}/`,
    ogImage: `${BASE_URL}/images/banner/01.jpg`
  },
  // ... other pages
};
```

#### Using SEO Component

Add SEO component to any page:

```tsx
import SEO from '../components/SEO';
import { getSEOConfig } from '../utils/seo';

const MyPage: React.FC = () => {
  return (
    <>
      <SEO config={getSEOConfig('pageName')} />
      {/* Page content */}
    </>
  );
};
```

### 6. Image Optimization

Use the `OptimizedImage` component for automatic ALT tag generation:

```tsx
import OptimizedImage from '../components/OptimizedImage';

<OptimizedImage 
  src="/images/about/01.jpg" 
  alt="Custom alt text"
  context="Page context for better alt generation"
  className="my-class"
/>
```

## File Structure

```
src/
├── components/
│   ├── SEO.tsx                 # SEO component with meta tags
│   ├── GoogleAnalytics.tsx     # GA4 integration
│   └── OptimizedImage.tsx      # Image optimization component
├── utils/
│   └── seo.ts                  # SEO configurations and utilities
└── pages/
    ├── Home.tsx               # Example: SEO-optimized home page
    └── About.tsx              # Example: SEO-optimized about page

scripts/
└── generate-sitemap.js        # Sitemap generation script

public/
├── sitemap.xml               # Generated sitemap
├── robots.txt                # Generated robots file
└── sitemap-index.xml         # Generated sitemap index
```

## SEO Best Practices Implemented

### 1. Meta Tags
- **Title**: Unique, descriptive titles for each page
- **Description**: Compelling descriptions under 160 characters
- **Keywords**: Relevant keywords for Vietnamese market
- **Canonical**: Prevents duplicate content issues

### 2. Open Graph
- **og:title**: Page title for social sharing
- **og:description**: Page description for social sharing
- **og:image**: Featured image for social sharing
- **og:type**: Content type (website, article, etc.)

### 3. Structured Data
- **Organization Schema**: Company information
- **WebPage Schema**: Page-specific information
- **ResearchOrganization**: Specialized schema for research institutes

### 4. Heading Structure
- **H1**: One per page, main topic
- **H2**: Section headings
- **H3**: Subsection headings
- **Proper hierarchy**: Logical heading flow

### 5. Image Optimization
- **ALT tags**: Descriptive alternative text
- **Titles**: Helpful tooltips
- **Context-aware**: Automatic generation based on image path and context

## Monitoring and Analytics

### Google Analytics Events

The system tracks these events automatically:
- **Page Views**: All page navigation
- **Image Loads**: Successful image loads
- **Image Errors**: Failed image loads
- **Image Clicks**: User interaction with images

### Custom Event Tracking

Track custom events:

```tsx
// Track button clicks
if ((window as any).trackEvent) {
  (window as any).trackEvent('Button', 'Click', 'Contact Form');
}

// Track form submissions
if ((window as any).trackEvent) {
  (window as any).trackEvent('Form', 'Submit', 'Contact Form');
}
```

## Performance Optimization

### 1. Lazy Loading
- Images load lazily by default
- Reduces initial page load time

### 2. Preconnect
- Preconnects to external domains
- Improves font and resource loading

### 3. Optimized Meta Tags
- Efficient meta tag management
- Minimal overhead

## Troubleshooting

### Common Issues

1. **GA4 Not Tracking**:
   - Check Measurement ID in `.env` file
   - Verify GA4 property is active
   - Check browser console for errors

2. **Sitemap Not Generated**:
   - Ensure Node.js is installed
   - Check file permissions
   - Verify BASE_URL in environment

3. **SEO Tags Not Updating**:
   - Clear browser cache
   - Check React Helmet implementation
   - Verify component imports

### Debug Mode

Enable debug mode for development:

```env
NODE_ENV=development
```

This will show GA4 debug information in the console.

## Maintenance

### Regular Tasks

1. **Update SEO Content**:
   - Review and update page descriptions
   - Add new keywords as needed
   - Update structured data

2. **Monitor Analytics**:
   - Check GA4 dashboard regularly
   - Review page performance
   - Analyze user behavior

3. **Regenerate Sitemap**:
   - Run `npm run generate-sitemap` after content updates
   - Submit new sitemap to search engines

4. **Image Optimization**:
   - Review and update image ALT tags
   - Optimize image file sizes
   - Update image context as needed

## Support

For technical support or questions about the SEO implementation, please refer to:
- React Helmet Async documentation
- Google Analytics 4 documentation
- Schema.org structured data guidelines
