// vite.config.ts
import { defineConfig }   from 'vite';
import react              from '@vitejs/plugin-react';
import { visualizer }     from 'rollup-plugin-visualizer';
import viteCompression    from 'vite-plugin-compression';
import { VitePWA }        from 'vite-plugin-pwa';
import path               from 'path';
import { fileURLToPath }  from 'url';

// ---------- הגדרת __dirname בסביבת ESM ----------
const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);

// ---------- תצורה ----------
export default defineConfig({
  /* ---------- תוספים ---------- */
  plugins: [
    react(),

    /* ניתוח חבילות (פועל רק אם ANALYZE=1 בסביבה) */
    process.env.ANALYZE &&
      visualizer({
        filename: './dist/stats.html',
        open: true,
        gzipSize: true,
        brotliSize: true,
      }),

    /* דחיסת ‎.gz‎ */
    viteCompression({
      algorithm: 'gzip',
      ext: '.gz',
    }),

    /* דחיסת ‎.br‎ (Brotli) */
    viteCompression({
      algorithm: 'brotliCompress',
      ext: '.br',
    }),

    /* תמיכת PWA */
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'robots.txt', 'sitemap.xml'],
      manifest: {
        name: 'Tools4Anything',
        short_name: 'T4A',
        description: 'כלי רשת הכל-ב-כל',
        theme_color: '#3b82f6',
        background_color: '#ffffff',
        display: 'standalone',
        icons: [
          { src: '/pwa-192x192.png', sizes: '192x192', type: 'image/png' },
          { src: '/pwa-512x512.png', sizes: '512x512', type: 'image/png' },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
        runtimeCaching: [
          {
            // קאש לגופני Google
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-cache',
              expiration: { maxEntries: 10, maxAgeSeconds: 60 * 60 * 24 * 365 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
        ],
      },
    }),
  ].filter(Boolean), // מסיר false/undefined מהרשימה

  /* ---------- נתיבי קיצור ---------- */
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },

  /* ---------- בנייה ---------- */
  build: {
    minify: 'terser',
    terserOptions: {
      compress: { drop_console: true, drop_debugger: true },
    },
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    rollupOptions: {
      output: {
        /* חלוקת Chunks מותאמת אישית */
        manualChunks: {
          // ספקים
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'ui-vendor': [
            '@radix-ui/react-dialog',
            '@radix-ui/react-dropdown-menu',
            '@radix-ui/react-toast',
          ],
          'utils-vendor': ['lodash', 'date-fns', 'clsx'],

          // פיצ׳רים
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
          generators: [
            './src/pages/tools/PasswordGenerator',
            './src/pages/tools/QRGenerator',
            './src/pages/tools/UUIDGenerator',
            './src/pages/tools/HashGenerator',
          ],
        },

        /* שמות-קבצי הפלט */
        chunkFileNames: ({ facadeModuleId }) => {
          const name = facadeModuleId
            ? facadeModuleId.split('/').pop()
            : 'chunk';
          return `assets/js/${name}-[hash].js`;
        },
        entryFileNames: 'assets/js/[name]-[hash].js',
        assetFileNames: 'assets/[ext]/[name]-[hash].[ext]',
      },
    },
    chunkSizeWarningLimit: 500, // KB
    cssCodeSplit: true,
  },

  /* ---------- אופטימיזציית תלויות ---------- */
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      '@tanstack/react-query',
    ],
    exclude: [
      '@vite/client',
      '@vite/env',
      '@ffmpeg/ffmpeg',  // FFmpeg חייב להיות ב-exclude בגלל Web Workers
      '@ffmpeg/util',
    ],
  },

  /* ---------- שרת פיתוח ---------- */
  server: {
    port: 3000,
    open: true,
    cors: true,
    headers: {
      // Headers חשובים עבור FFmpeg.wasm
      'Cross-Origin-Opener-Policy': 'same-origin',
      'Cross-Origin-Embedder-Policy': 'require-corp',
    },
  },

  /* ---------- תצוגה מקדימה ---------- */
  preview: {
    port: 5000,
    open: true,
    // הוספת headers גם למצב preview
    headers: {
      'Cross-Origin-Opener-Policy': 'same-origin',
      'Cross-Origin-Embedder-Policy': 'require-corp',
    },
  },
});