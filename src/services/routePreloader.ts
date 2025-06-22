// src/services/routePreloader.ts

import { toolRoutes } from '@/routes/lazyRoutes';

interface PreloadConfig {
  delay?: number;
  priority?: 'high' | 'low';
  condition?: () => boolean;
}

class RoutePreloader {
  private static instance: RoutePreloader;
  private preloadedRoutes = new Set<string>();
  private preloadQueue: Array<{ path: string; loader: () => Promise<any> }> = [];
  private isPreloading = false;

  private constructor() {
    // Start preloading after initial load
    if (typeof window !== 'undefined') {
      window.addEventListener('load', () => {
        setTimeout(() => this.startIdlePreloading(), 2000);
      });
    }
  }

  static getInstance(): RoutePreloader {
    if (!RoutePreloader.instance) {
      RoutePreloader.instance = new RoutePreloader();
    }
    return RoutePreloader.instance;
  }

  // Preload a specific route
  async preloadRoute(path: string, loader: () => Promise<any>, config?: PreloadConfig) {
    if (this.preloadedRoutes.has(path)) {
      return;
    }

    // Check condition if provided
    if (config?.condition && !config.condition()) {
      return;
    }

    // Add delay if specified
    if (config?.delay) {
      await new Promise(resolve => setTimeout(resolve, config.delay));
    }

    try {
      if (config?.priority === 'high') {
        await loader();
        this.preloadedRoutes.add(path);
      } else {
        this.preloadQueue.push({ path, loader });
        this.processQueue();
      }
    } catch (error) {
      console.error(`Failed to preload route ${path}:`, error);
    }
  }

  // Preload routes based on user interaction
  preloadOnHover(element: HTMLElement, path: string, loader: () => Promise<any>) {
    let preloadTimeout: NodeJS.Timeout;

    const startPreload = () => {
      preloadTimeout = setTimeout(() => {
        this.preloadRoute(path, loader, { priority: 'high' });
      }, 100);
    };

    const cancelPreload = () => {
      clearTimeout(preloadTimeout);
    };

    element.addEventListener('mouseenter', startPreload);
    element.addEventListener('focus', startPreload);
    element.addEventListener('mouseleave', cancelPreload);
    element.addEventListener('blur', cancelPreload);

    return () => {
      element.removeEventListener('mouseenter', startPreload);
      element.removeEventListener('focus', startPreload);
      element.removeEventListener('mouseleave', cancelPreload);
      element.removeEventListener('blur', cancelPreload);
    };
  }

  // Preload routes visible in viewport
  preloadVisibleRoutes(elements: NodeListOf<HTMLElement>) {
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              const element = entry.target as HTMLElement;
              const path = element.getAttribute('data-preload-path');
              const category = element.getAttribute('data-preload-category');
              
              if (path && category && toolRoutes[category as keyof typeof toolRoutes]) {
                const routes = toolRoutes[category as keyof typeof toolRoutes];
                const route = routes.find(r => `/tools/${r.path}` === path);
                
                if (route) {
                  this.preloadRoute(path, route.component, { delay: 500 });
                }
              }
            }
          });
        },
        { rootMargin: '50px' }
      );

      elements.forEach(element => observer.observe(element));

      return () => observer.disconnect();
    }
  }

  // Process preload queue
  private async processQueue() {
    if (this.isPreloading || this.preloadQueue.length === 0) {
      return;
    }

    this.isPreloading = true;

    while (this.preloadQueue.length > 0) {
      const { path, loader } = this.preloadQueue.shift()!;
      
      if (!this.preloadedRoutes.has(path)) {
        try {
          await loader();
          this.preloadedRoutes.add(path);
          
          // Small delay between preloads to not block main thread
          await new Promise(resolve => setTimeout(resolve, 50));
        } catch (error) {
          console.error(`Failed to preload route ${path}:`, error);
        }
      }
    }

    this.isPreloading = false;
  }

  // Intelligent preloading based on user patterns
  private startIdlePreloading() {
    if ('requestIdleCallback' in window) {
      window.requestIdleCallback(() => {
        this.preloadCommonRoutes();
      });
    } else {
      setTimeout(() => this.preloadCommonRoutes(), 5000);
    }
  }

  // Preload most commonly used routes
  private preloadCommonRoutes() {
    const commonRoutes = [
      { path: '/tools/json-formatter', component: () => import('@/pages/tools/JSONFormatter') },
      { path: '/tools/password-generator', component: () => import('@/pages/tools/PasswordGenerator') },
      { path: '/tools/qr-generator', component: () => import('@/pages/tools/QRGenerator') },
      { path: '/tools/color-picker', component: () => import('@/pages/tools/ColorPicker') },
      { path: '/tools/css-minifier', component: () => import('@/pages/tools/CSSMinifier') },
    ];

    commonRoutes.forEach(({ path, component }) => {
      this.preloadRoute(path, component, { priority: 'low' });
    });
  }

  // Get preload status
  isRoutePreloaded(path: string): boolean {
    return this.preloadedRoutes.has(path);
  }

  // Clear preloaded routes (for memory management)
  clearPreloadedRoutes() {
    this.preloadedRoutes.clear();
    this.preloadQueue = [];
  }
}

// Export singleton instance
export const routePreloader = RoutePreloader.getInstance();

// React hook for route preloading
export const useRoutePreloader = () => {
  return {
    preloadRoute: (path: string, loader: () => Promise<any>, config?: PreloadConfig) => 
      routePreloader.preloadRoute(path, loader, config),
    preloadOnHover: (element: HTMLElement, path: string, loader: () => Promise<any>) =>
      routePreloader.preloadOnHover(element, path, loader),
    isPreloaded: (path: string) => routePreloader.isRoutePreloaded(path),
  };
};