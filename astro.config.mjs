// @ts-check
import { defineConfig } from 'astro/config';

// Publicado no GitHub Pages como página de organização (https://edu-rdp.github.io/).
// Se o site for movido para um repositório de projeto, ajuste `base` (ex.: '/paraiso-da-crianca').
export default defineConfig({
  site: 'https://edu-rdp.github.io',
  base: '/',
  build: { format: 'directory' },
});
