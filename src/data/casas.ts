// Fonte única das casas do Paraíso: alimenta a Home e a página Estrutura.
import type { Turma } from './atividades';

export interface Casa {
  id: string;
  nome: string;
  turma: string;
  /** Idade em linguagem comum, exibida junto ao nome da casa. */
  idade: string;
  /** Duas linhas sobre o ambiente e a rotina. */
  descricao: string;
  turmas: Turma[];
  cor: 'blue' | 'yellow' | 'green' | 'orange';
}

// CONFIRMAR COM A ESCOLA: idades seguem a convenção usual (idade completa até 31/03).
// CONFIRMAR COM A ESCOLA: descrições escritas a partir do briefing (espaço próprio por
// faixa etária, sem revezamento de parque, boa parte da rotina ao ar livre).
export const casas: Casa[] = [
  {
    id: 'casa-nuvem',
    nome: 'Nuvem',
    turma: 'Berçário',
    idade: 'a partir de 6 meses (até 1 ano)',
    descricao: 'Os bebês têm um espaço só deles, separado das outras turmas. Parte da rotina acontece ao ar livre, no ritmo de cada um.',
    turmas: ['bercario'],
    cor: 'blue',
  },
  {
    id: 'casa-sol',
    nome: 'Sol',
    turma: 'Maternal 1',
    idade: '1 ano',
    descricao: 'A turma de 1 ano tem seu próprio espaço e usa os quintais e o parque sem revezar com outras idades. Boa parte do dia acontece fora de sala.',
    turmas: ['m1'],
    cor: 'yellow',
  },
  {
    id: 'casa-lua-e-lagos',
    nome: 'Lua e Lagos',
    turma: 'Maternal 2',
    idade: '2 anos',
    descricao: 'A turma de 2 anos tem seu próprio espaço, sem revezamento de parque. A rotina alterna a sala e as áreas externas da escola.',
    turmas: ['m2'],
    cor: 'green',
  },
  {
    id: 'casa-espaco-estrela',
    nome: 'Espaço Estrela',
    turma: 'Níveis 3, 4 e 5',
    idade: '3, 4 e 5 anos',
    descricao: 'O espaço dos maiores reúne os Níveis 3, 4 e 5. Boa parte do dia acontece fora de sala, nos quintais, no pomar e no parque.',
    turmas: ['n3', 'n4', 'n5'],
    cor: 'orange',
  },
];
