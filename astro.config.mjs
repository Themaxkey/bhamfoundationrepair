import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { site } from './site.config.ts';

export default defineConfig({
  site: `https://${site.business.domain}`,
  // Trailing slashes everywhere, matched by the Worker's asset handling.
  trailingSlash: 'always',
  build: { format: 'directory' },
  integrations: [sitemap({ changefreq: 'weekly', priority: 0.7 })],
});
