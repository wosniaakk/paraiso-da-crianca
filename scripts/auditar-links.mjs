// Lista cada link do build (dist/) com rótulo e destino, para conferir se o rótulo corresponde ao destino.
// Uso: npm run build && node scripts/auditar-links.mjs
import { readFile } from 'node:fs/promises';
import { globSync } from 'node:fs';

const linhas = new Map();
for (const arquivo of globSync('dist/**/*.html')) {
  const html = await readFile(arquivo, 'utf8');
  for (const [, attrs, corpo] of html.matchAll(/<a\b([^>]*)>([\s\S]*?)<\/a>/g)) {
    const href = attrs.match(/href="([^"]*)"/)?.[1] ?? '';
    const rotulo = (attrs.match(/aria-label="([^"]*)"/)?.[1] ?? corpo.replace(/<[^>]+>/g, '')).replace(/\s+/g, ' ').trim();
    const chave = `${rotulo}  ⟶  ${href.replace(/&amp;/g, '&').replace(/\?text=.*/, '?text=…')}`;
    linhas.set(chave, (linhas.get(chave) ?? 0) + 1);
  }
}
[...linhas].sort().forEach(([linha, n]) => console.log(`${String(n).padStart(3)}× ${linha}`));
