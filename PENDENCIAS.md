# Pendências do site

Trechos que ainda dependem de informação da escola. No HTML, os textos entre colchetes aparecem
destacados em amarelo (`<span class="todo">[...]</span>`) até serem substituídos.
Para achar todos: procure por `class="todo"` nos arquivos `.html`.

## Textos entre colchetes

| Página | Arquivo | Trecho | Onde |
|---|---|---|---|
| Territórios | `territorios/index.html` | `[Faixa etária]` | Espaço **Nuvem** (seção "Nossos espaços") |
| Territórios | `territorios/index.html` | `[Faixa etária]` | Espaço **Sol** |
| Territórios | `territorios/index.html` | `[Faixa etária]` | Espaço **Lago** |
| Territórios | `territorios/index.html` | `[Faixa etária]` | Espaço **Lua** |
| Territórios | `territorios/index.html` | `[Faixa etária]` | Espaço **Estrela** |
| Política de Privacidade | `politica-de-privacidade/index.html` | `[RAZÃO SOCIAL]` | Seção 1, "Quem é responsável pelos seus dados" |
| Política de Privacidade | `politica-de-privacidade/index.html` | `[CNPJ]` | Seção 1, "Quem é responsável pelos seus dados" |

## Textos provisórios (Lorem ipsum)

| Página | Arquivo | Onde |
|---|---|---|
| Territórios | `territorios/index.html` | Descrição dos 5 espaços (Nuvem, Sol, Lago, Lua, Estrela) |

> Os nomes dos espaços também precisam de confirmação: a versão anterior do site usava
> Nuvem (Berçário), Sol (Maternal 1), Lua e Lagos (Maternal 2) e Espaço Estrela (Níveis 3, 4 e 5).

## Fotos a definir

Estes espaços mostram o quadro cinza "Foto a definir". Para trocar, substitua o `<figure ... role="img">`
por uma foto no mesmo formato das outras (`<picture>` com `.webp` + `.jpg`) e mantenha a descrição no `alt`.

| Página | Arquivo | Descrição prevista |
|---|---|---|
| Início | `index.html` | Ambiente externo da escola (mosaico "Territórios de aprendizagem") |
| Início | `index.html` | Mãos de criança em experiência sensorial (mosaico) |
| Início | `index.html` | Espaço de aprendizagem (mosaico) |
| Início | `index.html` | Crianças em brincadeira livre (mosaico) |
| Berçário | `bercario/index.html` | Bebê em exploração sensorial ("Descobrir com todos os sentidos") |
| Berçário | `bercario/index.html` | Bebê em ambiente natural ("Natureza desde os primeiros encontros") |
| Territórios | `territorios/index.html` | Ambiente de investigação (galeria) |
| Territórios | `territorios/index.html` | Espaço de brincar (galeria) |
| Territórios | `territorios/index.html` | Ambiente de acolhimento (galeria) |
| Territórios | `territorios/index.html` | Espaço de convivência (galeria) |
| Proposta Pedagógica | `proposta-pedagogica/index.html` | Registro de projeto pedagógico ("Currículo e abordagens") |
| Proposta Pedagógica | `proposta-pedagogica/index.html` | Experiência de cultura maker |
| Proposta Pedagógica | `proposta-pedagogica/index.html` | Educadora conversa com crianças |

Use apenas fotos com autorização de uso de imagem assinada pelos responsáveis.

## Dados para SEO (Google)

Não estão no site porque não foram informados; ajudam o Google a mostrar a escola no mapa e na busca local:

- CEP do endereço (`postalCode` nos dados estruturados de `index.html`)
- Dias de funcionamento (o site informa só o horário da secretaria, 07h15 às 18h45)
- Coordenadas exatas (latitude/longitude) e link do perfil no Google Maps / Perfil da Empresa

## Outros

- Política de Privacidade: revisão jurídica, nome do encarregado (DPO) se houver, e confirmar o prazo de guarda (hoje "12 meses").
- Formulário de contato: ainda sem serviço de envio. Veja "Formulário" no README.
