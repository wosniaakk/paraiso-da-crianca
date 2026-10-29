// Fonte única das casas do Paraíso: alimenta a Home e a página Estrutura.
export interface Casa {
  id: string;
  nome: string;
  turma: string;
  cor: 'blue' | 'yellow' | 'green' | 'orange';
}

export const casas: Casa[] = [
  { id: 'casa-nuvem', nome: 'Nuvem', turma: 'Berçário', cor: 'blue' },
  { id: 'casa-sol', nome: 'Sol', turma: 'Maternal 1', cor: 'yellow' },
  { id: 'casa-lua-e-lagos', nome: 'Lua e Lagos', turma: 'Maternal 2', cor: 'green' },
  { id: 'casa-espaco-estrela', nome: 'Espaço Estrela', turma: 'Níveis 3, 4 e 5', cor: 'orange' },
];
