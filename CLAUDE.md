# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What This Is

A 2D platform game (rabbit collecting carrots) built with Svelte 5 and Canvas 2D, compiled to a single self-contained HTML file. The modular source structure is intentional — it keeps individual files small so AI assistants can work on them without context bloat.

## Commands

- `npm run dev` — Start Vite dev server with HMR
- `bin/build.sh` — Build to `dist/game.html` (single HTML file, all JS/CSS inlined)
- `npm run build` — Vite build only (outputs `dist/index.html`, no rename)

No tests or linters are configured.

## Architecture

**Svelte is only the UI shell.** The game engine is plain JavaScript — no Svelte reactivity in the game loop. This is a deliberate performance decision: entity state (positions, velocities) lives in plain objects mutated at 60fps, while Svelte runes (`$state`, `$derived`) are only used for UI-facing state (score, win condition) in `App.svelte`.

The data flow is:

1. `GameCanvas.svelte` mounts → `$effect` creates the game loop, input handler, and loads the level
2. Each frame: `updatePhysics()` mutates plain JS objects → `render()` draws to canvas
3. Carrot collection triggers `onScore` callback → updates `$state(score)` in `App.svelte` → `ScoreBoard.svelte` re-renders via `$props`

**Module boundaries:**
- `engine/` — Pure logic (game loop, physics, input). No DOM or Svelte imports.
- `entities/` — Factory functions returning plain objects. No logic.
- `levels/` — Static data defining platform/carrot/spawn positions.
- `rendering/` — Canvas 2D drawing functions. Receive plain objects, no side effects.
- `components/` — Svelte components bridging the engine to the DOM.

**Physics:** AABB collision with separate horizontal then vertical passes. Horizontal movement applied first with platform push-out, then vertical with landing/ceiling detection. Player respawns at spawn point when falling below y=650.

**Single-file build:** `vite-plugin-singlefile` inlines all compiled JS/CSS into the HTML. `bin/build.sh` renames the output from `index.html` to `game.html`.

## Svelte 5 Runes

This project uses Svelte 5 runes mode (`compilerOptions.runes: true` in `svelte.config.js`). Use `$state`, `$derived`, `$effect`, `$props` — not the legacy `let`/`export let`/`$:` syntax.
