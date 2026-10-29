// Verificação automática do site (seção 4 do briefing da avaliação heurística).
//
// Uso:
//   npm run build && npm run qa              → sobe o `astro preview` e testa dist/
//   node scripts/qa.mjs --url http://localhost:8080 --out qa/antes   → testa um servidor já rodando
//
// Saída: screenshots em qa/<largura>/, relatório em qa/relatorio.json e resumo no terminal.
// Termina com código 1 se encontrar rolagem lateral, botão fora da dobra, violação do axe ou link quebrado.
import { spawn } from 'node:child_process';
import { mkdir, writeFile } from 'node:fs/promises';
import { chromium } from 'playwright';
import AxeBuilder from '@axe-core/playwright';

const args = Object.fromEntries(
  process.argv.slice(2).reduce((pares, arg, i, todos) => {
    if (arg.startsWith('--')) pares.push([arg.slice(2), todos[i + 1]]);
    return pares;
  }, []),
);

const OUT = args.out ?? 'qa';
const PORTA = 4329;
const PAGINAS = ['/', '/a-escola/', '/proposta-pedagogica/', '/estrutura/', '/agende-visita/', '/privacidade/', '/pagina-que-nao-existe/'];
const LARGURAS = [320, 360, 390, 768, 1440];
const DOBRA = [
  { width: 1440, height: 900 },
  { width: 390, height: 844 },
];
const ALVO_MOBILE = 44;

async function subirPreview() {
  const proc = spawn('npx', ['astro', 'preview', '--port', String(PORTA)], { stdio: ['ignore', 'pipe', 'pipe'] });
  const base = `http://localhost:${PORTA}`;
  for (let i = 0; i < 60; i++) {
    try {
      const r = await fetch(base);
      if (r.ok) return { base, proc };
    } catch {}
    await new Promise((r) => setTimeout(r, 500));
  }
  proc.kill();
  throw new Error('astro preview não respondeu');
}

const nomeArquivo = (caminho) => (caminho === '/' ? 'inicio' : caminho.replace(/^\/|\/$/g, '').replace(/\//g, '-'));

const { base, proc } = args.url ? { base: args.url.replace(/\/$/, ''), proc: null } : await subirPreview();
const browser = await chromium.launch();
const novaPagina = async (opcoes = {}) => (await browser.newContext(opcoes)).newPage();
const relatorio = { base, rolagemLateral: [], dobra: [], axe: [], alvosPequenos: [], linksQuebrados: [] };

try {
  // 1. Rolagem lateral + screenshots em cada largura
  for (const largura of LARGURAS) {
    await mkdir(`${OUT}/${largura}`, { recursive: true });
    const page = await novaPagina({ viewport: { width: largura, height: 900 } });
    for (const caminho of PAGINAS) {
      await page.goto(base + caminho, { waitUntil: 'networkidle' });
      const { scrollWidth, innerWidth } = await page.evaluate(() => ({
        scrollWidth: document.documentElement.scrollWidth,
        innerWidth: window.innerWidth,
      }));
      if (scrollWidth !== innerWidth) relatorio.rolagemLateral.push({ caminho, largura, scrollWidth, innerWidth });
      // Títulos que estouram a própria caixa: no Chromium nem sempre viram rolagem, mas no Safari iOS viram.
      const titulos = await page.$$eval('h1, h2', (els) =>
        els.filter((el) => el.scrollWidth > el.clientWidth + 1).map((el) => `${el.tagName} "${el.textContent.trim().slice(0, 40)}" ${el.scrollWidth}>${el.clientWidth}`),
      );
      for (const titulo of titulos) relatorio.rolagemLateral.push({ caminho, largura, titulo });
      await page.screenshot({ path: `${OUT}/${largura}/${nomeArquivo(caminho)}.png`, fullPage: true });
    }
    await page.context().close();
  }

  // 2. Botão principal da página de agendamento visível sem rolar
  for (const viewport of DOBRA) {
    const page = await novaPagina({ viewport });
    await page.goto(base + '/agende-visita/', { waitUntil: 'networkidle' });
    const botao = page.locator('[data-cta-principal], .visit-card .button').first();
    const caixa = await botao.boundingBox();
    const visivel = caixa && caixa.y >= 0 && caixa.y + caixa.height <= viewport.height;
    relatorio.dobra.push({ viewport: `${viewport.width}x${viewport.height}`, topo: caixa?.y ?? null, base: caixa ? caixa.y + caixa.height : null, visivel });
    await page.context().close();
  }

  // 3. axe-core (desktop e celular) + 4. alvos de toque no celular
  for (const viewport of [{ width: 1440, height: 900 }, { width: 390, height: 844 }]) {
    const page = await novaPagina({ viewport });
    for (const caminho of PAGINAS) {
      await page.goto(base + caminho, { waitUntil: 'networkidle' });
      const resultado = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa', 'best-practice']).analyze();
      for (const v of resultado.violations) {
        relatorio.axe.push({
          caminho,
          viewport: viewport.width,
          regra: v.id,
          impacto: v.impact,
          ocorrencias: v.nodes.map((n) => ({ alvo: n.target.join(' '), detalhe: n.failureSummary?.split('\n').slice(1, 2).join('').trim() })),
        });
      }

      if (viewport.width === 390) {
        const pequenos = await page.evaluate((minimo) => {
          const visivel = (el) => {
            const r = el.getBoundingClientRect();
            const s = getComputedStyle(el);
            return r.width > 0 && r.height > 0 && s.visibility !== 'hidden' && !el.closest('details:not([open]) > :not(summary)');
          };
          return [...document.querySelectorAll('a, button, summary, input, select, textarea')]
            .filter(visivel)
            .filter((el) => !el.classList.contains('skip-link'))
            .map((el) => ({ el, r: el.getBoundingClientRect() }))
            .filter(({ r }) => r.height < minimo)
            .map(({ el, r }) => ({
              texto: (el.innerText || el.getAttribute('aria-label') || el.name || el.tagName).trim().slice(0, 50),
              altura: Math.round(r.height),
              tag: el.tagName.toLowerCase(),
            }));
        }, ALVO_MOBILE);
        for (const p of pequenos) relatorio.alvosPequenos.push({ caminho, ...p });
      }
    }
    await page.context().close();
  }

  // 5. Links internos: página e âncora de destino existem
  const page = await novaPagina();
  const internos = new Map();
  for (const caminho of PAGINAS.slice(0, -1)) {
    await page.goto(base + caminho, { waitUntil: 'domcontentloaded' });
    const hrefs = await page.$$eval('a[href]', (as) => as.map((a) => ({ href: a.href, texto: a.innerText.trim() })));
    for (const { href, texto } of hrefs) {
      if (!href.startsWith(base)) continue;
      if (!internos.has(href)) internos.set(href, { origens: new Set(), texto });
      internos.get(href).origens.add(caminho);
    }
  }
  for (const [href, { origens, texto }] of internos) {
    const destino = new URL(href);
    const resposta = await page.goto(destino.origin + destino.pathname, { waitUntil: 'domcontentloaded' });
    let problema = null;
    if (!resposta || resposta.status() >= 400) problema = `HTTP ${resposta?.status()}`;
    else if (destino.hash) {
      const id = decodeURIComponent(destino.hash.slice(1));
      const existe = await page.evaluate((id) => !!document.getElementById(id), id);
      if (!existe) problema = `âncora #${id} não existe`;
    }
    if (problema) relatorio.linksQuebrados.push({ href, texto, origens: [...origens], problema });
  }
  relatorio.linksVerificados = internos.size;
  await page.context().close();
} finally {
  await browser.close();
  proc?.kill();
}

await mkdir(OUT, { recursive: true });
await writeFile(`${OUT}/relatorio.json`, JSON.stringify(relatorio, null, 2));

console.log(`\nQA — ${base}`);
console.log(`Rolagem lateral: ${relatorio.rolagemLateral.length ? '' : 'nenhuma'}`);
relatorio.rolagemLateral.forEach((r) => console.log(`  ✗ ${r.caminho} @${r.largura}px → ${r.titulo ?? `scrollWidth ${r.scrollWidth}`}`));
console.log('Botão principal acima da dobra (agende-visita):');
relatorio.dobra.forEach((d) => console.log(`  ${d.visivel ? '✓' : '✗'} ${d.viewport} (topo ${Math.round(d.topo)}px, base ${Math.round(d.base)}px)`));
console.log(`Violações axe: ${relatorio.axe.length ? '' : 'nenhuma'}`);
relatorio.axe.forEach((v) => console.log(`  ✗ ${v.caminho} @${v.viewport} ${v.regra} (${v.impacto}) ×${v.ocorrencias.length}: ${v.ocorrencias.slice(0, 3).map((o) => o.alvo).join(' | ')}`));
console.log(`Alvos < ${ALVO_MOBILE}px no celular (390px): ${relatorio.alvosPequenos.length}`);
relatorio.alvosPequenos.forEach((a) => console.log(`  · ${a.caminho} ${a.tag} "${a.texto}" ${a.altura}px`));
console.log(`Links internos verificados: ${relatorio.linksVerificados}, quebrados: ${relatorio.linksQuebrados.length}`);
relatorio.linksQuebrados.forEach((l) => console.log(`  ✗ ${l.href} ("${l.texto}") em ${l.origens.join(', ')} → ${l.problema}`));

const falhou =
  relatorio.rolagemLateral.length || relatorio.dobra.some((d) => !d.visivel) || relatorio.axe.length || relatorio.linksQuebrados.length;
process.exit(falhou ? 1 : 0);
