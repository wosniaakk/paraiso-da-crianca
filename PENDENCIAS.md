# Pendências do site

Trechos que ainda dependem de informação da escola. No HTML, os textos entre colchetes aparecem
destacados em amarelo (`<span class="todo">[...]</span>`) até serem substituídos.
Para achar todos: procure por `class="todo"` nos arquivos `.html`.

## Textos entre colchetes

| Página | Arquivo | Trecho | Onde |
|---|---|---|---|
| Política de Privacidade | `politica-de-privacidade/index.html` | `[RAZÃO SOCIAL]` | Seção 1, "Quem é responsável pelos seus dados" |
| Política de Privacidade | `politica-de-privacidade/index.html` | `[CNPJ]` | Seção 1, "Quem é responsável pelos seus dados" |

## Confirmar com a escola

- **E-mail:** o site usa `contato@ceiparaisodacrianca.com.br` em todas as páginas e nos dados estruturados (JSON-LD de
  `index.html`). A versão anterior do site usava `contato@paraisodacrianca.com.br`. Confirmar qual caixa existe e recebe
  mensagens. Se for a antiga, busque `contato@ceiparaisodacrianca.com.br` em todos os `.html` e troque.
- **Horários da Educação Infantil:** a página Educação Infantil repete os períodos e horários do Berçário. Confirmar se são
  os mesmos.

## Imagens e vídeos a produzir

Estão listados em [IMAGENS-PENDENTES.md](IMAGENS-PENDENTES.md): são 15 fotos e 3 vídeos, numerados de #01 a #18.

Os vídeos de depoimento (Início, "O que dizem as famílias") precisam de autorização de uso de imagem das famílias.
O site não traz falas nem nomes; o conteúdo vem dos vídeos reais.

## Dados para SEO (Google)

Não estão no site porque não foram informados; ajudam o Google a mostrar a escola no mapa e na busca local:

- CEP do endereço (`postalCode` nos dados estruturados de `index.html`)
- Dias de funcionamento (o site informa só o horário de atendimento, 7h15 às 18h45)
- Coordenadas exatas (latitude/longitude) e link do perfil no Google Maps / Perfil da Empresa

## Outros

- **Política de Privacidade:**
  - revisão jurídica;
  - nome do encarregado (DPO), se houver;
  - confirmar o prazo de guarda (hoje "12 meses");
  - a data da última atualização foi retirada do texto, junto com as outras datas que envelhecem; se a revisão jurídica
    pedir a data, inclua de novo.
