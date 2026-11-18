// Escola Paraíso da Criança: interações do site.
// Os textos estão escritos direto no HTML de cada página; este arquivo só cuida de
// menu do celular, cabeçalho ao rolar, animações de entrada e formulário de contato.
// Sem JavaScript, o site continua mostrando todo o conteúdo.

const reduzirMovimento = () => matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ------------------------------------------------------------ menu do celular */
const nav = document.getElementById('nav');
const botaoMenu = document.getElementById('menu-btn');

function fecharMenu() {
  nav.classList.remove('is-open');
  botaoMenu.setAttribute('aria-expanded', 'false');
  botaoMenu.setAttribute('aria-label', 'Abrir menu');
}

botaoMenu.addEventListener('click', () => {
  const abrir = !nav.classList.contains('is-open');
  nav.classList.toggle('is-open', abrir);
  botaoMenu.setAttribute('aria-expanded', String(abrir));
  botaoMenu.setAttribute('aria-label', abrir ? 'Fechar menu' : 'Abrir menu');
  if (abrir) nav.querySelector('a')?.focus();
});

document.addEventListener('keydown', (evento) => {
  if (evento.key === 'Escape' && nav.classList.contains('is-open')) {
    fecharMenu();
    botaoMenu.focus();
  }
});

/* ------------------------------------------------------------ cabeçalho ao rolar */
const cabecalho = document.querySelector('.header');
let ultimoY = 0;

addEventListener('scroll', () => {
  const y = scrollY;
  cabecalho.classList.toggle('is-scrolled', y > 10);
  // Esconde ao descer a página e volta ao subir (nunca com o menu aberto).
  cabecalho.classList.toggle('is-hidden', y > 400 && y > ultimoY && !nav.classList.contains('is-open'));
  ultimoY = y;
}, { passive: true });

/* ------------------------------------------------------------ animações de entrada */
const animados = document.querySelectorAll('.reveal');

if (reduzirMovimento() || !('IntersectionObserver' in window)) {
  animados.forEach((el) => el.classList.add('in'));
} else {
  const observador = new IntersectionObserver((entradas) => {
    entradas.forEach((entrada) => {
      if (!entrada.isIntersecting) return;
      entrada.target.classList.add('in');
      observador.unobserve(entrada.target);
    });
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
  animados.forEach((el) => observador.observe(el));
}

/* ------------------------------------------------------------ depoimentos */
// A fileira avança sozinha a cada 6 s. Para quando o mouse ou o foco estão nela, quando a pessoa
// aperta "Pausar" e quando o sistema pede menos movimento. Sem JS, a fileira só rola à mão.
const depo = document.querySelector('[data-depo]');

if (depo) {
  const trilho = depo.querySelector('.depo__trilho');
  const botaoPausa = depo.querySelector('[data-depo-pausa]');
  let pausadoPelaPessoa = reduzirMovimento();
  let parado = false;

  const passo = () => {
    const cartao = trilho.querySelector('.depo__card');
    return cartao.getBoundingClientRect().width + parseFloat(getComputedStyle(cartao.parentElement).columnGap || 0);
  };
  const avancar = (direcao = 1) => {
    const fim = trilho.scrollLeft + trilho.clientWidth >= trilho.scrollWidth - 8;
    if (direcao > 0 && fim) trilho.scrollTo({ left: 0 });
    else if (direcao < 0 && trilho.scrollLeft <= 8) trilho.scrollTo({ left: trilho.scrollWidth });
    else trilho.scrollBy({ left: direcao * passo() });
  };
  const mostrarPausa = () => {
    botaoPausa.setAttribute('aria-pressed', String(pausadoPelaPessoa));
    botaoPausa.setAttribute('aria-label', pausadoPelaPessoa ? 'Continuar a rolagem dos depoimentos' : 'Pausar a rolagem dos depoimentos');
    botaoPausa.innerHTML = pausadoPelaPessoa
      ? '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M8 5.5v13l11-6.5z" /></svg>'
      : '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><rect x="7" y="5" width="3.5" height="14" rx="1" /><rect x="13.5" y="5" width="3.5" height="14" rx="1" /></svg>';
  };

  depo.querySelector('[data-depo-prox]').addEventListener('click', () => avancar(1));
  depo.querySelector('[data-depo-ant]').addEventListener('click', () => avancar(-1));
  botaoPausa.addEventListener('click', () => { pausadoPelaPessoa = !pausadoPelaPessoa; mostrarPausa(); });
  ['mouseenter', 'focusin', 'touchstart'].forEach((ev) => trilho.addEventListener(ev, () => { parado = true; }, { passive: true }));
  ['mouseleave', 'focusout'].forEach((ev) => trilho.addEventListener(ev, () => { parado = false; }));
  mostrarPausa();
  setInterval(() => { if (!pausadoPelaPessoa && !parado && !document.hidden) avancar(1); }, 6000);
}

/* ------------------------------------------------------------ portfólio: foto ampliada */
// Sem JavaScript, cada foto é um link para o arquivo em tamanho grande.
const caixaFoto = document.getElementById('lightbox');

if (caixaFoto && typeof caixaFoto.showModal === 'function') {
  const imagem = document.createElement('img'); // entra na página só ao abrir a primeira foto
  const legenda = caixaFoto.querySelector('.lightbox__legenda');
  document.querySelectorAll('.pitem__link').forEach((link) => {
    link.addEventListener('click', (evento) => {
      evento.preventDefault();
      if (!imagem.isConnected) legenda.before(imagem);
      imagem.src = link.href;
      imagem.alt = link.querySelector('img').alt;
      legenda.textContent = link.dataset.legenda || '';
      caixaFoto.showModal();
    });
  });
  caixaFoto.querySelector('.lightbox__fechar').addEventListener('click', () => caixaFoto.close());
  // Clique fora da foto fecha
  caixaFoto.addEventListener('click', (evento) => { if (evento.target === caixaFoto) caixaFoto.close(); });
}
