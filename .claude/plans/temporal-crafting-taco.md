# Platform Game: Rabbit Collects Carrots

## Context
Build a single-page 2D platform game (rabbit collecting carrots) with modular Svelte 5 source code that compiles to one self-contained HTML file at `dist/game.html`.

## Tech Stack
- **Svelte 5** with runes (`$state`, `$derived`, `$effect`, `$props`) — not SvelteKit (no routing/SSR needed)
- **Vite** as build tool
- **vite-plugin-singlefile** to inline all JS/CSS into a single HTML
- **Canvas 2D API** for game rendering (all art drawn programmatically, no external assets)

## File Structure
```
├── bin/build.sh                     # Build script → dist/game.html
├── index.html                       # Vite entry template
├── package.json                     # svelte, vite, @sveltejs/vite-plugin-svelte, vite-plugin-singlefile
├── vite.config.js                   # Vite + Svelte + singlefile plugin
├── svelte.config.js                 # compilerOptions: { runes: true }
├── .gitignore
├── src/
│   ├── main.js                      # mount(App, { target: ... })
│   ├── App.svelte                   # Root: holds score ($state), gameStatus ($derived)
│   ├── components/
│   │   ├── GameCanvas.svelte        # <canvas> + $effect for game loop lifecycle
│   │   └── ScoreBoard.svelte        # HUD overlay via $props
│   ├── engine/
│   │   ├── gameLoop.js              # requestAnimationFrame loop with delta time
│   │   ├── physics.js               # Gravity, movement, AABB collision, carrot pickup
│   │   └── input.js                 # Keyboard listener (arrows/WASD + space)
│   ├── entities/
│   │   ├── player.js                # createPlayer(x, y) → plain object
│   │   ├── platform.js              # createPlatform(x, y, w, h)
│   │   └── carrot.js                # createCarrot(x, y)
│   ├── levels/
│   │   └── level1.js                # Platform layout, carrot positions, spawn point
│   └── rendering/
│       ├── renderer.js              # Orchestrates draw order: bg → platforms → carrots → player
│       ├── drawBackground.js        # Sky gradient + clouds
│       ├── drawPlatform.js          # Brown rect + green grass strip
│       ├── drawCarrot.js            # Orange triangle + green leaves
│       └── drawPlayer.js            # White rabbit from canvas primitives
```

## Architecture

**Key principle**: Game entity state is plain JS objects (not reactive). Only UI-facing state uses runes. This avoids 60fps reactivity overhead.

- `$state` / `$derived` — score, totalCarrots, gameStatus in `App.svelte`
- `$effect` — canvas init, game loop start/cleanup, window resize listener
- `$props` — component inputs (callbacks, display values)
- Engine modules are pure JS — no Svelte/DOM dependencies

## Game Design
- **Canvas**: 800×600 logical pixels, CSS-scaled to fit viewport
- **Player**: Rabbit with left/right movement (300 px/s) and jump (-500 px/s)
- **Physics**: Gravity 1200 px/s², max fall 800 px/s, dt capped at 50ms
- **Level**: Ground platform + 6-8 floating platforms at staggered heights, 8-10 carrots
- **Win condition**: Collect all carrots → congratulations overlay
- **Respawn**: Fall off bottom → reset to spawn point

## Build Pipeline (`bin/build.sh`)
```bash
#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."
npm install --silent
npx vite build
mv dist/index.html dist/game.html
echo "Build complete: dist/game.html"
```

## Implementation Order
1. Scaffold: package.json, configs, index.html, main.js, minimal App.svelte
2. Canvas + game loop: GameCanvas.svelte, gameLoop.js, drawBackground.js, renderer.js
3. Level + platforms: entities, level1.js, drawPlatform.js
4. Player + physics: player.js, input.js, physics.js, drawPlayer.js
5. Collisions: platform landing/blocking in physics.js
6. Carrots + score: carrot.js, drawCarrot.js, ScoreBoard.svelte, collection logic
7. Polish: win state overlay, respawn, visual tweaks
8. Build: bin/build.sh, verify dist/game.html works standalone

## Verification
1. `npm run dev` — game runs in browser, rabbit moves/jumps, collects carrots, score updates
2. `bin/build.sh` — produces `dist/game.html`
3. Open `dist/game.html` directly in browser (file:// protocol) — fully functional, no network requests
