'use client';

import React from 'react';
import Image from 'next/image';
import { generateImageAlt, generateImageTitle } from '../utils/seo';

interface OptimizedImageProps {
  src: string;
  alt?: string;
  title?: string;
  context?: string;
  className?: string;
  style?: React.CSSProperties;
  loading?: 'lazy' | 'eager';
  onClick?: () => void;
  onLoad?: () => void;
  onError?: () => void;
  width?: number;
  height?: number;
  fill?: boolean;
  sizes?: string;
  priority?: boolean;
  [key: string]: any; // Allow other HTML img attributes
}

const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  title,
  context,
  className,
  style,
  loading = 'lazy',
  onClick,
  onLoad,
  onError,
  width,
  height,
  fill = false,
  sizes,
  priority = false,
  ...otherProps
}) => {
  // Generate optimized alt text and title if not provided
  const optimizedAlt = alt || generateImageAlt(src, title, context);
  const optimizedTitle = title || generateImageTitle(src, optimizedAlt);

  // Track image load events for analytics
  const handleLoad = () => {
    if (onLoad) onLoad();
    
    // Track image load event
    if ((window as any).trackEvent) {
      (window as any).trackEvent('Image', 'Load', src);
    }
  };

  const handleError = () => {
    if (onError) onError();
    
    // Track image error event
    if ((window as any).trackEvent) {
      (window as any).trackEvent('Image', 'Error', src);
    }
  };

  const handleClick = () => {
    if (onClick) onClick();
    
    // Track image click event
    if ((window as any).trackEvent) {
      (window as any).trackEvent('Image', 'Click', src);
    }
  };

  // If fill is true, use Next.js Image with fill
  if (fill) {
    return (
      <div 
        className={className} 
        style={{ position: 'relative', ...style }}
        onClick={handleClick}
      >
        <Image
          src={src}
          alt={optimizedAlt}
          title={optimizedTitle}
          fill
          sizes={sizes}
          priority={priority}
          onLoad={handleLoad}
          onError={handleError}
          {...otherProps}
        />
      </div>
    );
  }

  // Use Next.js Image with width and height
  return (
    <Image
      src={src}
      alt={optimizedAlt}
      title={optimizedTitle}
      width={width || 800}
      height={height || 600}
      className={className}
      style={style}
      loading={loading}
      priority={priority}
      onClick={handleClick}
      onLoad={handleLoad}
      onError={handleError}
      {...otherProps}
    />
  );
};

export default OptimizedImage;
