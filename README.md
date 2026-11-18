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
portfolio/index.html                 Portfólio (fotos por categoria)
territorios/index.html               endereço antigo: redireciona para /espacos/
contato/index.html                   endereço antigo: abre o WhatsApp da escola
proposta-pedagogica/index.html       Proposta Pedagógica
politica-de-privacidade/index.html   Política de Privacidade
404.html                             Página de "não encontrado"

assets/site.css    visual do site (cores, tipografia, componentes)
assets/site.js     menu do celular, animações de entrada, cabeçalho e formulário
img/               fotos: cada uma em .jpg/.png e .webp
videos/            vídeo da linha do tempo (Nossa História)

sitemap.xml, robots.txt          para os buscadores
PENDENCIAS.md                    textos e dados que ainda dependem da escola
IMAGENS-PENDENTES.md             fotos a produzir (#01 a #15)
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

O menu tem Nossa História, Espaços, Proposta Pedagógica, Portfólio e o botão "Agende uma visita"; Berçário, Educação
Infantil e Política de Privacidade ficam no rodapé.

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

### Portfólio: incluir uma foto

Em `portfolio/index.html`, copie um bloco `<figure class="pitem" ...>` inteiro e troque o nome dos arquivos, o `alt`,
a legenda (em `data-legenda` e no `<figcaption>`) e as medidas. Em `data-cat`, coloque uma ou mais categorias separadas
por espaço: `espacos`, `natureza`, `atividades`, `bercario`. O filtro "Todas" mostra todas as fotos.

### Depoimentos

Ficam na Início, seção "O que dizem as famílias". Cada um é um `<li class="depo__card">` com o texto, o nome e quem é a
pessoa. A fileira rola sozinha a cada 6 segundos (para com o mouse em cima, com o botão de pausa ou quando o sistema pede
menos movimento) e também pode ser rolada à mão.

## Agendamento de visitas

Todos os botões "Agende uma visita" abrem o WhatsApp da escola (`wa.me/554133477341`) em nova aba, com a mensagem
"Olá! Gostaria de agendar uma visita ao Paraíso da Criança." O site não tem formulário. O endereço antigo `/contato/`
também abre o WhatsApp. Para trocar o número ou a mensagem, busque `wa.me/554133477341` em todos os `.html`.

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
