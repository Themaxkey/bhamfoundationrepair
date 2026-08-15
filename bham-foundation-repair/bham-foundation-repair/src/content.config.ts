import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const seo = {
  title:       z.string(),          // <h1> on the page
  seoTitle:    z.string(),          // <title> tag
  description: z.string(),          // meta description
  hero:        z.string().optional(),
  heroAlt:     z.string().optional(),
  tagline:     z.string().optional(),   // short human sub-headline for heroes
  heroCaption: z.string().optional(),   // optional caption under the hero image
  noindex:     z.boolean().optional(),
};

const services = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/services' }),
  schema: z.object({ ...seo, order: z.number().default(99) }),
});

const towns = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/towns' }),
  schema: z.object({ ...seo, town: z.string() }),
});

const faqs = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/faqs' }),
  schema: z.object({ ...seo, question: z.string().optional() }),
});

const pages = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/pages' }),
  schema: z.object(seo),
});

export const collections = { services, towns, faqs, pages };
