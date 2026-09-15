import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { plugin as mdPlugin, Mode } from 'vite-plugin-markdown';
import { sitemapPlugin } from './vite-sitemap-plugin';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    mdPlugin({
      mode: [Mode.REACT, Mode.TOC, Mode.MARKDOWN],
    }),
    sitemapPlugin(),
  ],
  ssgOptions: {
    dirStyle: 'nested',
    script: 'defer',
  },
  ssr: {
    noExternal: ['react-player'],
  },
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  assetsInclude: ['**/*.csv'],
  publicDir: 'public',
});
