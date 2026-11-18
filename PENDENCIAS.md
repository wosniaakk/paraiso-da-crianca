# Pendências do site

Trechos que ainda dependem de informação da escola. No HTML, os textos entre colchetes aparecem
destacados em amarelo (`<span class="todo">[...]</span>`) até serem substituídos.
Para achar todos: procure por `class="todo"` nos arquivos `.html`.

## Textos entre colchetes

| Página | Arquivo | Trecho | Onde |
|---|---|---|---|
| Início | `index.html` | `[Depoimento a receber da escola]`, `[Nome]` e quem é a pessoa | Seção "O que dizem as famílias" (5 cartões) |

### Depoimentos das famílias

Pedir à escola, para cada depoimento:
- o texto (curto: 2 a 4 frases funcionam melhor no cartão);
- o nome como deve aparecer;
- quem é a pessoa: mãe ou pai de criança do Paraíso, pai ou mãe que estudou no Paraíso, alguém que viveu a infância aqui, família do Berçário;
- autorização para publicar.

O guia de escrita do site evita a palavra "aluno"; por isso os rótulos de exemplo usam "criança do Paraíso" e "estudou no Paraíso".
No HTML, cada depoimento é um `<li class="depo__card">`: troque os textos entre colchetes e, para incluir mais um, copie um `<li>` inteiro.
Se sobrar cartão sem depoimento, apague o `<li>` dele.

## Confirmar com a escola

- **E-mail:** o site usa `contato@ceiparaisodacrianca.com.br` em todas as páginas e nos dados estruturados (JSON-LD de
  `index.html`). A versão anterior do site usava `contato@paraisodacrianca.com.br`. Confirmar qual caixa existe e recebe
  mensagens. Se for a antiga, busque `contato@ceiparaisodacrianca.com.br` em todos os `.html` e troque.
- **Horários da Educação Infantil:** a página Educação Infantil repete os períodos e horários do Berçário. Confirmar se são
  os mesmos.

## Imagens a produzir

Estão listadas em [IMAGENS-PENDENTES.md](IMAGENS-PENDENTES.md): são 15 fotos, numeradas de #01 a #15.

## Portfólio

A página Portfólio começa com as 10 fotos que o site já tem. Pedir à escola mais fotos de espaços, natureza, atividades e
Berçário (com autorização de uso de imagem) e incluir como explicado no README.

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
