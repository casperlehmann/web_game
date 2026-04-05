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
