export function createInputHandler() {
  const keys = { left: false, right: false, jump: false };
  let jumpHeld = false;

  function onKeyDown(e) {
    switch (e.code) {
      case "ArrowLeft":
      case "KeyA":
        keys.left = true;
        e.preventDefault();
        break;
      case "ArrowRight":
      case "KeyD":
        keys.right = true;
        e.preventDefault();
        break;
      case "ArrowUp":
      case "KeyW":
      case "Space":
        if (!jumpHeld) {
          keys.jump = true;
        }
        jumpHeld = true;
        e.preventDefault();
        break;
    }
  }

  function onKeyUp(e) {
    switch (e.code) {
      case "ArrowLeft":
      case "KeyA":
        keys.left = false;
        break;
      case "ArrowRight":
      case "KeyD":
        keys.right = false;
        break;
      case "ArrowUp":
      case "KeyW":
      case "Space":
        keys.jump = false;
        jumpHeld = false;
        break;
    }
  }

  window.addEventListener("keydown", onKeyDown);
  window.addEventListener("keyup", onKeyUp);

  return {
    keys,
    destroy() {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
    },
  };
}
