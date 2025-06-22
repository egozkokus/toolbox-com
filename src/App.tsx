import { Suspense } from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "@/contexts/LanguageContext";
import ErrorBoundary from "@/components/ErrorBoundary";
import { LoadingSpinner } from "@/components/LazyLoader";
import ScrollToTop from '@/components/common/ScrollToTop';

// --- Import the new Layout ---
import MainLayout from '@/components/layout/MainLayout';

import {
  Index,
  About,
  Contact,
  PrivacyPolicy,
  NotFound,
  TextTools,
  Calculators,
  ImageTools,
  VideoTools,
  AudioTools,
  DeveloperTools,
  Generators,
  PDFTools,
  createLazyToolRoutes
} from "@/routes/lazyRoutes";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (failureCount, error) => {
        if (error instanceof Error && error.message.includes('4')) {
          return false;
        }
        return failureCount < 3;
      },
      staleTime: 5 * 60 * 1000,
      cacheTime: 10 * 60 * 1000,
    },
  },
});

const App = () => {
  const toolRoutes = createLazyToolRoutes();

  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <LanguageProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <ScrollToTop />
              <Suspense fallback={<LoadingSpinner />}>
                <Routes>
                  {/* Wrap all your routes inside the MainLayout component */}
                  <Route path="/" element={<MainLayout />}>
                    {/* Main pages will now render inside the layout */}
                    <Route index element={<Index />} />
                    <Route path="about" element={<About />} />
                    <Route path="contact" element={<Contact />} />
                    <Route path="privacy-policy" element={<PrivacyPolicy />} />

                    {/* Category pages */}
                    <Route path="categories/text-tools" element={<TextTools />} />
                    <Route path="categories/calculators" element={<Calculators />} />
                    <Route path="categories/image-tools" element={<ImageTools />} />
                    <Route path="categories/video-tools" element={<VideoTools />} />
                    <Route path="categories/audio-tools" element={<AudioTools />} />
                    <Route path="categories/developer-tools" element={<DeveloperTools />} />
                    <Route path="categories/generators" element={<Generators />} />
                    <Route path="categories/pdf-tools" element={<PDFTools />} />

                    {/* Tool routes - dynamically loaded */}
                    {toolRoutes.map((route) => (
                      <Route key={route.path} path={route.path} element={route.element} />
                    ))}
                  </Route>

                  {/* 404 - This route stays outside the layout if you want a different design for it */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Suspense>
            </BrowserRouter>
          </TooltipProvider>
        </LanguageProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
};

export default App;