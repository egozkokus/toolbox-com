// src/routes/lazyRoutes.tsx

import { lazy } from 'react';
import { RouteObject } from 'react-router-dom';
import { withLazyLoading, PageLoadingSkeleton } from '@/components/LazyLoader';

// Lazy load all pages
const Index = lazy(() => import('@/pages/Index'));
const About = lazy(() => import('@/pages/About'));
const Contact = lazy(() => import('@/pages/Contact'));
const NotFound = lazy(() => import('@/pages/NotFound'));
export const PrivacyPolicy = lazy(() => import('@/pages/PrivacyPolicy')); // הוסף את השורה הזו

// Category pages with lazy loading
const TextTools = withLazyLoading(
  () => import('@/pages/categories/TextTools'),
  { fallback: <PageLoadingSkeleton /> }
);

const Calculators = withLazyLoading(
  () => import('@/pages/categories/Calculators'),
  { fallback: <PageLoadingSkeleton /> }
);

const ImageTools = withLazyLoading(
  () => import('@/pages/categories/ImageTools'),
  { fallback: <PageLoadingSkeleton /> }
);

const VideoTools = withLazyLoading(
  () => import('@/pages/categories/VideoTools'),
  { fallback: <PageLoadingSkeleton /> }
);

const AudioTools = withLazyLoading(
  () => import('@/pages/categories/AudioTools'),
  { fallback: <PageLoadingSkeleton /> }
);

const DeveloperTools = withLazyLoading(
  () => import('@/pages/categories/DeveloperTools'),
  { fallback: <PageLoadingSkeleton /> }
);

const Generators = withLazyLoading(
  () => import('@/pages/categories/Generators'),
  { fallback: <PageLoadingSkeleton /> }
);

const PDFTools = withLazyLoading(
  () => import('@/pages/categories/PDFTools'),
  { fallback: <PageLoadingSkeleton /> }
);

// Tool pages - grouped by category for better code splitting
const toolRoutes = {
  // Text tools
  textTools: [
    { path: 'word-counter', component: () => import('@/pages/tools/WordCounter') },
    { path: 'case-converter', component: () => import('@/pages/tools/CaseConverter') },
    { path: 'lorem-generator', component: () => import('@/pages/tools/LoremGenerator') },
    { path: 'text-reverser', component: () => import('@/pages/tools/TextReverser') },
    { path: 'text-formatter', component: () => import('@/pages/tools/TextFormatter') },
    { path: 'line-sorter', component: () => import('@/pages/tools/LineSorter') },
    { path: 'text-diff', component: () => import('@/pages/tools/TextDiff') },
    { path: 'char-frequency', component: () => import('@/pages/tools/CharFrequency') },
  ],
  
  // Calculator tools
  calculators: [
    { path: 'percentage-calc', component: () => import('@/pages/tools/PercentageCalculator') },
    { path: 'bmi-calculator', component: () => import('@/pages/tools/BMICalculator') },
    { path: 'tip-calculator', component: () => import('@/pages/tools/TipCalculator') },
    { path: 'loan-calculator', component: () => import('@/pages/tools/LoanCalculator') },
    { path: 'age-calculator', component: () => import('@/pages/tools/AgeCalculator') },
    { path: 'math-calculator', component: () => import('@/pages/tools/MathCalculator') },
    { path: 'currency-converter', component: () => import('@/pages/tools/CurrencyConverter') },
    { path: 'unit-converter', component: () => import('@/pages/tools/UnitConverter') },
  ],
  
  // Image tools
  imageTools: [
    { path: 'image-resizer', component: () => import('@/pages/tools/ImageResizer') },
    { path: 'image-compressor', component: () => import('@/pages/tools/ImageCompressor') },
    { path: 'image-converter', component: () => import('@/pages/tools/ImageConverter') },
    { path: 'image-cropper', component: () => import('@/pages/tools/ImageCropper') },
    { path: 'image-filter', component: () => import('@/pages/tools/ImageFilter') },
    { path: 'image-metadata', component: () => import('@/pages/tools/ImageMetadata') },
    { path: 'advanced-image-editor', component: () => import('@/pages/tools/AdvancedImageEditor') },
    { path: 'background-remover', component: () => import('@/pages/tools/BackgroundRemover') },
  ],
  
  // Developer tools
  developerTools: [
    { path: 'json-formatter', component: () => import('@/pages/tools/JSONFormatter') },
    { path: 'base64-encoder', component: () => import('@/pages/tools/Base64Encoder') },
    { path: 'url-encoder', component: () => import('@/pages/tools/URLEncoder') },
    { path: 'color-picker', component: () => import('@/pages/tools/ColorPicker') },
    { path: 'css-minifier', component: () => import('@/pages/tools/CSSMinifier') },
    { path: 'js-minifier', component: () => import('@/pages/tools/JSMinifier') },
    { path: 'html-minifier', component: () => import('@/pages/tools/HTMLMinifier') },
    { path: 'html-formatter', component: () => import('@/pages/tools/HTMLFormatter') },
    { path: 'sql-formatter', component: () => import('@/pages/tools/SQLFormatter') },
    { path: 'xml-formatter', component: () => import('@/pages/tools/XMLFormatter') },
    { path: 'regex-tester', component: () => import('@/pages/tools/RegexTester') },
    { path: 'jwt-decoder', component: () => import('@/pages/tools/JWTDecoder') },
    { path: 'markdown-converter', component: () => import('@/pages/tools/MarkdownConverter') },
    { path: 'markdown-editor', component: () => import('@/pages/tools/MarkdownEditor') },
  ],
  
  // Generators
  generators: [
    { path: 'password-generator', component: () => import('@/pages/tools/PasswordGenerator') },
    { path: 'qr-generator', component: () => import('@/pages/tools/QRGenerator') },
    { path: 'uuid-generator', component: () => import('@/pages/tools/UUIDGenerator') },
    { path: 'hash-generator', component: () => import('@/pages/tools/HashGenerator') },
    { path: 'barcode-generator', component: () => import('@/pages/tools/BarcodeGenerator') },
    { path: 'random-number', component: () => import('@/pages/tools/RandomNumberGenerator') },
    { path: 'mock-data', component: () => import('@/pages/tools/MockDataGenerator') },
    { path: 'api-key-generator', component: () => import('@/pages/tools/APIKeyGenerator') },
    { path: 'credit-card-generator', component: () => import('@/pages/tools/CreditCardGenerator') },
    { path: 'name-generator', component: () => import('@/pages/tools/NameGenerator') },
    { path: 'email-generator', component: () => import('@/pages/tools/EmailGenerator') },
    { path: 'text-to-svg', component: () => import('@/pages/tools/TextToSVG') },
  ],
  
  // Video tools
  videoTools: [
    { path: 'video-editor', component: () => import('@/pages/tools/VideoEditor') },
    { path: 'video-trimmer', component: () => import('@/pages/tools/VideoTrimmer') },
    { path: 'gif-maker', component: () => import('@/pages/tools/GifMaker') },
    { path: 'video-merger', component: () => import('@/pages/tools/VideoMerger') },
    { path: 'video-converter', component: () => import('@/pages/tools/VideoConverter') },
    { path: 'video-compressor', component: () => import('@/pages/tools/VideoCompressor') },
  ],
  
  // Audio tools
  audioTools: [
    { path: 'audio-editor', component: () => import('@/pages/tools/AudioEditor') },
    { path: 'audio-converter', component: () => import('@/pages/tools/AudioConverter') },
    { path: 'audio-compressor', component: () => import('@/pages/tools/AudioCompressor') },
    { path: 'audio-merger', component: () => import('@/pages/tools/AudioMerger') },
    { path: 'noise-reducer', component: () => import('@/pages/tools/NoiseReducer') },
    { path: 'audio-splitter', component: () => import('@/pages/tools/AudioSplitter') },
  ],
  
  // PDF tools
  pdfTools: [
    { path: 'pdf-converter', component: () => import('@/pages/tools/PDFConverter') },
    { path: 'pdf-merger', component: () => import('@/pages/tools/PDFMerger') },
    { path: 'pdf-splitter', component: () => import('@/pages/tools/PDFSplitter') },
    { path: 'pdf-compressor', component: () => import('@/pages/tools/PDFCompressor') },
  ],
};

// Create lazy loaded tool routes
const createLazyToolRoutes = (): RouteObject[] => {
  const routes: RouteObject[] = [];
  
  Object.values(toolRoutes).flat().forEach(({ path, component }) => {
    const LazyComponent = withLazyLoading(component, {
      fallback: <PageLoadingSkeleton />
    });
    
    routes.push({
      path: `/tools/${path}`,
      element: <LazyComponent />
    });
  });
  
  return routes;
};

export { 
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
};