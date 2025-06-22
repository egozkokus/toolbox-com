// main.tsx - Tools4Anything Entry Point
// Implements all required systems: monitoring, PWA, error handling, etc.

import './i18n';
import React, { Suspense } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import ErrorBoundary from './components/ErrorBoundary';
import webVitalsMonitor from './lib/webVitalsMonitor';
import { HelmetProvider } from 'react-helmet-async'; // <-- Import

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

// ... (שאר הפונקציות שלך כמו initializeMonitoring, registerServiceWorker וכו' נשארות כפי שהן) ...
// ... (Your existing functions like initializeMonitoring, registerServiceWorker etc. remain as they are) ...

const initializeTheme = () => {
  const savedTheme = localStorage.getItem('theme') || 'light';
  document.documentElement.setAttribute('data-theme', savedTheme);
  
  window.addEventListener('storage', (e) => {
    if (e.key === 'theme' && e.newValue) {
      document.documentElement.setAttribute('data-theme', e.newValue);
    }
  });
};

const initialize = async () => {
    if (!checkBrowserCompatibility()) {
        document.body.innerHTML = `<div class="min-h-screen flex items-center justify-center p-4"><div class="text-center"><h1 class="text-2xl font-bold mb-4">הדפדפן שלך אינו נתמך 😕</h1><p class="text-gray-600 mb-4">אנא שדרג לגרסה חדשה יותר של הדפדפן שלך</p><a href="https://browsehappy.com/" class="text-blue-600 hover:underline">למידע נוסף על שדרוג הדפדפן</a></div></div>`;
        return;
    }

    initializeTheme();
    // initializeMonitoring();
    // initializeAccessibility();
    // handleConnectivity();
    // await registerServiceWorker();

    const root = ReactDOM.createRoot(
        document.getElementById('root') as HTMLElement
    );

    root.render(
        <React.StrictMode>
            <HelmetProvider> {/* <-- Add HelmetProvider wrapper */}
                <Suspense fallback={<div className="min-h-screen flex items-center justify-center">טוען...</div>}>
                    <ErrorBoundary>
                        <App />
                    </ErrorBoundary>
                </Suspense>
            </HelmetProvider> {/* <-- Close HelmetProvider wrapper */}
        </React.StrictMode>
    );

    console.log('[App] Tools4Anything initialized successfully');

    window.gtag?.('event', 'app_initialized', {
        event_category: 'System',
        app_version: '2.0.0',
        browser: navigator.userAgent
    });
};

initialize().catch(error => {
    console.error('[App] Failed to initialize:', error);
    document.body.innerHTML = `<div class="min-h-screen flex items-center justify-center p-4"><div class="text-center"><h1 class="text-2xl font-bold mb-4 text-red-600">שגיאה בטעינת האתר</h1><p class="text-gray-600 mb-4">מצטערים, משהו השתבש. אנא נסה לרענן את הדף.</p><button onclick="window.location.reload()" class="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">רענן את הדף</button></div></div>`;
});

export { initialize, checkBrowserCompatibility };