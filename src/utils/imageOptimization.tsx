// src/utils/imageOptimization.ts

interface ImageOptimizationOptions {
    maxWidth?: number;
    maxHeight?: number;
    quality?: number;
    format?: 'webp' | 'jpeg' | 'png';
  }
  
  export class ImageOptimizer {
    private static readonly DEFAULT_QUALITY = 0.85;
    private static readonly DEFAULT_MAX_SIZE = 2048;
  
    // Convert image to optimized format
    static async optimizeImage(
      file: File,
      options: ImageOptimizationOptions = {}
    ): Promise<Blob> {
      const {
        maxWidth = this.DEFAULT_MAX_SIZE,
        maxHeight = this.DEFAULT_MAX_SIZE,
        quality = this.DEFAULT_QUALITY,
        format = 'webp'
      } = options;
  
      return new Promise((resolve, reject) => {
        const img = new Image();
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
  
        if (!ctx) {
          reject(new Error('Failed to get canvas context'));
          return;
        }
  
        img.onload = () => {
          // Calculate new dimensions
          const { width, height } = this.calculateDimensions(
            img.width,
            img.height,
            maxWidth,
            maxHeight
          );
  
          // Set canvas dimensions
          canvas.width = width;
          canvas.height = height;
  
          // Draw resized image
          ctx.drawImage(img, 0, 0, width, height);
  
          // Convert to blob
          canvas.toBlob(
            (blob) => {
              if (blob) {
                resolve(blob);
              } else {
                reject(new Error('Failed to convert canvas to blob'));
              }
            },
            `image/${format}`,
            quality
          );
        };
  
        img.onerror = () => reject(new Error('Failed to load image'));
        img.src = URL.createObjectURL(file);
      });
    }
  
    // Calculate dimensions maintaining aspect ratio
    private static calculateDimensions(
      originalWidth: number,
      originalHeight: number,
      maxWidth: number,
      maxHeight: number
    ): { width: number; height: number } {
      if (originalWidth <= maxWidth && originalHeight <= maxHeight) {
        return { width: originalWidth, height: originalHeight };
      }
  
      const aspectRatio = originalWidth / originalHeight;
  
      let width = maxWidth;
      let height = maxWidth / aspectRatio;
  
      if (height > maxHeight) {
        height = maxHeight;
        width = maxHeight * aspectRatio;
      }
  
      return { width: Math.round(width), height: Math.round(height) };
    }
  
    // Create responsive image srcset
    static createSrcSet(
      baseUrl: string,
      sizes: number[] = [320, 640, 1024, 1920]
    ): string {
      return sizes
        .map(size => `${baseUrl}?w=${size} ${size}w`)
        .join(', ');
    }
  
    // Lazy load images with Intersection Observer
    static lazyLoadImages(selector: string = 'img[data-lazy]') {
      if ('IntersectionObserver' in window) {
        const images = document.querySelectorAll<HTMLImageElement>(selector);
        
        const imageObserver = new IntersectionObserver((entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              const img = entry.target as HTMLImageElement;
              const src = img.getAttribute('data-src');
              
              if (src) {
                img.src = src;
                img.removeAttribute('data-src');
                img.removeAttribute('data-lazy');
                imageObserver.unobserve(img);
              }
            }
          });
        });
  
        images.forEach(img => imageObserver.observe(img));
  
        return () => imageObserver.disconnect();
      }
    }
  
    // Preload critical images
    static preloadImages(urls: string[]) {
      urls.forEach(url => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'image';
        link.href = url;
        document.head.appendChild(link);
      });
    }
  
    // Convert image to base64 (for small images)
    static async imageToBase64(file: File): Promise<string> {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
    }
  
    // Check if image format is supported
    static isFormatSupported(format: string): boolean {
      const canvas = document.createElement('canvas');
      canvas.width = canvas.height = 1;
      const dataUrl = canvas.toDataURL(`image/${format}`);
      return dataUrl.indexOf(`image/${format}`) === 5;
    }
  
    // Get optimal image format
    static getOptimalFormat(): 'webp' | 'jpeg' | 'png' {
      if (this.isFormatSupported('webp')) {
        return 'webp';
      }
      return 'jpeg';
    }
  }
  
  // React component for optimized images
  import React, { useState, useEffect, useRef } from 'react';
  
  interface OptimizedImageProps {
    src: string;
    alt: string;
    className?: string;
    sizes?: string;
    loading?: 'lazy' | 'eager';
    onLoad?: () => void;
    onError?: () => void;
  }
  
  export const OptimizedImage: React.FC<OptimizedImageProps> = ({
    src,
    alt,
    className = '',
    sizes = '100vw',
    loading = 'lazy',
    onLoad,
    onError
  }) => {
    const [isLoaded, setIsLoaded] = useState(false);
    const [hasError, setHasError] = useState(false);
    const imgRef = useRef<HTMLImageElement>(null);
  
    useEffect(() => {
      if (loading === 'lazy' && imgRef.current) {
        const cleanup = ImageOptimizer.lazyLoadImages(`img[data-lazy="${src}"]`);
        return cleanup;
      }
    }, [src, loading]);
  
    const handleLoad = () => {
      setIsLoaded(true);
      onLoad?.();
    };
  
    const handleError = () => {
      setHasError(true);
      onError?.();
    };
  
    if (hasError) {
      return (
        <div className={`bg-gray-200 flex items-center justify-center ${className}`}>
          <span className="text-gray-500">Failed to load image</span>
        </div>
      );
    }
  
    return (
      <>
        {!isLoaded && (
          <div className={`bg-gray-200 animate-pulse ${className}`} />
        )}
        <img
          ref={imgRef}
          src={loading === 'eager' ? src : undefined}
          data-src={loading === 'lazy' ? src : undefined}
          data-lazy={loading === 'lazy' ? src : undefined}
          alt={alt}
          className={`${className} ${isLoaded ? '' : 'hidden'}`}
          sizes={sizes}
          loading={loading}
          onLoad={handleLoad}
          onError={handleError}
        />
      </>
    );
  };