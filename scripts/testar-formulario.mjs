// Testa o formulário de "Agende sua visita" e a fachada do mapa.
// Uso:
//   npm run build && node scripts/testar-formulario.mjs whatsapp <url>
//   PUBLIC_FORM_ENDPOINT=https://formspree.io/f/teste npm run build && node scripts/testar-formulario.mjs endpoint <url>
// No modo endpoint o POST é interceptado (o serviço real não é chamado).
import { chromium } from 'playwright';

const [modo = 'whatsapp', base = 'http://localhost:4329'] = process.argv.slice(2);
const browser = await chromium.launch();
const falhas = [];
const ok = (condicao, descricao) => {
  console.log(`${condicao ? '✓' : '✗'} ${descricao}`);
  if (!condicao) falhas.push(descricao);
};

async function abrir() {
  const context = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const page = await context.newPage();
  await page.goto(`${base}/agende-visita/`, { waitUntil: 'networkidle' });
  return { context, page };
}

async function preencher(page) {
  await page.fill('#f-nome', 'Maria Teste');
  await page.fill('#f-telefone', '(41) 99999-0000');
  await page.selectOption('#f-idade', '3 anos');
  await page.selectOption('#f-periodo', 'Tarde');
  await page.fill('#f-horario', 'depois das 14h');
}

// 1. Validação (igual nos dois modos)
{
  const { context, page } = await abrir();
  await page.click('#visita-form button[type="submit"]');
  ok((await page.getAttribute('#f-nome', 'aria-invalid')) === 'true', 'nome vazio → aria-invalid');
  ok((await page.textContent('#f-nome-erro')) === 'Informe seu nome.', 'mensagem de erro do nome');
  ok((await page.textContent('#f-idade-erro')) === 'Selecione a idade da criança.', 'mensagem de erro da idade');
  ok(await page.evaluate(() => document.activeElement?.id === 'f-nome'), 'foco vai para o primeiro campo inválido');
  await page.fill('#f-telefone', '1234');
  await page.click('#visita-form button[type="submit"]');
  ok((await page.textContent('#f-telefone-erro')).includes('DDD'), 'telefone curto → pede DDD');
  await page.fill('#f-nome', 'Maria');
  ok((await page.getAttribute('#f-nome', 'aria-invalid')) === 'false', 'erro some ao corrigir o campo');
  ok((await page.getAttribute('#f-telefone', 'aria-describedby')).includes('f-telefone-erro'), 'erro ligado ao campo por aria-describedby');
  await context.close();
}

if (modo === 'whatsapp') {
  const { context, page } = await abrir();
  ok((await page.textContent('#visita-form button[type="submit"]')).includes('Enviar pelo WhatsApp'), 'botão anuncia o WhatsApp');
  await preencher(page);
  const [popup] = await Promise.all([context.waitForEvent('page'), page.click('#visita-form button[type="submit"]')]);
  // wa.me redireciona para api.whatsapp.com, que codifica espaços como "+".
  const destino = new URL(popup.url()).searchParams.get('text') ?? decodeURIComponent(popup.url());
  console.log('  mensagem:', JSON.stringify(destino));
  ok(/wa\.me\/554133477341|api\.whatsapp\.com/.test(popup.url()), `abre o WhatsApp em nova aba (${popup.url().slice(0, 60)}…)`);
  ok(destino.includes('Maria Teste') && destino.includes('3 anos') && destino.includes('Tarde') && destino.includes('depois das 14h'), 'mensagem leva os dados preenchidos');
  ok((await page.textContent('.form-status')).includes('Abrimos o WhatsApp'), 'mostra confirmação com caminho alternativo');
  await context.close();
} else {
  for (const status of [200, 500]) {
    const { context, page } = await abrir();
    let corpo = null;
    let liberar;
    const espera = new Promise((r) => (liberar = r));
    await page.route(/formspree|web3forms|\/f\//, async (route) => {
      corpo = route.request().postData();
      await espera;
      await route.fulfill({ status, contentType: 'application/json', body: '{}' });
    });
    await preencher(page);
    await page.click('#visita-form button[type="submit"]');
    await page.waitForFunction(() => document.querySelector('#visita-form button[type="submit"]').disabled);
    ok((await page.textContent('#visita-form button[type="submit"]')) === 'Enviando…', `[${status}] botão desabilitado com "Enviando…"`);
    liberar();
    await page.waitForSelector('.form-status:not([hidden])');
    const texto = await page.textContent('.form-status');
    ok(corpo?.includes('Maria Teste'), `[${status}] POST leva os dados`);
    if (status === 200) ok(texto.includes('Recebemos seu pedido'), '[200] mensagem de sucesso');
    else ok(texto.includes('Não conseguimos enviar') && texto.includes('(41) 3347-7341'), '[500] erro com alternativa por telefone');
    ok(!(await page.isDisabled('#visita-form button[type="submit"]')), `[${status}] botão volta a ficar ativo`);
    await context.close();
  }
}

// Fachada do mapa: nada do Google até o clique
{
  const { context, page } = await abrir();
  const google = [];
  page.on('request', (r) => /google\.com\/maps/.test(r.url()) && google.push(r.url()));
  ok((await page.locator('.mapa-fachada iframe').count()) === 0, 'mapa não carrega sozinho');
  await page.click('.mapa-fachada button');
  ok((await page.locator('.mapa-fachada iframe[title*="Paraíso"]').count()) === 1, 'clique injeta o iframe com title');
  await page.waitForTimeout(1500);
  ok(google.length > 0, 'iframe requisita o Google Maps só depois do clique');
  await context.close();
}

await browser.close();
console.log(falhas.length ? `\n${falhas.length} falha(s)` : '\nTudo certo');
process.exit(falhas.length ? 1 : 0);
