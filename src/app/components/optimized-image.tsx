import { useState } from 'react';
import { getImageWithFallback } from '../utils/image-placeholders';

interface OptimizedImageProps {
  src: string | undefined;
  alt: string;
  className?: string;
  type?: 'movie' | 'banner' | 'actor' | 'avatar' | 'backdrop';
  index?: number | string;
  loading?: 'lazy' | 'eager';
  onLoad?: () => void;
  onError?: () => void;
  // Metadata for rich placeholders
  title?: string;
  subtitle?: string;
  year?: number;
  rating?: number;
}

export function OptimizedImage({
  src,
  alt,
  className = '',
  type = 'movie',
  index = 0,
  loading = 'lazy',
  onLoad,
  onError,
  title,
  subtitle,
  year,
  rating,
}: OptimizedImageProps) {
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const handleError = () => {
    setImageError(true);
    onError?.();
  };

  const handleLoad = () => {
    setImageLoaded(true);
    onLoad?.();
  };

  // Use fallback if no src or error occurred
  const imageSrc = imageError || !src
    ? getImageWithFallback(undefined, type, index, {
        title: title || alt,
        subtitle,
        year,
        rating,
      })
    : src;

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {/* Loading skeleton */}
      {!imageLoaded && (
        <div className="absolute inset-0 bg-gradient-to-br from-muted to-muted/50 animate-pulse" />
      )}

      {/* Actual image */}
      <img
        src={imageSrc}
        alt={alt}
        className={`w-full h-full object-cover transition-opacity duration-500 ${
          imageLoaded ? 'opacity-100' : 'opacity-0'
        }`}
        loading={loading}
        onLoad={handleLoad}
        onError={handleError}
      />
    </div>
  );
}
