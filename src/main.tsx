// main.tsx - Tools4Anything Entry Point
// Implements all required systems: monitoring, PWA, error handling, etc.

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import './design-system.css'; // Import the design system
import ErrorBoundary from './components/ErrorBoundary';
import webVitalsMonitor from './lib/webVitalsMonitor';
import securityHeadersManager from './lib/securityHeaders';

// Check browser compatibility
const checkBrowserCompatibility = (): boolean => {
  const required = [
    'Promise' in window,
    'fetch' in window,
    'IntersectionObserver' in window,
    'CSS' in window && 'supports' in window.CSS
  ];
  
  return required.every(feature => feature);
};

// Initialize performance monitoring
const initializeMonitoring = () => {
  // Web Vitals monitoring is already initialized in webVitalsMonitor
  console.log('[Monitoring] Web Vitals monitoring active');
  
  // Log initial page load metrics
  window.addEventListener('load', () => {
    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    
    if (navigation) {
      window.gtag?.('event', 'page_load_time', {
        event_category: 'Performance',
        value: Math.round(navigation.loadEventEnd - navigation.fetchStart),
        page_path: window.location.pathname
      });
    }
  });
};

// Register Service Worker
const registerServiceWorker = async () => {
  if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
    try {
      const registration = await navigator.serviceWorker.register('/service-worker.js', {
        scope: '/'
      });
      
      console.log('[SW] Registration successful:', registration.scope);
      
      // Check for updates every hour
      setInterval(() => {
        registration.update();
      }, 60 * 60 * 1000);
      
      // Handle updates
      registration.addEventListener('updatefound', () => {
        const newWorker = registration.installing;
        if (!newWorker) return;
        
        newWorker.addEventListener('statechange', () => {
          if (newWorker.state === 'activated' && navigator.serviceWorker.controller) {
            // New service worker activated, show update notification
            showUpdateNotification();
          }
        });
      });
      
    } catch (error) {
      console.error('[SW] Registration failed:', error);
    }
  }
};

// Show update notification
const showUpdateNotification = () => {
  const notification = document.createElement('div');
  notification.className = 'fixed bottom-4 right-4 bg-blue-600 text-white p-4 rounded-lg shadow-lg z-50 flex items-center gap-3';
  notification.innerHTML = `
    <span>עדכון חדש זמין! 🎉</span>
    <button onclick="window.location.reload()" class="bg-white text-blue-600 px-3 py-1 rounded hover:bg-gray-100">
      רענן
    </button>
  `;
  document.body.appendChild(notification);
  
  // Auto-remove after 10 seconds
  setTimeout(() => {
    notification.remove();
  }, 10000);
};

// Initialize A11y features
const initializeAccessibility = () => {
  // Skip links handler
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Tab') {
      document.body.classList.add('keyboard-navigation');
    }
  });
  
  document.addEventListener('mousedown', () => {
    document.body.classList.remove('keyboard-navigation');
  });
  
  // Announce route changes for screen readers
  const announcer = document.createElement('div');
  announcer.setAttribute('aria-live', 'polite');
  announcer.setAttribute('aria-atomic', 'true');
  announcer.className = 'sr-only';
  announcer.id = 'route-announcer';
  document.body.appendChild(announcer);
};

// Handle offline/online events
const handleConnectivity = () => {
  const updateOnlineStatus = () => {
    const status = navigator.onLine ? 'online' : 'offline';
    document.body.setAttribute('data-connection', status);
    
    if (!navigator.onLine) {
      showOfflineNotification();
    }
  };
  
  window.addEventListener('online', updateOnlineStatus);
  window.addEventListener('offline', updateOnlineStatus);
  updateOnlineStatus();
};

const showOfflineNotification = () => {
  const notification = document.createElement('div');
  notification.className = 'fixed top-4 right-4 bg-gray-800 text-white p-4 rounded-lg shadow-lg z-50';
  notification.innerHTML = `
    <div class="flex items-center gap-2">
      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 5.636a9 9 0 010 12.728m0 0l-2.829-2.829m2.829 2.829L21 21M15.536 8.464a5 5 0 010 7.072m0 0l-2.829-2.829m-4.243 2.829a4.978 4.978 0 01-1.414-2.83m-1.414 5.658a9 9 0 01-2.167-9.238m7.824 2.167a1 1 0 111.414 1.414m-1.414-1.414L3 3m8.293 8.293l1.414 1.414"></path>
      </svg>
      <span>אתה במצב לא מקוון - חלק מהתכונות עשויות להיות מוגבלות</span>
    </div>
  `;
  document.body.appendChild(notification);
  
  setTimeout(() => {
    notification.remove();
  }, 5000);
};

// Initialize theme management
const initializeTheme = () => {
  const savedTheme = localStorage.getItem('theme') || 'light';
  document.documentElement.setAttribute('data-theme', savedTheme);
  
  // Listen for theme changes
  window.addEventListener('storage', (e) => {
    if (e.key === 'theme' && e.newValue) {
      document.documentElement.setAttribute('data-theme', e.newValue);
    }
  });
};

// Main initialization
const initialize = async () => {
  // Check browser compatibility
  if (!checkBrowserCompatibility()) {
    document.body.innerHTML = `
      <div class="min-h-screen flex items-center justify-center p-4">
        <div class="text-center">
          <h1 class="text-2xl font-bold mb-4">הדפדפן שלך אינו נתמך 😕</h1>
          <p class="text-gray-600 mb-4">אנא שדרג לגרסה חדשה יותר של הדפדפן שלך</p>
          <a href="https://browsehappy.com/" class="text-blue-600 hover:underline">
            למידע נוסף על שדרוג הדפדפן
          </a>
        </div>
      </div>
    `;
    return;
  }
  
  // Initialize all systems
  initializeTheme();
  initializeMonitoring();
  initializeAccessibility();
  handleConnectivity();
  
  // Register service worker
  await registerServiceWorker();
  
  // Mount React app
  const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
  );
  
  root.render(
    <React.StrictMode>
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
    </React.StrictMode>
  );
  
  // Log successful initialization
  console.log('[App] Tools4Anything initialized successfully');
  
  // Send initialization event
  window.gtag?.('event', 'app_initialized', {
    event_category: 'System',
    app_version: '2.0.0',
    browser: navigator.userAgent
  });
};

// Start the app
initialize().catch(error => {
  console.error('[App] Failed to initialize:', error);
  
  // Show error screen
  document.body.innerHTML = `
    <div class="min-h-screen flex items-center justify-center p-4">
      <div class="text-center">
        <h1 class="text-2xl font-bold mb-4 text-red-600">שגיאה בטעינת האתר</h1>
        <p class="text-gray-600 mb-4">מצטערים, משהו השתבש. אנא נסה לרענן את הדף.</p>
        <button onclick="window.location.reload()" class="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">
          רענן את הדף
        </button>
      </div>
    </div>
  `;
});

// Export for testing
export { initialize, checkBrowserCompatibility };