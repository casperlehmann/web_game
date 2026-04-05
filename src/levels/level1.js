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
