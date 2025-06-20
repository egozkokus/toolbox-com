// vite.config.ts

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { visualizer } from 'rollup-plugin-visualizer';
import viteCompression from 'vite-plugin-compression';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    
    // Bundle analyzer
    process.env.ANALYZE && visualizer({
      filename: './dist/stats.html',
      open: true,
      gzipSize: true,
      brotliSize: true,
    }),
    
    // Gzip compression
    viteCompression({
      algorithm: 'gzip',
      ext: '.gz',
    }),
    
    // Brotli compression
    viteCompression({
      algorithm: 'brotliCompress',
      ext: '.br',
    }),
    
    // PWA support
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'robots.txt', 'sitemap.xml'],
      manifest: {
        name: 'Tools4Anything',
        short_name: 'T4A',
        description: 'כלי רשת הכל-בכל',
        theme_color: '#3b82f6',
        background_color: '#ffffff',
        display: 'standalone',
        icons: [
          {
            src: '/pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: '/pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
          },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365, // 1 year
              },
              cacheableResponse: {
                statuses: [0, 200],
              },
            },
          },
        ],
      },
    }),
  ].filter(Boolean),
  
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  
  build: {
    // Enable minification
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
    
    // Output settings
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    
    // Chunk splitting strategy
    rollupOptions: {
      output: {
        manualChunks: {
          // Vendor chunks
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'ui-vendor': ['@radix-ui/react-dialog', '@radix-ui/react-dropdown-menu', '@radix-ui/react-toast'],
          'utils-vendor': ['lodash', 'date-fns', 'clsx'],
          
          // Feature chunks
          'text-tools': [
            './src/pages/tools/WordCounter',
            './src/pages/tools/CaseConverter',
            './src/pages/tools/TextFormatter',
            './src/pages/tools/TextReverser',
            './src/pages/tools/LineSorter',
          ],
          'dev-tools': [
            './src/pages/tools/JSONFormatter',
            './src/pages/tools/CSSMinifier',
            './src/pages/tools/JSMinifier',
            './src/pages/tools/HTMLFormatter',
            './src/pages/tools/SQLFormatter',
          ],
          'image-tools': [
            './src/pages/tools/ImageResizer',
            './src/pages/tools/ImageCompressor',
            './src/pages/tools/ImageConverter',
            './src/pages/tools/ImageCropper',
          ],
          'generators': [
            './src/pages/tools/PasswordGenerator',
            './src/pages/tools/QRGenerator',
            './src/pages/tools/UUIDGenerator',
            './src/pages/tools/HashGenerator',
          ],
        },
        
        // Asset file naming
        chunkFileNames: (chunkInfo) => {
          const facadeModuleId = chunkInfo.facadeModuleId ? chunkInfo.facadeModuleId.split('/').pop() : 'chunk';
          return `assets/js/${facadeModuleId}-[hash].js`;
        },
        entryFileNames: 'assets/js/[name]-[hash].js',
        assetFileNames: 'assets/[ext]/[name]-[hash].[ext]',
      },
    },
    
    // Performance budgets
    chunkSizeWarningLimit: 500, // 500kb warning
    
    // CSS code splitting
    cssCodeSplit: true,
  },
  
  // Optimization
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      '@tanstack/react-query',
    ],
    exclude: ['@vite/client', '@vite/env'],
  },
  
  // Server settings
  server: {
    port: 3000,
    open: true,
    cors: true,
  },
  
  // Preview settings
  preview: {
    port: 5000,
    open: true,
  },
});