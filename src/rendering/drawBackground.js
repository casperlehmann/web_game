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
