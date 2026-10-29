# Paraíso da Criança: site institucional

Site estático em [Astro](https://astro.build), publicado no GitHub Pages (`https://edu-rdp.github.io/`).

## Comandos

| Comando | O que faz |
|---|---|
| `npm install` | Instala as dependências |
| `npm run dev` | Servidor de desenvolvimento em `localhost:4321` |
| `npm run build` | Gera o site em `dist/` |
| `npm run preview` | Serve o `dist/` localmente |
| `npm run qa` | Verificação automática (Playwright + axe-core); requer `npm run build` antes e `npx playwright install chromium` uma vez |

## Formulário de agendamento (`PUBLIC_FORM_ENDPOINT`)

A página **Agende sua visita** tem um formulário curto. Como o site não tem backend, o envio depende de uma variável lida **no momento do build**:

- **`PUBLIC_FORM_ENDPOINT` definida:** o formulário faz `POST` (via `fetch`, `FormData`, cabeçalho `Accept: application/json`) para esse endereço e mostra uma mensagem de sucesso. Funciona com Formspree (`https://formspree.io/f/<id>`) e Web3Forms (`https://api.web3forms.com/submit`; nesse caso defina também `PUBLIC_FORM_ACCESS_KEY`).
- **Sem a variável:** o botão vira "Enviar pelo WhatsApp ↗" e abre o WhatsApp da escola, em nova aba, com os dados já escritos na mensagem.

Para configurar localmente, copie `.env.example` para `.env`. No GitHub Pages, cadastre a variável em *Settings → Secrets and variables → Actions → Variables*; o workflow `deploy.yml` a repassa para o build.

> Se ativar um serviço de formulário, atualize a seção "Quando você fala com a escola" da Política de Privacidade com o nome do serviço (`src/pages/privacidade.astro`).

## Onde ficam os conteúdos

- `src/data/site.ts`: contato, endereço, horário, navegação
- `src/data/casas.ts`: casas, turmas e idades (Home + Estrutura)
- `src/data/atividades.ts`: atividades especiais por turno e turma
- `src/lib/whatsapp.ts`: todos os links do WhatsApp (com mensagem pronta)

Trechos que dependem de confirmação da escola estão marcados com `CONFIRMAR COM A ESCOLA`.

## Verificação

```bash
npm run build && npm run qa                                   # rolagem, dobra, axe, alvos, links (screenshots em qa/)
node scripts/testar-formulario.mjs whatsapp http://localhost:4321   # com `npm run preview` rodando
PUBLIC_FORM_ENDPOINT=https://formspree.io/f/teste npm run build && node scripts/testar-formulario.mjs endpoint http://localhost:4321
node scripts/auditar-links.mjs                                # rótulo × destino de todos os links
```

## Pendências com a escola

- Confirmar as idades de cada casa (`src/data/casas.ts`) e os textos de ambiente/rotina
- Respostas da FAQ ainda ocultas (`publicar: false` em `src/data/faq.ts`): documentos para matrícula, período de adaptação, segurança e controle de acesso, calendário, equipe
- Prazo médio de resposta e dias/horários de visita (`prazoResposta` e `diasVisita` em `src/data/site.ts`)
- E-mail institucional e/ou conta no serviço de formulário (`PUBLIC_FORM_ENDPOINT`)
- Razão social, CNPJ e canal formal para pedidos da LGPD; revisão jurídica da Política de Privacidade (incluindo prazo de guarda dos dados)
- Fotos reais e diferentes entre si (casas, salas, áreas externas), com autorização de uso de imagem. Hoje só há duas fotos distintas; `grass-circle`, `creative-play` e `painting` são recortes da foto do hero
