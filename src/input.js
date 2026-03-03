export const keys = {
  left: false,
  right: false,
  jump: false,
  shoot: false,
  shootUp: false,
  shootDown: false,
  jumpBuffered: false,
  restart: false
};

let playerRef = null;
let restartCallback = null;

export function setPlayerRef(player) {
  playerRef = player;
}

export function setRestartCallback(callback) {
  restartCallback = callback;
}

export function initInput(canvas) {
  document.addEventListener('keydown', (e) => {
    if (['w', 'W', ' ', 'a', 'A', 'd', 'D', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(e.key)) {
      e.preventDefault();
    }
    
    if (e.key === 'a' || e.key === 'A') keys.left = true;
    if (e.key === 'd' || e.key === 'D') keys.right = true;
    if (e.key === 'w' || e.key === 'W' || e.key === ' ') {
      if (!keys.jump) {
        keys.jumpBuffered = true;
        setTimeout(() => { keys.jumpBuffered = false; }, 100);
      }
      keys.jump = true;
    }
    if (e.key === 'r' || e.key === 'R') {
      keys.restart = true;
      if (restartCallback) restartCallback();
    }
    if (e.key === 'ArrowLeft') {
      keys.shoot = true;
      keys.shootUp = false;
      keys.shootDown = false;
      if (playerRef) playerRef.facingRight = false;
    }
    if (e.key === 'ArrowRight') {
      keys.shoot = true;
      keys.shootUp = false;
      keys.shootDown = false;
      if (playerRef) playerRef.facingRight = true;
    }
    if (e.key === 'ArrowUp') {
      keys.shootUp = true;
      keys.shoot = false;
      keys.shootDown = false;
    }
    if (e.key === 'ArrowDown') {
      keys.shootDown = true;
      keys.shoot = false;
      keys.shootUp = false;
    }
  });

  document.addEventListener('keyup', (e) => {
    if (e.key === 'a' || e.key === 'A') keys.left = false;
    if (e.key === 'd' || e.key === 'D') keys.right = false;
    if (e.key === 'w' || e.key === 'W' || e.key === ' ') keys.jump = false;
    if (e.key === 'r' || e.key === 'R') keys.restart = false;
    if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
      keys.shoot = false;
    }
    if (e.key === 'ArrowUp') {
      keys.shootUp = false;
    }
    if (e.key === 'ArrowDown') {
      keys.shootDown = false;
    }
  });

  setupTouchControls();
}

function setupTouchControls() {
  const touchLeft = document.getElementById('touchLeft');
  const touchRight = document.getElementById('touchRight');
  const touchJump = document.getElementById('touchJump');
  const touchShoot = document.getElementById('touchShoot');
  const touchShootUp = document.getElementById('touchShootUp');
  const touchShootDown = document.getElementById('touchShootDown');

  function preventDefault(e) {
    const target = e.target;
    if (target.tagName === 'BUTTON' || target.tagName === 'A' || target.closest('button')) {
      return;
    }
    if (e.cancelable) {
      e.preventDefault();
    }
  }

  const touchEvents = {
    left: { el: touchLeft, key: 'left' },
    right: { el: touchRight, key: 'right' },
    jump: { el: touchJump, key: 'jump' },
    shoot: { el: touchShoot, key: 'shoot' },
    shootUp: { el: touchShootUp, key: 'shootUp' },
    shootDown: { el: touchShootDown, key: 'shootDown' }
  };

  Object.values(touchEvents).forEach(({ el, key }) => {
    if (!el) return;

    el.addEventListener('touchstart', (e) => {
      preventDefault(e);
      keys[key] = true;
      el.classList.add('active');
      if (key === 'left' && playerRef) playerRef.facingRight = false;
      if (key === 'right' && playerRef) playerRef.facingRight = true;
      if (key === 'jump') {
        keys.jumpBuffered = true;
        setTimeout(() => { keys.jumpBuffered = false; }, 100);
      }
    }, { passive: false });

    el.addEventListener('touchend', (e) => {
      preventDefault(e);
      keys[key] = false;
      el.classList.remove('active');
    }, { passive: false });

    el.addEventListener('touchcancel', (e) => {
      keys[key] = false;
      el.classList.remove('active');
    }, { passive: false });
  });

  document.addEventListener('touchmove', preventDefault, { passive: false });
  document.addEventListener('touchstart', preventDefault, { passive: false });
  document.addEventListener('gesturestart', preventDefault);
  document.addEventListener('gesturechange', preventDefault);
  document.addEventListener('gestureend', preventDefault);
}

export function getKeys() {
  return keys;
}
