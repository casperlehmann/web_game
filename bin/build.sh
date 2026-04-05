#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."
npm install --silent
npx vite build
mv dist/index.html dist/game.html
echo "Build complete: dist/game.html"
