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
