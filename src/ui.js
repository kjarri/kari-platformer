import { SCREEN_WIDTH, SCREEN_HEIGHT, GAME_STATES } from './constants.js';
import { getKeys } from './input.js';

let titleAnimationFrame = 0;
let showTitle = true;
let gameState = GAME_STATES.TITLE;
let titleBounce = 0;

export function setGameState(state) {
  gameState = state;
  showTitle = state === GAME_STATES.TITLE;
}

export function getGameState() {
  return gameState;
}

export function updateTitle() {
  titleAnimationFrame++;
  titleBounce = Math.sin(titleAnimationFrame * 0.05) * 5;
  
  const keys = getKeys();
  if (keys.jump || keys.shoot || keys.left || keys.right) {
    setGameState(GAME_STATES.PLAYING);
    return true;
  }
  return false;
}

export function drawTitleScreen(ctx, logoImage) {
  const gradient = ctx.createLinearGradient(0, 0, 0, SCREEN_HEIGHT);
  gradient.addColorStop(0, '#1a1a2e');
  gradient.addColorStop(0.5, '#16213e');
  gradient.addColorStop(1, '#0f3460');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);
  
  for (let i = 0; i < 50; i++) {
    const x = (i * 73) % SCREEN_WIDTH;
    const y = (i * 47) % (SCREEN_HEIGHT / 2);
    const size = (i % 3) + 1;
    ctx.fillStyle = `rgba(255, 255, 255, ${0.3 + (i % 5) * 0.1})`;
    ctx.beginPath();
    ctx.arc(x, y, size, 0, Math.PI * 2);
    ctx.fill();
  }
  
  if (logoImage) {
    const logoWidth = 300;
    const logoHeight = 300;
    const logoX = (SCREEN_WIDTH - logoWidth) / 2;
    const logoY = 80 + titleBounce;
    
    ctx.save();
    ctx.shadowColor = '#e63946';
    ctx.shadowBlur = 20;
    ctx.drawImage(logoImage, logoX, logoY, logoWidth, logoHeight);
    ctx.restore();
  }
  
  ctx.fillStyle = '#f8f9fa';
  ctx.font = 'bold 24px "Courier New", monospace';
  ctx.textAlign = 'center';
  ctx.fillText('PLATFORMER', SCREEN_WIDTH / 2, 400);
  
  const blinkAlpha = 0.5 + Math.sin(titleAnimationFrame * 0.1) * 0.5;
  ctx.fillStyle = `rgba(230, 57, 70, ${blinkAlpha})`;
  ctx.font = '18px "Courier New", monospace';
  ctx.fillText('PRESS ANY KEY TO START', SCREEN_WIDTH / 2, 450);
  
  ctx.fillStyle = '#adb5bd';
  ctx.font = '14px "Courier New", monospace';
  ctx.fillText('A/D: Move    W/Space: Jump    Arrow Keys: Shoot', SCREEN_WIDTH / 2, 520);
  
  ctx.fillText('OR TAP SCREEN ON MOBILE', SCREEN_WIDTH / 2, 545);
}

export function drawHUD(ctx, player, score, cameraX) {
  ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
  ctx.fillRect(10, 10, 150, 40);
  
  for (let i = 0; i < player.maxHealth; i++) {
    const heartX = 20 + i * 35;
    const heartY = 20;
    ctx.fillStyle = i < player.health ? '#e63946' : '#4a4e69';
    
    ctx.beginPath();
    ctx.moveTo(heartX, heartY + 5);
    ctx.bezierCurveTo(heartX, heartY, heartX - 10, heartY, heartX - 10, heartY + 7);
    ctx.bezierCurveTo(heartX - 10, heartY + 15, heartX, heartY + 20, heartX, heartY + 25);
    ctx.bezierCurveTo(heartX, heartY + 20, heartX + 10, heartY + 15, heartX + 10, heartY + 7);
    ctx.bezierCurveTo(heartX + 10, heartY, heartX, heartY, heartX, heartY + 5);
    ctx.fill();
  }
  
  if (player.shield > 0) {
    ctx.fillStyle = '#00ffff';
    ctx.font = 'bold 16px "Courier New", monospace';
    ctx.textAlign = 'left';
    ctx.fillText(`SHIELD: ${Math.ceil(player.shield / 60)}s`, 170, 32);
  }
  
  if (player.speedBoost > 0) {
    ctx.fillStyle = '#ffaa00';
    ctx.font = 'bold 16px "Courier New", monospace';
    ctx.fillText(`SPEED: ${Math.ceil(player.speedBoost / 60)}s`, 300, 32);
  }
  
  ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
  ctx.fillRect(SCREEN_WIDTH - 120, 10, 110, 35);
  ctx.fillStyle = '#ffd700';
  ctx.font = 'bold 20px "Courier New", monospace';
  ctx.textAlign = 'right';
  ctx.fillText(`★ ${score}`, SCREEN_WIDTH - 20, 34);
}

export function drawGameOver(ctx, score) {
  ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
  ctx.fillRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);
  
  ctx.fillStyle = '#e63946';
  ctx.font = 'bold 48px "Courier New", monospace';
  ctx.textAlign = 'center';
  ctx.fillText('GAME OVER', SCREEN_WIDTH / 2, SCREEN_HEIGHT / 2 - 50);
  
  ctx.fillStyle = '#ffd700';
  ctx.font = '24px "Courier New", monospace';
  ctx.fillText(`Final Score: ${score}`, SCREEN_WIDTH / 2, SCREEN_HEIGHT / 2 + 10);
  
  const blinkAlpha = 0.5 + Math.sin(Date.now() * 0.005) * 0.5;
  ctx.fillStyle = `rgba(255, 255, 255, ${blinkAlpha})`;
  ctx.font = '18px "Courier New", monospace';
  ctx.fillText('Press R to Restart', SCREEN_WIDTH / 2, SCREEN_HEIGHT / 2 + 60);
}

export function drawWin(ctx, score) {
  ctx.fillStyle = 'rgba(0, 100, 0, 0.7)';
  ctx.fillRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);
  
  ctx.fillStyle = '#52b788';
  ctx.font = 'bold 48px "Courier New", monospace';
  ctx.textAlign = 'center';
  ctx.fillText('LEVEL COMPLETE!', SCREEN_WIDTH / 2, SCREEN_HEIGHT / 2 - 50);
  
  ctx.fillStyle = '#ffd700';
  ctx.font = '24px "Courier New", monospace';
  ctx.fillText(`Score: ${score}`, SCREEN_WIDTH / 2, SCREEN_HEIGHT / 2 + 10);
  
  const blinkAlpha = 0.5 + Math.sin(Date.now() * 0.005) * 0.5;
  ctx.fillStyle = `rgba(255, 255, 255, ${blinkAlpha})`;
  ctx.font = '18px "Courier New", monospace';
  ctx.fillText('Press R to Play Again', SCREEN_WIDTH / 2, SCREEN_HEIGHT / 2 + 60);
}
