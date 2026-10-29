// Perguntas frequentes (página Agende sua visita), agrupadas por tema.
// Entradas com `publicar: false` ainda não têm resposta confirmada pela escola:
// não aparecem no site e estão na lista de pendências.
import { casas } from './casas';
import { site } from './site';
import { url } from '../lib/url';
import { whatsapp } from '../lib/whatsapp';

export interface Pergunta {
  pergunta: string;
  /** Pode conter HTML simples (links, listas). */
  resposta: string;
  link?: { href: string; rotulo: string };
  publicar: boolean;
}

export interface Tema {
  tema: string;
  perguntas: Pergunta[];
}

const listaCasas = casas.map((c) => `<li><strong>${c.nome}</strong>: ${c.turma}, ${c.idade}</li>`).join('');

export const faq: Tema[] = [
  {
    tema: 'Idades e horários',
    perguntas: [
      {
        pergunta: 'Quais idades vocês atendem?',
        resposta: `Atendemos crianças de 6 meses a 6 anos, cada faixa etária na sua própria casa:<ul>${listaCasas}</ul>Veja como é cada casa na página <a href="${url('/estrutura#casas')}">Estrutura</a>.`,
        publicar: true,
      },
      {
        pergunta: 'Quais são os turnos e horários?',
        resposta:
          '<ul><li><strong>Manhã:</strong> 7h30 às 11h30</li><li><strong>Tarde:</strong> 13h às 17h</li><li><strong>Intermediário:</strong> 10h30 às 17h (manhã) ou 13h às 18h30 (tarde)</li><li><strong>Integral:</strong> 7h30 às 18h30</li></ul>',
        publicar: true,
      },
      {
        pergunta: 'Qual o horário de atendimento da secretaria?',
        resposta: `${site.atendimento}, pelo telefone ou WhatsApp ${site.telefone}.`,
        publicar: true,
      },
    ],
  },
  {
    tema: 'Cuidado e saúde',
    perguntas: [
      {
        pergunta: 'Como funciona a alimentação?',
        resposta: 'A escola tem acompanhamento nutricional para garantir uma alimentação saudável e equilibrada para as crianças.',
        publicar: true,
      },
      {
        pergunta: 'E se meu filho passar mal na escola?',
        resposta:
          'A escola tem parceria com a Centauro para emergências médicas e com o Hospital Pequeno Príncipe para consultas on-line em casos especiais.',
        publicar: true,
      },
      { pergunta: 'Como funcionam a segurança e o controle de acesso?', resposta: '', publicar: false },
    ],
  },
  {
    tema: 'Atividades',
    perguntas: [
      {
        pergunta: 'Vocês têm inglês?',
        resposta: 'Sim. Os Níveis 3, 4 e 5 têm aulas de inglês com o CNA, duas vezes por semana, no período da tarde.',
        publicar: true,
      },
      {
        pergunta: 'Quais atividades especiais existem?',
        resposta:
          'Musicalização, yoga, ballet, capoeira, corpo e movimento, robótica, quintais brincantes, oficinas e projetos de educação socioambiental, cultura maker e socioemocional. As atividades variam conforme a turma e o turno.',
        link: { href: url('/proposta-pedagogica#atividades'), rotulo: 'Conhecer a proposta pedagógica' },
        publicar: true,
      },
    ],
  },
  {
    tema: 'Matrícula e visita',
    perguntas: [
      {
        pergunta: 'Quanto custa a mensalidade?',
        resposta: 'Os valores e as condições de matrícula são atualizados a cada ano e informados diretamente pela secretaria.',
        link: {
          href: whatsapp(
            'Olá! Gostaria de saber os valores e as condições de matrícula do Paraíso da Criança. Idade da criança: __. Período de interesse: __.',
          ),
          rotulo: 'Conversar no WhatsApp',
        },
        publicar: true,
      },
      {
        pergunta: 'Como agendar uma visita?',
        resposta: `Fale com a secretaria pelo WhatsApp ou pelo telefone ${site.telefone}, ou <a href="#formulario">preencha o formulário</a> desta página. A equipe combina com você o melhor horário.`,
        publicar: true,
      },
      {
        pergunta: 'Onde fica a escola?',
        resposta: `Na Rua Des. Ernani G. Cartaxo, 564, no Capão Raso, em Curitiba (PR). <a href="#como-chegar">Veja o mapa</a>.`,
        publicar: true,
      },
      { pergunta: 'Quais documentos são necessários para a matrícula?', resposta: '', publicar: false },
      { pergunta: 'Como funciona o período de adaptação?', resposta: '', publicar: false },
      { pergunta: 'Onde encontro o calendário escolar?', resposta: '', publicar: false },
      { pergunta: 'Quem é a equipe da escola?', resposta: '', publicar: false },
    ],
  },
];
