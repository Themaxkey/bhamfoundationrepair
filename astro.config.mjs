import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { site } from './site.config.ts';

export default defineConfig({
  site: `https://${site.business.domain}`,
  // Trailing slashes everywhere, matched by the Worker's asset handling.
  trailingSlash: 'always',
  build: { format: 'directory' },
  integrations: [
    sitemap({
      changefreq: 'weekly',
      priority: 0.7,
      // These two pages carry `noindex: true` in their frontmatter. Leaving a
      // noindexed URL in the sitemap makes Search Console report it as an
      // error ("Submitted URL marked noindex") — you are telling Google to
      // crawl it and not to index it in the same breath. Keep this list in
      // step with any page you set noindex on.
      filter: (page) =>
        !page.endsWith('/privacy-policy/') &&
        !page.endsWith('/sms-terms-and-conditions/'),
    }),
  ],
});
