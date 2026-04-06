# Rabbit Run — Build Session

> Claude Code v2.1.81 · Opus 4.6 (1M context) · Claude Max
> `~/projects/web_game`

---

## Prompt

> I need to create a single page application that is contained in a single html file. But I want to develop it using a modular approach. I am thinking to use Sveltekit with runes. Please create a simple platform game with a rabbit that collects carrots. And a build system in `bin/build.sh` that compiles `dist/game.html`.

---

## Phase 1: Research

Let me explore the current project state and research the best approach for this.

### 2 Explore agents finished

- **Explore current project state** · 9 tool uses · 15.3k tokens — Done
- **Research Svelte 5 runes + inline build** · 4 tool uses · 13.8k tokens — Done

Good - the project is empty and I have a clear picture of the technical options. Let me design the implementation.

### Plan: Design platformer game architecture

Done (23 tool uses · 26.1k tokens · 3m 27s)

The plan agent provided a thorough design. One key finding: plain Svelte 5 + Vite + `vite-plugin-singlefile` is a better fit than SvelteKit for this use case — SvelteKit adds routing, SSR, and adapter complexity that a single-page canvas game doesn't need. Runes work identically in both setups.

Let me write the plan and ask about this.

### User Decision

> **Q:** You mentioned SvelteKit, but for a single-page canvas game with no routing or SSR, plain Svelte 5 + Vite is lighter and simpler — runes work identically in both. Should we use plain Svelte 5 + Vite instead?
>
> **A:** Plain Svelte 5 + Vite (Recommended)

Good, plain Svelte 5 + Vite it is. The plan is already written with that approach.

---

## Phase 2: Approved Plan

> Plan saved to: `.claude/plans/temporal-crafting-taco.md`

### Platform Game: Rabbit Collects Carrots

#### Context

Build a single-page 2D platform game (rabbit collecting carrots) with modular Svelte 5 source code that compiles to one self-contained HTML file at `dist/game.html`.

#### Tech Stack

- Svelte 5 with runes (`$state`, `$derived`, `$effect`, `$props`) — not SvelteKit (no routing/SSR needed)
- Vite as build tool
- `vite-plugin-singlefile` to inline all JS/CSS into a single HTML
- Canvas 2D API for game rendering (all art drawn programmatically, no external assets)

#### File Structure

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

#### Architecture

Key principle: Game entity state is plain JS objects (not reactive). Only UI-facing state uses runes. This avoids 60fps reactivity overhead.

- `$state` / `$derived` — score, totalCarrots, gameStatus in `App.svelte`
- `$effect` — canvas init, game loop start/cleanup, window resize listener
- `$props` — component inputs (callbacks, display values)
- Engine modules are pure JS — no Svelte/DOM dependencies

#### Game Design

- Canvas: 800×600 logical pixels, CSS-scaled to fit viewport
- Player: Rabbit with left/right movement (300 px/s) and jump (-500 px/s)
- Physics: Gravity 1200 px/s², max fall 800 px/s, dt capped at 50ms
- Level: Ground platform + 6-8 floating platforms at staggered heights, 8-10 carrots
- Win condition: Collect all carrots → congratulations overlay
- Respawn: Fall off bottom → reset to spawn point

#### Build Pipeline (`bin/build.sh`)

```bash
#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."
npm install --silent
npx vite build
mv dist/index.html dist/game.html
echo "Build complete: dist/game.html"
```

#### Implementation Order

1. Scaffold: `package.json`, configs, `index.html`, `main.js`, minimal `App.svelte`
2. Canvas + game loop: `GameCanvas.svelte`, `gameLoop.js`, `drawBackground.js`, `renderer.js`
3. Level + platforms: entities, `level1.js`, `drawPlatform.js`
4. Player + physics: `player.js`, `input.js`, `physics.js`, `drawPlayer.js`
5. Collisions: platform landing/blocking in `physics.js`
6. Carrots + score: `carrot.js`, `drawCarrot.js`, `ScoreBoard.svelte`, collection logic
7. Polish: win state overlay, respawn, visual tweaks
8. Build: `bin/build.sh`, verify `dist/game.html` works standalone

#### Verification

1. `npm run dev` — game runs in browser, rabbit moves/jumps, collects carrots, score updates
2. `bin/build.sh` — produces `dist/game.html`
3. Open `dist/game.html` directly in browser (`file://` protocol) — fully functional, no network requests

---

## Phase 3: Implementation

Let me start implementing. I'll begin with the scaffold files.

### Write `package.json`

Wrote 17 lines to `package.json`

```json
{
  "name": "rabbit-run",
  "private": true,
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  ...
}
```

### Write `vite.config.js`

Wrote 10 lines to `vite.config.js`

```js
import { defineConfig } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";
import { viteSingleFile } from "vite-plugin-singlefile";

export default defineConfig({
  plugins: [svelte(), viteSingleFile()],
  build: {
    outDir: "dist",
  },
});
```

### Write `svelte.config.js`

Wrote 8 lines to `svelte.config.js`

```js
import { vitePreprocess } from "@sveltejs/vite-plugin-svelte";

export default {
  preprocess: vitePreprocess(),
  compilerOptions: {
    runes: true,
  },
};
```

### Write `index.html`

Wrote 32 lines to `index.html`

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Rabbit Run</title>
    <style>
      * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
      }
      html, body {
        width: 100%;
        height: 100%;
        overflow: hidden;
        background: #1a1a2e;
      }
      #app {
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
      }
    </style>
  </head>
  <body>
    <div id="app"></div>
    <script type="module" src="/src/main.js"></script>
  </body>
</html>
```

### Write `.gitignore`

Wrote 3 lines to `.gitignore`

```
node_modules/
dist/
.DS_Store
```

---

Now the source files — entities, engine, rendering, level, and components:

### Write `src/main.js`

Wrote 4 lines to `src/main.js`

```js
import { mount } from "svelte";
import App from "./App.svelte";

mount(App, { target: document.getElementById("app") });
```

### Write `src/entities/player.js`

Wrote 14 lines to `src/entities/player.js`

```js
export function createPlayer(x, y) {
  return {
    x,
    y,
    width: 32,
    height: 40,
    vx: 0,
    vy: 0,
    grounded: false,
    facing: 1, // 1 = right, -1 = left
    spawnX: x,
    spawnY: y,
  };
}
```

### Write `src/entities/platform.js`

Wrote 3 lines to `src/entities/platform.js`

```js
export function createPlatform(x, y, width, height = 20) {
  return { x, y, width, height };
}
```

### Write `src/entities/carrot.js`

Wrote 3 lines to `src/entities/carrot.js`

```js
export function createCarrot(x, y) {
  return { x, y, width: 16, height: 24, collected: false };
}
```

### Write `src/engine/gameLoop.js`

Wrote 18 lines to `src/engine/gameLoop.js`

```js
export function createGameLoop(update) {
  let lastTime = 0;
  let frameId;

  function tick(time) {
    const dt = Math.min((time - lastTime) / 1000, 0.05);
    lastTime = time;
    update(dt);
    frameId = requestAnimationFrame(tick);
  }

  frameId = requestAnimationFrame((time) => {
    lastTime = time;
    frameId = requestAnimationFrame(tick);
  });

  return () => cancelAnimationFrame(frameId);
}
```

### Write `src/engine/input.js`

Wrote 58 lines to `src/engine/input.js`

```js
export function createInputHandler() {
  const keys = { left: false, right: false, jump: false };
  let jumpHeld = false;

  function onKeyDown(e) {
    switch (e.code) {
      case "ArrowLeft":
      case "KeyA":
        keys.left = true;
        e.preventDefault();
        break;
      case "ArrowRight":
      case "KeyD":
        keys.right = true;
        e.preventDefault();
        break;
      case "ArrowUp":
      case "KeyW":
      case "Space":
        if (!jumpHeld) {
          keys.jump = true;
        }
        jumpHeld = true;
        e.preventDefault();
        break;
    }
  }

  function onKeyUp(e) {
    switch (e.code) {
      case "ArrowLeft":
      case "KeyA":
        keys.left = false;
        break;
      case "ArrowRight":
      case "KeyD":
        keys.right = false;
        break;
      case "ArrowUp":
      case "KeyW":
      case "Space":
        keys.jump = false;
        jumpHeld = false;
        break;
    }
  }

  window.addEventListener("keydown", onKeyDown);
  window.addEventListener("keyup", onKeyUp);

  return {
    keys,
    destroy() {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
    },
  };
}
```

### Write `src/engine/physics.js`

Wrote 95 lines to `src/engine/physics.js`

```js
const GRAVITY = 1200;
const MOVE_SPEED = 300;
const JUMP_VELOCITY = -520;
const MAX_FALL_SPEED = 800;

export function updatePhysics(player, platforms, carrots, keys, dt, onScore) {
  // Horizontal movement
  if (keys.left) {
    player.vx = -MOVE_SPEED;
    player.facing = -1;
  } else if (keys.right) {
    player.vx = MOVE_SPEED;
    player.facing = 1;
  } else {
    player.vx = 0;
  }

  // Jump
  if (keys.jump && player.grounded) {
    player.vy = JUMP_VELOCITY;
    player.grounded = false;
    keys.jump = false;
  }

  // Gravity
  player.vy += GRAVITY * dt;
  if (player.vy > MAX_FALL_SPEED) {
    player.vy = MAX_FALL_SPEED;
  }

  // Apply horizontal velocity
  player.x += player.vx * dt;

  // Horizontal boundary clamping (canvas is 800 wide)
  if (player.x < 0) player.x = 0;
  if (player.x + player.width > 800) player.x = 800 - player.width;

  // Horizontal platform collision
  for (const plat of platforms) {
    if (overlaps(player, plat)) {
      if (player.vx > 0) {
        player.x = plat.x - player.width;
      } else if (player.vx < 0) {
        player.x = plat.x + plat.width;
      }
    }
  }

  // Apply vertical velocity
  const prevY = player.y;
  player.y += player.vy * dt;

  // Vertical platform collision
  player.grounded = false;
  for (const plat of platforms) {
    if (overlaps(player, plat)) {
      if (prevY + player.height <= plat.y + 4) {
        // Landing on top
        player.y = plat.y - player.height;
        player.vy = 0;
        player.grounded = true;
      } else if (prevY >= plat.y + plat.height - 4) {
        // Hitting bottom
        player.y = plat.y + plat.height;
        player.vy = 0;
      }
    }
  }

  // Fall off bottom — respawn
  if (player.y > 650) {
    player.x = player.spawnX;
    player.y = player.spawnY;
    player.vx = 0;
    player.vy = 0;
    player.grounded = false;
  }

  // Carrot collection
  for (const carrot of carrots) {
    if (!carrot.collected && overlaps(player, carrot)) {
      carrot.collected = true;
      onScore(1);
    }
  }
}

function overlaps(a, b) {
  return (
    a.x < b.x + b.width &&
    a.x + a.width > b.x &&
    a.y < b.y + b.height &&
    a.y + a.height > b.y
  );
}
```

### Write `src/levels/level1.js`

Wrote 37 lines to `src/levels/level1.js`

```js
import { createPlayer } from "../entities/player.js";
import { createPlatform } from "../entities/platform.js";
import { createCarrot } from "../entities/carrot.js";

export function loadLevel() {
  const player = createPlayer(60, 500);

  const platforms = [
    // Ground
    createPlatform(0, 560, 800, 40),
    // Platforms ascending left-to-right then back
    createPlatform(50, 470, 120, 18),
    createPlatform(220, 400, 120, 18),
    createPlatform(420, 380, 130, 18),
    createPlatform(600, 330, 140, 18),
    createPlatform(380, 270, 120, 18),
    createPlatform(150, 240, 130, 18),
    createPlatform(500, 180, 120, 18),
    createPlatform(250, 130, 140, 18),
  ];

  const carrots = [
    createCarrot(100, 442),
    createCarrot(270, 372),
    createCarrot(475, 352),
    createCarrot(660, 302),
    createCarrot(430, 242),
    createCarrot(200, 212),
    createCarrot(550, 152),
    createCarrot(310, 102),
    // A couple on the ground for an easy start
    createCarrot(350, 532),
    createCarrot(700, 532),
  ];

  return { player, platforms, carrots };
}
```

---

Now the rendering modules and Svelte components:

### Write `src/rendering/drawBackground.js`

Wrote 26 lines to `src/rendering/drawBackground.js`

```js
export function drawBackground(ctx, width, height) {
  // Sky gradient
  const grad = ctx.createLinearGradient(0, 0, 0, height);
  grad.addColorStop(0, "#4a90d9");
  grad.addColorStop(1, "#87ceeb");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, width, height);

  // Clouds
  ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
  drawCloud(ctx, 100, 60, 1);
  drawCloud(ctx, 400, 40, 1.3);
  drawCloud(ctx, 650, 80, 0.9);
}

function drawCloud(ctx, x, y, scale) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(scale, scale);
  ctx.beginPath();
  ctx.ellipse(0, 0, 40, 18, 0, 0, Math.PI * 2);
  ctx.ellipse(-30, 5, 25, 14, 0, 0, Math.PI * 2);
  ctx.ellipse(30, 5, 28, 14, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}
```

### Write `src/rendering/drawPlatform.js`

Wrote 19 lines to `src/rendering/drawPlatform.js`

```js
export function drawPlatform(ctx, platform) {
  const { x, y, width, height } = platform;

  // Dirt body
  ctx.fillStyle = "#8B5E3C";
  ctx.fillRect(x, y, width, height);

  // Darker edge
  ctx.fillStyle = "#6B3F1F";
  ctx.fillRect(x, y + height - 3, width, 3);

  // Grass top
  ctx.fillStyle = "#4CAF50";
  ctx.fillRect(x, y, width, 4);

  // Lighter grass highlight
  ctx.fillStyle = "#66BB6A";
  ctx.fillRect(x + 2, y, width - 4, 2);
}
```

### Write `src/rendering/drawCarrot.js`

Wrote 45 lines to `src/rendering/drawCarrot.js`

```js
export function drawCarrot(ctx, carrot) {
  if (carrot.collected) return;

  const cx = carrot.x + carrot.width / 2;
  const top = carrot.y + 4;
  const bottom = carrot.y + carrot.height;

  // Carrot body (orange triangle)
  ctx.fillStyle = "#FF6F00";
  ctx.beginPath();
  ctx.moveTo(cx, bottom);
  ctx.lineTo(cx - 7, top + 6);
  ctx.lineTo(cx + 7, top + 6);
  ctx.closePath();
  ctx.fill();

  // Lighter stripe
  ctx.fillStyle = "#FF8F00";
  ctx.beginPath();
  ctx.moveTo(cx, bottom);
  ctx.lineTo(cx - 2, top + 8);
  ctx.lineTo(cx + 3, top + 8);
  ctx.closePath();
  ctx.fill();

  // Green leaves
  ctx.strokeStyle = "#2E7D32";
  ctx.lineWidth = 2;
  ctx.lineCap = "round";

  ctx.beginPath();
  ctx.moveTo(cx, top + 6);
  ctx.lineTo(cx - 4, top);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(cx, top + 6);
  ctx.lineTo(cx + 4, top);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(cx, top + 6);
  ctx.lineTo(cx, top - 1);
  ctx.stroke();
}
```

### Write `src/rendering/drawPlayer.js`

Wrote 93 lines to `src/rendering/drawPlayer.js`

```js
export function drawPlayer(ctx, player) {
  const cx = player.x + player.width / 2;
  const cy = player.y + player.height / 2;

  ctx.save();
  ctx.translate(cx, cy);
  if (player.facing < 0) ctx.scale(-1, 1);

  // Body (white oval)
  ctx.fillStyle = "#FFFFFF";
  ctx.beginPath();
  ctx.ellipse(0, 6, 12, 14, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = "#CCCCCC";
  ctx.lineWidth = 1;
  ctx.stroke();

  // Head
  ctx.fillStyle = "#FFFFFF";
  ctx.beginPath();
  ctx.ellipse(2, -8, 10, 9, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = "#CCCCCC";
  ctx.stroke();

  // Left ear
  ctx.fillStyle = "#FFFFFF";
  ctx.beginPath();
  ctx.ellipse(-3, -24, 4, 10, -0.15, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = "#CCCCCC";
  ctx.stroke();
  // Inner ear
  ctx.fillStyle = "#FFB6C1";
  ctx.beginPath();
  ctx.ellipse(-3, -24, 2, 7, -0.15, 0, Math.PI * 2);
  ctx.fill();

  // Right ear
  ctx.fillStyle = "#FFFFFF";
  ctx.beginPath();
  ctx.ellipse(6, -26, 4, 10, 0.15, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = "#CCCCCC";
  ctx.stroke();
  // Inner ear
  ctx.fillStyle = "#FFB6C1";
  ctx.beginPath();
  ctx.ellipse(6, -26, 2, 7, 0.15, 0, Math.PI * 2);
  ctx.fill();

  // Eye
  ctx.fillStyle = "#333333";
  ctx.beginPath();
  ctx.ellipse(6, -10, 2.5, 3, 0, 0, Math.PI * 2);
  ctx.fill();
  // Eye highlight
  ctx.fillStyle = "#FFFFFF";
  ctx.beginPath();
  ctx.ellipse(7, -11, 1, 1, 0, 0, Math.PI * 2);
  ctx.fill();

  // Nose
  ctx.fillStyle = "#FF9999";
  ctx.beginPath();
  ctx.ellipse(10, -6, 2, 1.5, 0, 0, Math.PI * 2);
  ctx.fill();

  // Tail
  ctx.fillStyle = "#FFFFFF";
  ctx.beginPath();
  ctx.ellipse(-12, 8, 5, 4, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = "#CCCCCC";
  ctx.stroke();

  // Feet
  ctx.fillStyle = "#FFFFFF";
  ctx.beginPath();
  ctx.ellipse(-4, 18, 6, 3, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = "#CCCCCC";
  ctx.stroke();

  ctx.fillStyle = "#FFFFFF";
  ctx.beginPath();
  ctx.ellipse(6, 18, 6, 3, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = "#CCCCCC";
  ctx.stroke();

  ctx.restore();
}
```

### Write `src/rendering/renderer.js`

Wrote 20 lines to `src/rendering/renderer.js`

```js
import { drawBackground } from "./drawBackground.js";
import { drawPlatform } from "./drawPlatform.js";
import { drawCarrot } from "./drawCarrot.js";
import { drawPlayer } from "./drawPlayer.js";

export function render(ctx, width, height, level) {
  ctx.clearRect(0, 0, width, height);

  drawBackground(ctx, width, height);

  for (const platform of level.platforms) {
    drawPlatform(ctx, platform);
  }

  for (const carrot of level.carrots) {
    drawCarrot(ctx, carrot);
  }

  drawPlayer(ctx, level.player);
}
```

---

Now the Svelte components:

### Write `src/components/GameCanvas.svelte`

Wrote 42 lines to `src/components/GameCanvas.svelte`

```svelte
<script>
  import { createGameLoop } from "../engine/gameLoop.js";
  import { createInputHandler } from "../engine/input.js";
  import { updatePhysics } from "../engine/physics.js";
  import { loadLevel } from "../levels/level1.js";
  import { render } from "../rendering/renderer.js";

  let { onScore, onLevelLoaded } = $props();
  let canvas;

  $effect(() => {
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const level = loadLevel();
    const input = createInputHandler();
    onLevelLoaded(level.carrots.length);

    const stop = createGameLoop((dt) => {
      updatePhysics(level.player, level.platforms, level.carrots, input.keys, dt, onScore);
      render(ctx, canvas.width, canvas.height, level);
    });

    return () => {
      stop();
      input.destroy();
    };
  });
</script>

<canvas bind:this={canvas} width={800} height={600}></canvas>

<style>
  canvas {
    display: block;
    max-width: 100%;
    max-height: 100%;
    aspect-ratio: 800 / 600;
    image-rendering: pixelated;
    border-radius: 4px;
    box-shadow: 0 4px 24px rgba(0, 0, 0, 0.4);
  }
</style>
```

### Write `src/components/ScoreBoard.svelte`

Wrote 71 lines to `src/components/ScoreBoard.svelte`

```svelte
<script>
  let { score, totalCarrots, gameStatus } = $props();
</script>

<div class="hud">
  <div class="score">Carrots: {score} / {totalCarrots}</div>
</div>

{#if gameStatus === "won"}
  <div class="overlay">
    <div class="win-message">
      <h1>You Win!</h1>
      <p>You collected all the carrots!</p>
      <p class="hint">Refresh to play again</p>
    </div>
  </div>
{/if}

<style>
  .hud {
    position: absolute;
    top: 12px;
    left: 12px;
    pointer-events: none;
  }

  .score {
    font-family: monospace;
    font-size: 20px;
    font-weight: bold;
    color: #fff;
    text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.6);
    background: rgba(0, 0, 0, 0.3);
    padding: 6px 14px;
    border-radius: 6px;
  }

  .overlay {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(0, 0, 0, 0.5);
    pointer-events: none;
  }

  .win-message {
    text-align: center;
    color: #fff;
    font-family: monospace;
  }

  .win-message h1 {
    font-size: 48px;
    color: #FFD700;
    text-shadow: 2px 2px 6px rgba(0, 0, 0, 0.6);
    margin-bottom: 8px;
  }

  .win-message p {
    font-size: 20px;
    text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.6);
  }

  .hint {
    margin-top: 16px;
    font-size: 14px !important;
    opacity: 0.7;
  }
</style>
```

### Write `src/App.svelte`

Wrote 30 lines to `src/App.svelte`

```svelte
<script>
  import GameCanvas from "./components/GameCanvas.svelte";
  import ScoreBoard from "./components/ScoreBoard.svelte";

  let score = $state(0);
  let totalCarrots = $state(0);
  let gameStatus = $derived(score >= totalCarrots && totalCarrots > 0 ? "won" : "playing");

  function onScore(points) {
    score += points;
  }

  function onLevelLoaded(carrotCount) {
    totalCarrots = carrotCount;
  }
</script>

<div class="game-container">
  <GameCanvas {onScore} {onLevelLoaded} />
  <ScoreBoard {score} {totalCarrots} {gameStatus} />
</div>

<style>
  .game-container {
    position: relative;
    display: inline-block;
    max-width: 100%;
    max-height: 100%;
  }
</style>
```

---

Now the build script:

### Write `bin/build.sh`

Wrote 7 lines to `bin/build.sh`

```bash
#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."
npm install --silent
npx vite build
mv dist/index.html dist/game.html
echo "Build complete: dist/game.html"
```

### `chmod +x bin/build.sh`

Done.

---

## Phase 4: Build Verification

### `npm install`

```
added 47 packages, and audited 48 packages in 13s
7 packages are looking for funding
found 0 vulnerabilities
```

### `npx vite build`

```
vite v6.4.1 building for production...
transforming...
✓ 125 modules transformed.
rendering chunks...
[plugin vite:singlefile] Inlining: index-DijsWjQA.js
[plugin vite:singlefile] Inlining: style-D7887vqv.css
computing gzip size...
dist/index.html  39.58 kB │ gzip: 14.94 kB
✓ built in 885ms
```

### Rename output

`dist/game.html` — 39,580 bytes

### Full `bin/build.sh` end-to-end test

```
vite v6.4.1 building for production...
transforming...
✓ 125 modules transformed.
rendering chunks...
[plugin vite:singlefile] Inlining: index-DijsWjQA.js
[plugin vite:singlefile] Inlining: style-D7887vqv.css
computing gzip size...
dist/index.html  39.58 kB │ gzip: 14.94 kB
✓ built in 727ms
Build complete: dist/game.html
```

---

## Summary

**Project structure** — 20 files, modular Svelte 5 source:

- `src/App.svelte` — root with `$state(score)`, `$derived(gameStatus)`
- `src/components/` — `GameCanvas.svelte` (canvas + `$effect` game loop), `ScoreBoard.svelte` (HUD overlay)
- `src/engine/` — `gameLoop.js`, `physics.js`, `input.js` (pure JS, no Svelte deps)
- `src/entities/` — `player.js`, `platform.js`, `carrot.js` (factory functions)
- `src/levels/level1.js` — 9 platforms + 10 carrots
- `src/rendering/` — `renderer.js`, `drawBackground.js`, `drawPlatform.js`, `drawCarrot.js`, `drawPlayer.js`

**Game features:**

- Rabbit moves with arrow keys/WASD, jumps with Space/Up/W
- Gravity, platform collision, respawn on fall
- 10 carrots to collect across platforms at varying heights
- Win overlay when all carrots collected
- All art drawn with canvas primitives (no external assets)

**Build:** `bin/build.sh` produces a single self-contained `dist/game.html` (39KB). For development, run `npm run dev` for Vite's HMR dev server.

*Session duration: 7m 41s*
