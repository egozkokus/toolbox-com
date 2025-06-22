// src/components/LazyLoader.tsx

import React, { Suspense, ComponentType } from 'react';
import { Loader2 } from 'lucide-react';
import ErrorBoundary from './ErrorBoundary';

interface LazyLoaderProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  errorFallback?: React.ReactNode;
}

// Loading component
export const LoadingSpinner: React.FC<{ message?: string }> = ({ message = 'טוען...' }) => (
  <div className="flex flex-col items-center justify-center min-h-[400px] p-8">
    <Loader2 className="h-12 w-12 animate-spin text-blue-600 mb-4" />
    <p className="text-gray-600 text-lg">{message}</p>
  </div>
);

// Page loading component with skeleton
export const PageLoadingSkeleton: React.FC = () => (
  <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4">
    <div className="container mx-auto max-w-6xl">
      {/* Header skeleton */}
      <div className="mb-8 animate-pulse">
        <div className="h-10 w-32 bg-gray-300 rounded mb-6"></div>
        <div className="text-center">
          <div className="h-16 w-16 bg-gray-300 rounded-full mx-auto mb-4"></div>
          <div className="h-8 w-64 bg-gray-300 rounded mx-auto mb-2"></div>
          <div className="h-4 w-48 bg-gray-300 rounded mx-auto"></div>
        </div>
      </div>
      
      {/* Content skeleton */}
      <div className="grid gap-6 lg:grid-cols-2">
        {[1, 2].map(i => (
          <div key={i} className="bg-white rounded-lg shadow-sm p-6 animate-pulse">
            <div className="h-6 w-32 bg-gray-300 rounded mb-2"></div>
            <div className="h-4 w-48 bg-gray-300 rounded mb-4"></div>
            <div className="h-64 bg-gray-200 rounded mb-4"></div>
            <div className="h-10 bg-gray-300 rounded"></div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

// Main LazyLoader component
const LazyLoader: React.FC<LazyLoaderProps> = ({ 
  children, 
  fallback = <LoadingSpinner />,
  errorFallback 
}) => {
  return (
    <ErrorBoundary fallback={errorFallback}>
      <Suspense fallback={fallback}>
        {children}
      </Suspense>
    </ErrorBoundary>
  );
};

// HOC for lazy loading components
export function withLazyLoading<T extends ComponentType<any>>(
  importFunc: () => Promise<{ default: T }>,
  options?: {
    fallback?: React.ReactNode;
    errorFallback?: React.ReactNode;
    preload?: boolean;
  }
) {
  const LazyComponent = React.lazy(importFunc);
  
  // Preload on hover/focus
  if (options?.preload) {
    importFunc();
  }
  
  return (props: React.ComponentProps<T>) => (
    <LazyLoader 
      fallback={options?.fallback} 
      errorFallback={options?.errorFallback}
    >
      <LazyComponent {...props} />
    </LazyLoader>
  );
}

// Utility to preload components
export const preloadComponent = (
  importFunc: () => Promise<any>
) => {
  importFunc();
};

export default LazyLoader;