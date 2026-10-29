// Cada foto aparece em uma única página e sempre com a mesma legenda.
// Das imagens em public/images, só há DUAS fotos diferentes:
//   - hero-garden.webp (duas crianças com uma lupa)  → Home (hero)
//   - music.webp (bebê com violão)                   → Estrutura
// grass-circle, creative-play e painting são recortes da mesma cena do hero e não são usadas.
// Onde faltam fotos, as páginas usam um bloco de cor da marca (pendência: fotos reais com autorização).
export interface Foto {
  src: string;
  alt: string;
  legenda?: string;
}

export const fotos = {
  heroJardim: { src: '/images/hero-garden.webp', alt: 'Duas crianças com o uniforme da escola observam uma planta com uma lupa no jardim' },
  musica: { src: '/images/music.webp', alt: 'Bebê explora as cordas de um violão', legenda: 'Descobertas pela música' },
} satisfies Record<string, Foto>;
