// Atividades especiais (folder Matrículas/Rematrícula 2027).
// Alimenta os blocos das casas (Estrutura) e a versão detalhada da Proposta pedagógica.
export type Turma = 'bercario' | 'm1' | 'm2' | 'n3' | 'n4' | 'n5';
export type Turno = 'Manhã' | 'Tarde' | 'Integral';

export interface Atividade {
  nome: string;
  turno: Turno;
  turmas: Turma[];
  /** Turmas atendidas, como aparece no site. */
  publico: string;
  frequencia?: string;
  detalhe?: string;
  /** Observação para turmas específicas (ex.: Capoeira para o M2 só no 2º semestre). */
  observacoes?: Partial<Record<Turma, string>>;
}

const TODAS: Turma[] = ['bercario', 'm1', 'm2', 'n3', 'n4', 'n5'];
const NIVEIS: Turma[] = ['n3', 'n4', 'n5'];

export const atividades: Atividade[] = [
  { nome: 'Musicalização Infantil', turno: 'Manhã', turmas: TODAS, publico: 'Berçário ao Nível 5' },
  { nome: 'Yoga', turno: 'Manhã', turmas: NIVEIS, publico: 'Níveis 3 a 5' },
  { nome: 'Quintais Brincantes', turno: 'Manhã', turmas: TODAS, publico: 'Berçário ao Nível 5' },
  { nome: 'Oficinas Recreativas', turno: 'Manhã', turmas: TODAS, publico: 'Berçário ao Nível 5' },
  { nome: 'Ballet', turno: 'Tarde', turmas: NIVEIS, publico: 'Níveis 3 a 5' },
  {
    nome: 'Capoeira',
    turno: 'Tarde',
    turmas: ['m2', ...NIVEIS],
    publico: 'Níveis 3 a 5; Maternal 2 no 2º semestre',
    observacoes: { m2: 'no 2º semestre' },
  },
  { nome: 'Corpo e Movimento', turno: 'Tarde', turmas: ['m1', 'm2'], publico: 'Maternal 1 e 2' },
  { nome: 'Inglês CNA', turno: 'Tarde', turmas: NIVEIS, publico: 'Níveis 3 a 5', frequencia: '2x por semana' },
  { nome: 'Robótica “Pequenos Inventores”', turno: 'Tarde', turmas: ['n4', 'n5'], publico: 'Níveis 4 e 5', frequencia: '1x por semana' },
  {
    nome: 'Oficinas especiais',
    turno: 'Tarde',
    turmas: TODAS,
    publico: 'Todas as turmas',
    detalhe: 'Arte circense, contação de histórias e teatro.',
  },
  { nome: 'Educação Socioambiental', turno: 'Integral', turmas: TODAS, publico: 'Berçário ao Nível 5' },
  { nome: 'Cultura Maker', turno: 'Integral', turmas: TODAS, publico: 'Berçário ao Nível 5' },
  { nome: 'Educação Socioemocional', turno: 'Integral', turmas: TODAS, publico: 'Berçário ao Nível 5' },
  { nome: 'Saúde e Nutrição', turno: 'Integral', turmas: TODAS, publico: 'Berçário ao Nível 5' },
];

export const turnos: Turno[] = ['Manhã', 'Tarde', 'Integral'];

/** Atividades oferecidas a pelo menos uma das turmas, com a observação específica (se houver). */
export function atividadesPara(turmas: Turma[]) {
  return atividades
    .filter((a) => a.turmas.some((t) => turmas.includes(t)))
    .map((a) => {
      const nota = turmas.map((t) => a.observacoes?.[t]).find(Boolean);
      // Atividade que só parte das turmas da casa recebe (ex.: Robótica no Espaço Estrela).
      const parcial = !turmas.every((t) => a.turmas.includes(t)) && turmas.length > 1 ? a.publico : undefined;
      return { ...a, nota: nota ?? parcial };
    });
}
