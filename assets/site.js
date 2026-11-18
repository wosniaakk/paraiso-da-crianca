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

/* ------------------------------------------------------------ formulário de contato */
// O formulário só monta uma mensagem e abre o WhatsApp da escola (data-whatsapp no <form>).
// Nada é enviado por e-mail nem guardado pelo site. Sem JavaScript, o botão já é um link
// para o WhatsApp com a mensagem padrão.
const form = document.getElementById('form');

if (form) {
  const status = document.getElementById('form-status');
  const enviar = document.getElementById('form-enviar');
  const linkWhatsapp = (mensagem) => `https://wa.me/${form.dataset.whatsapp}?text=${encodeURIComponent(mensagem)}`;

  const regras = {
    nome: (v) => v.trim().length >= 2 || 'Informe seu nome.',
    idade: (v) => !!v || 'Selecione a idade da criança.',
    periodo: (v) => !!v || 'Escolha manhã ou tarde.',
  };
  const valor = (nome) => (nome === 'periodo' ? form.querySelector('[name=periodo]:checked')?.value || '' : form[nome].value);

  const validar = (nome) => {
    const resultado = regras[nome](valor(nome));
    const caixa = document.getElementById(`e-${nome}`);
    const campo = caixa.closest('.field');
    const entradas = form.querySelectorAll(`[name=${nome}]`);
    const ok = resultado === true;
    caixa.textContent = ok ? '' : resultado;
    campo.toggleAttribute('data-invalid', !ok);
    entradas.forEach((el) => (ok ? el.removeAttribute('aria-invalid') : el.setAttribute('aria-invalid', 'true')));
    return ok;
  };

  Object.keys(regras).forEach((nome) => {
    form.querySelectorAll(`[name=${nome}]`).forEach((el) => {
      el.addEventListener(el.type === 'radio' ? 'change' : 'blur', () => validar(nome));
    });
  });

  const mensagem = () => {
    const nome = form.nome.value.trim();
    const crianca = form.crianca.value.trim();
    const idade = valor('idade');
    return [
      'Olá! Gostaria de agendar uma visita ao Paraíso da Criança.',
      `Meu nome: ${nome}`,
      crianca && `Criança: ${crianca}`,
      `Idade: ${idade}`,
      `Interesse: ${idade === '6 meses a 1 ano' ? 'Berçário' : 'Educação Infantil'}`,
      `Melhor período: ${valor('periodo')}`,
    ].filter(Boolean).join('\n');
  };

  // Valida e, se estiver tudo certo, deixa o link abrir o WhatsApp com a mensagem montada.
  const preparar = (evento) => {
    status.className = 'form__status';
    status.textContent = '';
    const invalidos = Object.keys(regras).filter((nome) => !validar(nome));
    if (invalidos.length) {
      evento.preventDefault();
      form.querySelector(`[name=${invalidos[0]}]`).focus();
      status.className = 'form__status err';
      status.textContent = `Revise ${invalidos.length === 1 ? 'o campo destacado' : `os ${invalidos.length} campos destacados`} para continuar.`;
      return false;
    }
    enviar.href = linkWhatsapp(mensagem());
    return true;
  };

  enviar.addEventListener('click', preparar);
  form.addEventListener('submit', (evento) => evento.preventDefault());
  // Enter dentro de um campo de texto equivale a clicar no botão.
  form.addEventListener('keydown', (evento) => {
    if (evento.key === 'Enter' && evento.target.matches('input:not([type=radio])')) {
      evento.preventDefault();
      enviar.click();
    }
  });
}
