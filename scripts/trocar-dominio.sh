#!/bin/sh
# Troca o domínio usado nas URLs absolutas (canonical, Open Graph, dados estruturados, sitemap e robots).
# Uso: sh scripts/trocar-dominio.sh https://novo-dominio.com.br
set -e
DOMINIO_ATUAL='https://ceiparaisodacrianca.com.br'
NOVO="${1%/}"
[ -n "$NOVO" ] || { echo "Uso: sh scripts/trocar-dominio.sh https://novo-dominio.com.br"; exit 1; }
cd "$(dirname "$0")/.."
grep -rl --include='*.html' --include='sitemap.xml' --include='robots.txt' "$DOMINIO_ATUAL" . | while read -r arquivo; do
  sed -i.bak "s#$DOMINIO_ATUAL#$NOVO#g" "$arquivo" && rm "$arquivo.bak"
  echo "✓ $arquivo"
done
sed -i.bak "s#^DOMINIO_ATUAL=.*#DOMINIO_ATUAL='$NOVO'#" scripts/trocar-dominio.sh && rm scripts/trocar-dominio.sh.bak
