'use client';

import React, { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import ReactGA from 'react-ga4';
import { GA_CONFIG } from '../utils/seo';

const GoogleAnalytics: React.FC = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Initialize Google Analytics
    if (GA_CONFIG.measurementId && GA_CONFIG.measurementId !== 'G-XXXXXXXXXX') {
      ReactGA.initialize(GA_CONFIG.measurementId, {
        testMode: GA_CONFIG.debug,
        gaOptions: {
          siteSpeedSampleRate: 100
        }
      });
    }
  }, []);

  useEffect(() => {
    // Track page views
    if (GA_CONFIG.measurementId && GA_CONFIG.measurementId !== 'G-XXXXXXXXXX') {
      const url = pathname + (searchParams?.toString() ? `?${searchParams.toString()}` : '');
      ReactGA.send({
        hitType: 'pageview',
        page: url
      });
    }
  }, [pathname, searchParams]);

  // Custom event tracking function
  const trackEvent = (category: string, action: string, label?: string, value?: number) => {
    if (GA_CONFIG.measurementId && GA_CONFIG.measurementId !== 'G-XXXXXXXXXX') {
      ReactGA.event({
        category,
        action,
        label,
        value
      });
    }
  };

  // Expose trackEvent function globally for use in other components
  React.useEffect(() => {
    (window as any).trackEvent = trackEvent;
    return () => {
      delete (window as any).trackEvent;
    };
  }, []);

  return null; // This component doesn't render anything
};

export default GoogleAnalytics;
