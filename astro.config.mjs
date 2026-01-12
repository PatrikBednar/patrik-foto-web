import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://www.patrik-bednar.cz',
  integrations: [sitemap()],
});