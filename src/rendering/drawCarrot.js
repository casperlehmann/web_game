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
