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
