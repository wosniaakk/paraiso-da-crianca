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
territorios/index.html               Territórios
proposta-pedagogica/index.html       Proposta Pedagógica
contato/index.html                   Contato (formulário de visita)
politica-de-privacidade/index.html   Política de Privacidade
404.html                             Página de "não encontrado"

assets/site.css    visual do site (cores, tipografia, componentes)
assets/site.js     menu do celular, animações de entrada, cabeçalho e formulário
img/               fotos: cada uma em .jpg/.png e .webp
videos/            vídeo da linha do tempo (Nossa História)

sitemap.xml, robots.txt          para os buscadores
PENDENCIAS.md                    textos e fotos que ainda dependem da escola
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

## Formulário de contato

O formulário (`contato/index.html`) valida os dados no navegador. Hoje **não há serviço de envio
configurado**: ao enviar, o site mostra um link para o WhatsApp da escola com a mensagem já preenchida.

Para receber os pedidos por e-mail, crie um formulário no Formspree (formspree.io) ou serviço parecido e cole o
endereço no atributo `data-endpoint` do `<form>`:

```html
<form class="form" id="form" … data-endpoint="https://formspree.io/f/abcdwxyz" …>
```

Com o endereço preenchido, o site envia os dados por `POST` (JSON) e mostra a mensagem de sucesso que está em
`data-sucesso`. Ao ativar, atualize a seção "Com quem compartilhamos" da Política de Privacidade, se precisar.

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
