import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    // The site is link-only: every page sends noindex (layout metadata and the
    // X-Robots-Tag header in next.config.mjs). Crawling stays allowed so search
    // engines can read that noindex; a Disallow would hide it and a blocked URL
    // can still be listed from links elsewhere. No sitemap is advertised.
    rules: [{ userAgent: '*', allow: '/', disallow: ['/edit', '/api/'] }],
  };
}
