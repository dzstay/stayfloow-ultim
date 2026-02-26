import { MetadataRoute } from 'next';

/**
 * Génère le plan du site (sitemap.xml) pour Google.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://www.stayfloow.com';
  
  const routes = [
    '',
    '/search',
    '/cars',
    '/circuits',
    '/partners/join',
    '/contact',
    '/about',
    '/terms',
    '/privacy',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1 : 0.8,
  }));

  return routes;
}
