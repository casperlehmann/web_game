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
