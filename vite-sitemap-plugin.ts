import { Plugin } from 'vite';

const SITE_URL = 'https://escuela.redciudadana.org.gt';

const STATIC_ROUTES = [
  '/',
  '/courses',
  '/learning-paths',
  '/primeros-pasos-digitales',
  '/digitaliza-tu-pyme',
  '/diagnostico-digital',
  '/conecta-futuro',
  '/contact',
  '/about',
  '/community',
  '/tutoriales',
  '/directorio-ia',
  '/banco-prompts',
  '/verify-certificate',
  '/documentation',
  '/course-sessions',
];

function generateSitemap(): string {
  const now = new Date().toISOString().split('T')[0];
  const urls = STATIC_ROUTES.map(route => {
    const priority = route === '/' ? '1.0' : '0.8';
    return `  <url>
    <loc>${SITE_URL}${route}</loc>
    <lastmod>${now}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${priority}</priority>
  </url>`;
  }).join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;
}

export function sitemapPlugin(): Plugin {
  return {
    name: 'generate-sitemap',
    apply: 'build',
    generateBundle() {
      this.emitFile({
        type: 'asset',
        fileName: 'sitemap.xml',
        source: generateSitemap(),
      });
    },
  };
}
