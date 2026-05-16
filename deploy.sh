#!/bin/bash
set -e

echo "Desplegando a GitHub Pages..."

git checkout gh-pages
git checkout master -- PORTAL/ PIZARRA/ supabase/
git add PORTAL/ PIZARRA/ supabase/

if git diff --cached --quiet; then
  echo "Sin cambios desde el último deploy."
else
  git commit -m "deploy: $(date '+%Y-%m-%d %H:%M')"
  git push origin gh-pages
  echo "Deploy completado → https://patolastra.github.io/profe-apps/"
fi

git checkout master
