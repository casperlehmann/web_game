# Rabbit Run — Build Session

## Prompt

> I need to create a single page application that is contained in a single html file. But I want to develop it using a modular approach. I am thinking to use Sveltekit with runes. Please create a simple platform game with a rabbit that collects carrots. And a build system in `bin/build.sh` that compiles `dist/game.html`.

## Research

Two exploration agents ran in parallel:

1. **Project state** — Empty directory, no existing files.
2. **Svelte 5 + single-file build** — Researched runes syntax (`$state`, `$derived`, `$effect`, `$props`), SvelteKit inline bundle strategy, and `vite-plugin-singlefile`.

A planning agent then designed the full architecture (23 tool uses, 3m 27s).

**Key decision:** Plain Svelte 5 + Vite was recommended over SvelteKit — no routing/SSR needed for a single-page canvas game, and runes work identically in both. User approved.

## Tech Stack

- **Svelte 5** with runes
- **Vite** build tool
- **vite-plugin-singlefile** — inlines all JS/CSS into one HTML file
- **Canvas 2D API** — all art drawn programmatically, no external assets

## Architecture

Game entity state is plain JS objects (not reactive). Only UI-facing state uses Svelte runes. This avoids 60fps reactivity overhead.

## File Structure

```
├── bin/build.sh                     # Build script → dist/game.html
├── index.html                       # Vite entry template
├── package.json                     # Dependencies
├── vite.config.js                   # Vite + Svelte + singlefile plugin
├── svelte.config.js                 # compilerOptions: { runes: true }
├── .gitignore
└── src/
    ├── main.js                      # mount(App, { target: ... })
    ├── App.svelte                   # Root: $state(score), $derived(gameStatus)
    ├── components/
    │   ├── GameCanvas.svelte        # <canvas> + $effect game loop lifecycle
    │   └── ScoreBoard.svelte        # HUD overlay via $props
    ├── engine/
    │   ├── gameLoop.js              # requestAnimationFrame loop with delta time
    │   ├── physics.js               # Gravity, movement, AABB collision, carrot pickup
    │   └── input.js                 # Keyboard listener (arrows/WASD + space)
    ├── entities/
    │   ├── player.js                # createPlayer(x, y) → plain object
    │   ├── platform.js              # createPlatform(x, y, w, h)
    │   └── carrot.js                # createCarrot(x, y)
    ├── levels/
    │   └── level1.js                # Platform layout, carrot positions, spawn point
    └── rendering/
        ├── renderer.js              # Draw order: bg → platforms → carrots → player
        ├── drawBackground.js        # Sky gradient + clouds
        ├── drawPlatform.js          # Brown rect + green grass strip
        ├── drawCarrot.js            # Orange triangle + green leaves
        └── drawPlayer.js            # White rabbit from canvas primitives
```

## Game Design

| Property       | Value                                  |
|----------------|----------------------------------------|
| Canvas         | 800x600 logical pixels, CSS-scaled     |
| Movement       | 300 px/s left/right                    |
| Jump           | -520 px/s initial velocity             |
| Gravity        | 1200 px/s²                             |
| Max fall speed | 800 px/s                               |
| Level          | Ground + 8 floating platforms          |
| Collectibles   | 10 carrots                             |
| Win condition  | Collect all carrots                    |
| Respawn        | Fall off bottom → reset to spawn point |

**Controls:** Arrow keys / WASD for movement, Space / Up / W to jump.

## Build

```bash
bin/build.sh
# → dist/game.html (39 KB, single self-contained file)
```

For development with hot reload:

```bash
npm run dev
```

## Result

Build verified end-to-end — `dist/game.html` is a fully self-contained single HTML file that works with `file://` protocol, no server needed.

*Session duration: 7m 41s*
