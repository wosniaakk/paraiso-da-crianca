// @ts-check
import { defineConfig } from 'astro/config';

// Publicado no GitHub Pages como site de projeto: https://wosniaakk.github.io/paraiso-da-crianca/
// Se o repositório mudar de nome (ou virar <usuario>.github.io), ajuste `base`.
export default defineConfig({
  site: 'https://wosniaakk.github.io',
  base: '/paraiso-da-crianca',
  // CSS embutido no HTML: um pedido a menos bloqueando a primeira renderização.
  build: { format: 'directory', inlineStylesheets: 'always' },
});
