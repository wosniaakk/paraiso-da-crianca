# Site da Escola Paraíso da Criança

Site estático em HTML, CSS e JavaScript puros: **sem build e sem framework**. Cada página é um arquivo HTML
com os textos escritos direto nele. O JavaScript cuida só das interações; com ele desligado, todo o conteúdo
continua aparecendo.

Endereço final: **https://ceiparaisodacrianca.com.br** (hoje publicado pelo GitHub Pages).

## Estrutura

```
index.html                           Início
nossa-historia/index.html            Nossa História
bercario/index.html                  Berçário
educacao-infantil/index.html         Educação Infantil
espacos/index.html                   Espaços
territorios/index.html               endereço antigo: redireciona para /espacos/
proposta-pedagogica/index.html       Proposta Pedagógica
contato/index.html                   Contato (formulário de visita)
politica-de-privacidade/index.html   Política de Privacidade
404.html                             Página de "não encontrado"

assets/site.css    visual do site (cores, tipografia, componentes)
assets/site.js     menu do celular, animações de entrada, cabeçalho e formulário
img/               fotos: cada uma em .jpg/.png e .webp
videos/            vídeos (linha do tempo da Nossa História e, quando chegarem, depoimentos das famílias)

sitemap.xml, robots.txt          para os buscadores
PENDENCIAS.md                    textos e dados que ainda dependem da escola
IMAGENS-PENDENTES.md             fotos e vídeos a produzir (#01 a #18)
scripts/trocar-dominio.sh        troca o domínio das URLs absolutas
.github/workflows/deploy.yml     publica no GitHub Pages a cada push na main
```

Cada pasta tem um `index.html`, então as URLs ficam limpas (`/bercario/`). Links, imagens, CSS e JS usam
**caminhos relativos** (`../img/...`), por isso o site funciona tanto em `usuario.github.io/paraiso-da-crianca/`
quanto no domínio próprio.

## Como editar os textos

Abra o arquivo da página e altere o texto entre as tags. Alguns padrões que se repetem:

| No HTML | Aparece como |
|---|---|
| `<span class="accent">palavra</span>` dentro de um título | palavra em vermelho |
| `<strong>palavra</strong>` num texto | palavra em negrito |
| `<p>…</p>` | um parágrafo |
| `<ul><li>…</li></ul>` | lista com marcadores |
| `<span class="todo">[TEXTO]</span>` | pendência destacada em amarelo (veja `PENDENCIAS.md`) |
| `<span class="kicker">…</span>` | etiqueta acima do título |
| `<span class="script">…</span>` | frase na fonte manuscrita |

O menu tem Nossa História, Espaços, Proposta Pedagógica e o botão "Agende uma visita"; Berçário, Educação Infantil,
Contato e Política de Privacidade ficam no rodapé.

Partes repetidas em todas as páginas (cabeçalho, menu, rodapé, botão do WhatsApp) estão escritas em cada
arquivo. Ao mudar uma delas, por exemplo o telefone, troque em todos os `.html`: uma busca no editor por
`3347-7341` encontra todos os lugares.

Cada página tem no `<head>` o título (`<title>`), a descrição (`<meta name="description">`) e as tags de
compartilhamento (Open Graph / Twitter). Ao mudar o assunto de uma página, atualize esses campos também.

### Fotos

Cada foto usa `<picture>`: o navegador pega a versão `.webp` (mais leve) e, se não suportar, a `.jpg`/`.png`.

```html
<picture><source srcset="img/foto.webp" type="image/webp"><img src="img/foto.jpg" alt="Descrição da cena" width="1600" height="1100" loading="lazy" decoding="async"></picture>
```

- Fotos com no máximo **1600 px** de largura; `width` e `height` com as medidas reais do arquivo.
- `alt` descrevendo a cena em português.
- `loading="lazy"` em todas, exceto a imagem principal do topo da página, que usa `fetchpriority="high"`.
- Para gerar a versão `.webp`: `cwebp -q 78 foto.jpg -o foto.webp` (ou o site squoosh.app).
- Só use fotos de crianças com autorização de uso de imagem assinada pelos responsáveis.

### Trocar um espaço reservado pela foto real

Os quadros tracejados "IMAGEM A PRODUZIR #NN" estão listados em `IMAGENS-PENDENTES.md`. Para trocar um deles:

1. Salve a foto com o nome indicado no comentário que fica logo antes do quadro no HTML
   (`<!-- IMAGEM A PRODUZIR #NN | arquivo: img/nome.jpg -->`) e gere a versão `.webp` com o mesmo nome.
2. No HTML, apague o comentário e o `<figure ... role="img" aria-label="...">` inteiro, até o `</figure>`, e cole no lugar:
   ```html
   <figure class="MESMAS CLASSES DO QUADRO" style="MESMO STYLE, SE HOUVER"><picture><source srcset="img/nome.webp" type="image/webp"><img src="img/nome.jpg" alt="Descrição da cena" width="LARGURA" height="ALTURA" loading="lazy" decoding="async"></picture></figure>
   ```
   Mantenha as classes e o `style` do quadro (eles dão o formato), use as medidas reais da foto em `width`/`height` e
   reaproveite o texto do `aria-label` como `alt`. Nas páginas dentro de pastas, o caminho começa com `../img/`.
3. Abra a página no navegador, confira o recorte e risque o item em `IMAGENS-PENDENTES.md`.

Para os vídeos das famílias (#05 a #07), o passo 2 usa um vídeo no lugar da foto, com a capa em `.jpg`:
`<figure class="rimg"><video controls playsinline preload="none" poster="videos/nome.jpg" width="1080" height="1920" style="width:100%;height:100%;object-fit:cover"><source src="videos/nome.mp4" type="video/mp4"></video></figure>`

## Formulário de contato

O formulário (`contato/index.html`) **não envia nem guarda dados**. Ele só monta uma mensagem com nome, nome da criança
(opcional), idade e melhor período, e abre o WhatsApp da escola (`wa.me`) em nova aba. O número fica em
`data-whatsapp` no `<form>` e nos links `wa.me` das páginas. A etapa (Berçário ou Educação Infantil) vem da idade escolhida.

Sem JavaScript, o botão "Agendar pelo WhatsApp" funciona como link simples para o WhatsApp com a mensagem padrão.
Se um dia o formulário passar a enviar dados para algum serviço, atualize a Política de Privacidade.

## Ver o site no computador

Qualquer servidor estático serve. Na pasta do projeto:

```bash
python3 -m http.server 8000
```

e abra `http://localhost:8000/`. Abrir os arquivos com duplo clique também funciona, mas os links de pasta
(`bercario/`) só abrem o `index.html` automaticamente num servidor.

## Publicação e domínio

- Cada push na `main` publica o site pelo GitHub Actions (Settings → Pages → Source: **GitHub Actions**).
- **Domínio próprio:** em Settings → Pages → Custom domain, informe `ceiparaisodacrianca.com.br` e configure o DNS
  (registros A para os IPs do GitHub Pages e CNAME de `www` para `usuario.github.io`). Depois marque **Enforce HTTPS**.
- **Trocar o domínio** usado em canonical, Open Graph, dados estruturados, sitemap e robots:
  `sh scripts/trocar-dominio.sh https://novo-dominio.com.br`
- **Fonte Bimbo Pro (Adobe Fonts):** o domínio final precisa estar autorizado no projeto web da Adobe;
  sem isso a fonte manuscrita cai para a Playwrite BR (Google Fonts).
- **Google Search Console:** cadastre o domínio e envie `https://ceiparaisodacrianca.com.br/sitemap.xml`.
