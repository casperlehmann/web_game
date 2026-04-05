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
