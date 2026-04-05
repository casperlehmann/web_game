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
