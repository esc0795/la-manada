// astro.config.mjs
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';

export default defineConfig({
  site: 'https://esc0795.github.io',
  base: '/la-manada',
  integrations: [react()]
});
