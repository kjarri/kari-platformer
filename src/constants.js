export const GRAVITY = 0.6;
export const FRICTION = 0.85;
export const MOVE_SPEED = 6;
export const JUMP_FORCE = -14;

export const SCREEN_WIDTH = 800;
export const SCREEN_HEIGHT = 600;

export const POWERUP_TYPES = {
  shield: { color: '#00ffff', symbol: 'S', duration: 600 },
  speed: { color: '#ffaa00', symbol: '>', duration: 400 }
};

export const GAME_STATES = {
  TITLE: 'title',
  PLAYING: 'playing',
  GAMEOVER: 'gameover',
  WIN: 'win',
  PAUSED: 'paused'
};
