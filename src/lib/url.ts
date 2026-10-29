// Prefixa caminhos internos com o `base` do astro.config, para funcionar no GitHub Pages.
export function url(path: string): string {
  const base = import.meta.env.BASE_URL.replace(/\/$/, '');
  if (!path.startsWith('/')) return path;
  return `${base}${path}` || '/';
}
