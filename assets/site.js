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
// Configuração no próprio <form>: data-endpoint (Formspree ou similar; vazio = sem envio automático),
// data-whatsapp, data-telefone e data-sucesso.
const form = document.getElementById('form');

if (form) {
  const status = document.getElementById('form-status');
  const { endpoint, whatsapp, telefone, sucesso } = form.dataset;
  const linkWhatsapp = (mensagem) => `https://wa.me/${whatsapp}?text=${encodeURIComponent(mensagem)}`;
  const avisoAba = '<span class="sr-only"> (abre em nova aba)</span>';

  const regras = {
    nome: (v) => v.trim().length >= 3 || 'Informe o nome do responsável.',
    idade: (v) => !!v || 'Selecione a idade ou faixa etária da criança.',
    email: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()) || 'Informe um e-mail válido, como nome@exemplo.com.',
    whatsapp: (v) => v.replace(/\D/g, '').length >= 10 || 'Informe um WhatsApp com DDD.',
    interesse: (v) => !!v || 'Escolha Berçário ou Educação Infantil.',
    consentimento: (v) => v || 'É preciso autorizar o uso dos dados para o contato.',
  };
  const idErro = { nome: 'e-nome', idade: 'e-idade', email: 'e-email', whatsapp: 'e-whats', interesse: 'e-interesse', consentimento: 'e-lgpd' };

  const valor = (nome) => {
    if (nome === 'consentimento') return form.consentimento.checked;
    if (nome === 'interesse') return form.querySelector('[name=interesse]:checked')?.value || '';
    return form[nome].value;
  };

  const validar = (nome) => {
    const resultado = regras[nome](valor(nome));
    const caixa = document.getElementById(idErro[nome]);
    const campo = caixa.closest('.field');
    const entradas = form.querySelectorAll(`[name=${nome}]`);
    if (resultado === true) {
      caixa.textContent = '';
      campo.removeAttribute('data-invalid');
      entradas.forEach((el) => el.removeAttribute('aria-invalid'));
      return true;
    }
    caixa.textContent = resultado;
    campo.setAttribute('data-invalid', '');
    entradas.forEach((el) => el.setAttribute('aria-invalid', 'true'));
    return false;
  };

  Object.keys(regras).forEach((nome) => {
    form.querySelectorAll(`[name=${nome}]`).forEach((el) => {
      el.addEventListener(el.type === 'radio' || el.type === 'checkbox' ? 'change' : 'blur', () => validar(nome));
    });
  });

  // Máscara simples do WhatsApp: (41) 99999-9999
  form.whatsapp.addEventListener('input', (evento) => {
    const d = evento.target.value.replace(/\D/g, '').slice(0, 11);
    evento.target.value = d.length > 6 ? `(${d.slice(0, 2)}) ${d.slice(2, d.length - 4)}-${d.slice(-4)}` : d.length > 2 ? `(${d.slice(0, 2)}) ${d.slice(2)}` : d;
  });

  form.addEventListener('submit', async (evento) => {
    evento.preventDefault();
    status.className = 'form__status';
    status.textContent = '';

    const invalidos = Object.keys(regras).filter((nome) => !validar(nome));
    if (invalidos.length) {
      form.querySelector(`[name=${invalidos[0]}]`).focus();
      status.className = 'form__status err';
      status.textContent = `Revise ${invalidos.length === 1 ? 'o campo destacado' : `os ${invalidos.length} campos destacados`} para continuar.`;
      return;
    }

    const d = Object.fromEntries(new FormData(form));
    const resumo = [
      'Olá! Gostaria de agendar uma visita ao Paraíso da Criança.',
      `Responsável: ${d.nome}`,
      d.crianca ? `Criança: ${d.crianca}` : '',
      `Idade: ${d.idade}`,
      `Interesse: ${d.interesse}`,
      `E-mail: ${d.email}`,
      `WhatsApp: ${d.whatsapp}`,
      d.mensagem ? `Mensagem: ${d.mensagem}` : '',
    ].filter(Boolean).join('\n');

    // Sem serviço de envio configurado: oferece o WhatsApp com a mensagem pronta.
    if (!endpoint) {
      status.className = 'form__status warn';
      status.innerHTML = `Seus dados estão corretos, mas o envio automático deste formulário ainda não foi configurado. Para agendar agora, <a href="${linkWhatsapp(resumo)}" target="_blank" rel="noopener">envie sua solicitação pelo WhatsApp${avisoAba}</a> (a mensagem já vai preenchida) ou ligue para ${telefone}.`;
      return;
    }

    const botao = form.querySelector('button[type=submit]');
    botao.disabled = true;
    botao.setAttribute('aria-busy', 'true');
    try {
      const resposta = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(d),
      });
      if (!resposta.ok) throw new Error(String(resposta.status));
      form.reset();
      status.className = 'form__status ok';
      status.textContent = sucesso;
    } catch {
      status.className = 'form__status err';
      status.innerHTML = `Não foi possível enviar agora. Tente novamente ou <a href="${linkWhatsapp(resumo)}" target="_blank" rel="noopener">fale conosco pelo WhatsApp${avisoAba}</a>.`;
    } finally {
      botao.disabled = false;
      botao.removeAttribute('aria-busy');
    }
  });
}
