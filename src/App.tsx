// src/App.tsx

import { Suspense } from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "@/contexts/LanguageContext";
import ErrorBoundary from "@/components/ErrorBoundary";
import { LoadingSpinner } from "@/components/LazyLoader";
import {
  Index,
  About,
  Contact,
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
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
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
              <Suspense fallback={<LoadingSpinner />}>
                <Routes>
                  {/* Main pages */}
                  <Route path="/" element={<Index />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/contact" element={<Contact />} />
                  
                  {/* Category pages */}
                  <Route path="/categories/text-tools" element={<TextTools />} />
                  <Route path="/categories/calculators" element={<Calculators />} />
                  <Route path="/categories/image-tools" element={<ImageTools />} />
                  <Route path="/categories/video-tools" element={<VideoTools />} />
                  <Route path="/categories/audio-tools" element={<AudioTools />} />
                  <Route path="/categories/developer-tools" element={<DeveloperTools />} />
                  <Route path="/categories/generators" element={<Generators />} />
                  <Route path="/categories/pdf-tools" element={<PDFTools />} />
                  
                  {/* Tool routes - dynamically loaded */}
                  {toolRoutes.map((route) => (
                    <Route key={route.path} {...route} />
                  ))}
                  
                  {/* 404 */}
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