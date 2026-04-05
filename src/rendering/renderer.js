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
