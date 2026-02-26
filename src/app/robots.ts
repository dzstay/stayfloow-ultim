import { MetadataRoute } from 'next';

/**
 * Configure les règles pour les robots d'indexation (robots.txt).
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin/', '/profile/', '/auth/'],
    },
    sitemap: 'https://www.stayfloow.com/sitemap.xml',
  };
}
