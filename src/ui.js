import { SCREEN_WIDTH, SCREEN_HEIGHT, GAME_STATES } from './constants.js';
import { getKeys } from './input.js';

let titleAnimationFrame = 0;
let showTitle = true;
let gameState = GAME_STATES.TITLE;
let titleBounce = 0;
let selectedMenuOption = 0;
let menuAnimationFrame = 0;
const MAX_LEVEL = 5;

export function setGameState(state) {
  gameState = state;
  showTitle = state === GAME_STATES.TITLE;
  selectedMenuOption = 0;
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

export function updateMenu(onNewGame, onContinue) {
  menuAnimationFrame++;
  const keys = getKeys();
  
  if (keys.left || keys.right) {
    selectedMenuOption = selectedMenuOption === 0 ? 1 : 0;
    keys.left = false;
    keys.right = false;
  }
  
  if (keys.jump) {
    keys.jump = false;
    if (selectedMenuOption === 0) {
      onNewGame();
    } else if (selectedMenuOption === 1 && saveManager.hasSaveData()) {
      onContinue();
    }
    return true;
  }
  return false;
}

export function updateLevelSelect(onSelectLevel, highestLevel) {
  menuAnimationFrame++;
  const keys = getKeys();
  
  if (keys.left) {
    selectedMenuOption = Math.max(1, selectedMenuOption - 1);
    keys.left = false;
  }
  if (keys.right) {
    selectedMenuOption = Math.min(MAX_LEVEL, selectedMenuOption + 1);
    keys.right = false;
  }
  
  if (keys.jump) {
    keys.jump = false;
    const level = selectedMenuOption;
    if (level <= highestLevel) {
      onSelectLevel(level);
      return true;
    }
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

export function drawMenuScreen(ctx, logoImage, saveData) {
  const gradient = ctx.createLinearGradient(0, 0, 0, SCREEN_HEIGHT);
  gradient.addColorStop(0, '#1a1a2e');
  gradient.addColorStop(1, '#0f3460');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);
  
  if (logoImage) {
    const logoWidth = 120;
    const logoHeight = 120;
    ctx.drawImage(logoImage, (SCREEN_WIDTH - logoWidth) / 2, 30, logoWidth, logoHeight);
  }
  
  ctx.fillStyle = '#f8f9fa';
  ctx.font = 'bold 32px "Courier New", monospace';
  ctx.textAlign = 'center';
  ctx.fillText('HOPPA', SCREEN_WIDTH / 2, 170);
  
  ctx.fillStyle = selectedMenuOption === 0 ? '#e63946' : '#6c757d';
  ctx.font = 'bold 24px "Courier New", monospace';
  const newGamePulse = selectedMenuOption === 0 ? Math.sin(menuAnimationFrame * 0.1) * 0.2 + 0.8 : 1;
  ctx.globalAlpha = newGamePulse;
  ctx.fillText('▶ NÝR LEIKUR', SCREEN_WIDTH / 2, 240);
  ctx.globalAlpha = 1;
  
  const hasSave = saveManager.hasSaveData();
  ctx.fillStyle = selectedMenuOption === 1 && hasSave ? '#52b788' : hasSave ? '#6c757d' : '#4a4e69';
  const continuePulse = selectedMenuOption === 1 && hasSave ? Math.sin(menuAnimationFrame * 0.1) * 0.2 + 0.8 : 1;
  ctx.globalAlpha = continuePulse;
  ctx.fillText(hasSave ? '▶ HALDA ÁFRAM' : '   (engin gögn)', SCREEN_WIDTH / 2, 290);
  ctx.globalAlpha = 1;
  
  if (hasSave) {
    ctx.fillStyle = '#adb5bd';
    ctx.font = '14px "Courier New", monospace';
    ctx.fillText(`Hæsta borð: ${saveData.highestLevel}  |  Mynt: ${saveData.totalCoins}  |  Stig: ${saveData.highScore}`, SCREEN_WIDTH / 2, 340);
  }
  
  ctx.fillStyle = '#adb5bd';
  ctx.font = '12px "Courier New", monospace';
  ctx.fillText('A/D: Velja    W/Space: Staðfesta    ESC: Til baka', SCREEN_WIDTH / 2, 560);
}

export function drawLevelSelect(ctx, highestLevel) {
  const gradient = ctx.createLinearGradient(0, 0, 0, SCREEN_HEIGHT);
  gradient.addColorStop(0, '#1a1a2e');
  gradient.addColorStop(1, '#0f3460');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);
  
  ctx.fillStyle = '#f8f9fa';
  ctx.font = 'bold 28px "Courier New", monospace';
  ctx.textAlign = 'center';
  ctx.fillText('VELDU BORÐ', SCREEN_WIDTH / 2, 60);
  
  const levelNames = ['Gras', 'Eyðimörk', 'Hellir', 'Snjór', 'Eldkeila'];
  const levelColors = ['#52b788', '#f4a261', '#6c757d', '#a8dadc', '#e63946'];
  
  for (let i = 1; i <= MAX_LEVEL; i++) {
    const isUnlocked = i <= highestLevel;
    const isSelected = selectedMenuOption === i;
    const x = 100 + (i - 1) * 140;
    const y = 180;
    const width = 100;
    const height = 120;
    
    if (isSelected) {
      ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
      ctx.fillRect(x - 10, y - 10, width + 20, height + 20);
    }
    
    ctx.fillStyle = isUnlocked ? levelColors[i - 1] : '#4a4e69';
    ctx.beginPath();
    ctx.roundRect(x, y, width, height, 10);
    ctx.fill();
    
    if (!isUnlocked) {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
      ctx.beginPath();
      ctx.roundRect(x, y, width, height, 10);
      ctx.fill();
      
      ctx.fillStyle = '#adb5bd';
      ctx.font = 'bold 36px "Courier New", monospace';
      ctx.fillText('🔒', x + width / 2, y + height / 2 + 12);
    } else {
      ctx.fillStyle = '#fff';
      ctx.font = 'bold 32px "Courier New", monospace';
      ctx.fillText(i.toString(), x + width / 2, y + 50);
      
      ctx.font = '14px "Courier New", monospace';
      ctx.fillText(levelNames[i - 1], x + width / 2, y + 85);
    }
  }
  
  ctx.fillStyle = '#e63946';
  ctx.font = 'bold 18px "Courier New", monospace';
  ctx.fillText(`Unnar borð: ${highestLevel} / ${MAX_LEVEL}`, SCREEN_WIDTH / 2, 380);
  
  ctx.fillStyle = '#adb5bd';
  ctx.font = '12px "Courier New", monospace';
  ctx.fillText('A/D: Fletta milli borða    W/Space: Velja    ESC: Til baka', SCREEN_WIDTH / 2, 560);
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

let screenShake = {
  active: false,
  frames: 0,
  intensity: 0,
  x: 0,
  y: 0
};

export function triggerScreenShake(intensity = 5, duration = 15) {
  screenShake.active = true;
  screenShake.frames = duration;
  screenShake.intensity = intensity;
}

export function updateScreenShake() {
  if (screenShake.active) {
    screenShake.frames--;
    if (screenShake.frames <= 0) {
      screenShake.active = false;
      screenShake.x = 0;
      screenShake.y = 0;
    } else {
      screenShake.x = (Math.random() - 0.5) * screenShake.intensity * 2;
      screenShake.y = (Math.random() - 0.5) * screenShake.intensity * 2;
    }
  }
}

export function getScreenShakeOffset() {
  return { x: screenShake.x, y: screenShake.y };
}

let hitStopFrames = 0;

export function triggerHitStop(duration = 5) {
  hitStopFrames = duration;
}

export function isHitStopped() {
  return hitStopFrames > 0;
}

export function updateHitStop() {
  if (hitStopFrames > 0) {
    hitStopFrames--;
  }
}

export function drawPauseMenu(ctx) {
  ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
  ctx.fillRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);
  
  ctx.fillStyle = '#f8f9fa';
  ctx.font = 'bold 48px "Courier New", monospace';
  ctx.textAlign = 'center';
  ctx.fillText('PAUSED', SCREEN_WIDTH / 2, SCREEN_HEIGHT / 2 - 60);
  
  ctx.font = '20px "Courier New", monospace';
  ctx.fillText('Press ESC or P to Resume', SCREEN_WIDTH / 2, SCREEN_HEIGHT / 2 + 20);
  
  const blinkAlpha = 0.5 + Math.sin(Date.now() * 0.005) * 0.5;
  ctx.fillStyle = `rgba(255, 255, 255, ${blinkAlpha})`;
  ctx.fillText('Press R to Restart', SCREEN_WIDTH / 2, SCREEN_HEIGHT / 2 + 60);
}
