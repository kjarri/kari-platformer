import { SCREEN_WIDTH, SCREEN_HEIGHT, GAME_STATES, POWERUP_TYPES } from './constants.js';
import { Player } from './player.js';
import { initInput, getKeys, setPlayerRef, setRestartCallback } from './input.js';
import * as audio from './audio.js';
import * as particles from './particles.js';
import * as levelManager from './levelManager.js';
import { setGameState, getGameState, updateTitle, drawTitleScreen, drawHUD, drawGameOver, drawWin, triggerScreenShake, triggerHitStop, updateScreenShake, getScreenShakeOffset, updateHitStop, isHitStopped } from './ui.js';
import * as renderer from './renderer.js';
import * as saveManager from './saveManager.js';

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

let DEBUG_MODE = false;
let debugInfo = '';
let eventLog = [];
let score = 0;
let gameOver = false;
let gameWon = false;
let cameraX = 0;
let bullets = [];
let boss = null;
let shootCooldown = 0;
let fallRespawnCooldown = 0;
let enemyBullets = [];

let logoImage = null;
let saveData = null;

const player = new Player();
setPlayerRef(player);

function logEvent(msg) {
  const now = new Date();
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');
  const timestamp = hours + ':' + minutes + ':' + seconds;
  const logMsg = '[' + timestamp + '] ' + msg;
  console.log(logMsg);
  eventLog.push(logMsg);
  if (eventLog.length > 20) eventLog.shift();
  
  const eventLogEl = document.getElementById('eventLog');
  if (eventLogEl) {
    eventLogEl.innerHTML = eventLog.map(m => '<div>' + m + '</div>').join('');
    eventLogEl.scrollTop = eventLogEl.scrollHeight;
  }
}

function toggleDebug() {
  DEBUG_MODE = !DEBUG_MODE;
  const btn = document.getElementById('debugToggle');
  btn.textContent = 'Villuleit: ' + (DEBUG_MODE ? 'KVEIKT' : 'SLÖKKT');
  btn.style.background = DEBUG_MODE ? '#e63946' : '#4a4e69';
  logEvent('Villuleit: ' + (DEBUG_MODE ? 'KVEIKT' : 'SLÖKKT'));
}

function checkCollision(a, b) {
  return (
    a.x < b.x + b.width &&
    a.x + a.width > b.x &&
    a.y < b.y + b.height &&
    a.y + a.height > b.y
  );
}

function shoot() {
  if (shootCooldown > 0) return;
  
  const keys = getKeys();
  let velX = 0;
  let velY = 0;
  
  if (keys.shootUp) {
    velY = -10;
  } else if (keys.shootDown && player.onGround) {
    velY = 10;
  } else {
    velX = player.facingRight ? 10 : -10;
  }
  
  if (velX !== 0 || velY !== 0) {
    const bulletX = player.facingRight ? player.x + player.width : player.x;
    bullets.push({
      x: bulletX,
      y: player.y + player.height / 2,
      width: 8,
      height: 8,
      velX,
      velY,
      isEnemy: false
    });
    shootCooldown = 15;
    audio.playShootSound();
  }
}

let meleeCooldown = 0;
let meleeActive = false;
let meleeFrame = 0;

function meleeAttack() {
  if (meleeCooldown > 0 || meleeActive) return;
  
  meleeActive = true;
  meleeFrame = 10;
  meleeCooldown = 25;
  
  const meleeRange = 50;
  const meleeX = player.facingRight ? player.x + player.width : player.x - meleeRange;
  const meleeY = player.y;
  const meleeWidth = meleeRange;
  const meleeHeight = player.height;
  
  const enemies = levelManager.getEnemies();
  enemies.forEach(enemy => {
    if (enemy.hp !== undefined && enemy.hp <= 0) return;
    
    if (checkCollision({ x: meleeX, y: meleeY, width: meleeWidth, height: meleeHeight }, enemy)) {
      enemy.hp = (enemy.hp || 1) - 2;
      if (enemy.hp <= 0) {
        triggerScreenShake(3, 5);
        audio.playEnemyDeathSound();
        particles.createExplosion(enemy.x + enemy.width/2, enemy.y + enemy.height/2, '#9b59b6', 15);
        score += 5;
      }
    }
  });
  
  if (boss && boss.alive) {
    const bossHitbox = { x: meleeX, y: meleeY, width: meleeWidth, height: meleeHeight };
    if (checkCollision(bossHitbox, boss)) {
      boss.hp -= 2;
      triggerScreenShake(5, 8);
      particles.createParticles(boss.x + boss.width/2, boss.y + boss.height/2, '#ff0000', 8, 2, 8);
      if (boss.hp <= 0) {
        boss.alive = false;
        triggerScreenShake(15, 25);
        audio.playWinSound();
        particles.createExplosion(boss.x + boss.width/2, boss.y + boss.height/2, '#ff4500', 40);
        score += 50;
        logEvent('YFIRMAÐNR SIGRÁÐUR!');
      }
    }
  }
}

function updatePlayer() {
  const keys = getKeys();
  player.update(keys, levelManager.getPlatforms());
  
  if (keys.shoot || keys.shootUp || keys.shootDown) {
    shoot();
  }
  
  if (keys.melee) {
    meleeAttack();
  }
  
  if (meleeActive) {
    meleeFrame--;
    if (meleeFrame <= 0) {
      meleeActive = false;
    }
  }
  
  if (shootCooldown > 0) shootCooldown--;
  if (meleeCooldown > 0) meleeCooldown--;
  
  if (player.y > SCREEN_HEIGHT + 100) {
    if (fallRespawnCooldown === 0) {
      if (player.shield > 0) {
        player.shield = 0;
        logEvent('Skjald rofið við fall');
      } else {
        player.health--;
        logEvent('Dauður við fall');
      }
      
      if (player.health <= 0) {
        gameOver = true;
        audio.playGameOverSound();
        logEvent('GAME OVER');
        return;
      }
      
      audio.playDamageSound();
      particles.createExplosion(player.x, player.y, '#e63946', 15);
      
      fallRespawnCooldown = 60;
    }
  }
  
  if (fallRespawnCooldown > 0) {
    fallRespawnCooldown--;
    if (fallRespawnCooldown === 0) {
      player.x = Math.max(50, player.x - 200);
      player.y = 100;
      player.velX = 0;
      player.velY = 0;
      player.invincible = 30;
    }
  }
  
  const castle = levelManager.getCastle();
  if (checkCollision(player, {
    x: castle.doorX,
    y: castle.doorY,
    width: castle.doorWidth,
    height: castle.doorHeight
  })) {
    if (levelManager.currentLevel === 5 && boss && boss.alive) {
      logEvent('Þú verður að sigra YFIRMANNINN fyrst!');
    } else if (!gameWon) {
      gameWon = true;
      score += 10;
      audio.playWinSound();
    }
  }
  
  const coins = levelManager.getCoins();
  coins.forEach(coin => {
    if (!coin.collected && checkCollision(player, coin)) {
      coin.collected = true;
      score++;
      audio.playCoinSound();
      particles.createParticles(coin.x + coin.width/2, coin.y + coin.height/2, '#ffd700', 8, 4, 20);
    }
  });
  
  const powerups = levelManager.getPowerups();
  powerups.forEach(powerup => {
    if (!powerup.collected && checkCollision(player, powerup)) {
      powerup.collected = true;
      
      if (powerup.type === 'shield') {
        player.shield = POWERUP_TYPES.shield.duration;
      } else if (powerup.type === 'speed') {
        player.speedBoost = POWERUP_TYPES.speed.duration;
      }
      
      audio.playPowerupSound();
      particles.createParticles(powerup.x + powerup.width/2, powerup.y + powerup.height/2, POWERUP_TYPES[powerup.type].color, 10, 5, 25);
      logEvent('Kraftur sóttur: ' + powerup.type);
    }
  });
  
  const enemies = levelManager.getEnemies();
  enemies.forEach(enemy => {
    if (enemy.hp !== undefined && enemy.hp <= 0) return;
    
    if (!player.invincible && checkCollision(player, enemy)) {
      const playerBottom = player.y + player.height;
      const enemyTop = enemy.y;
      const isStomp = player.velY > 0 && playerBottom - player.velY <= enemyTop + 10;
      
      if (isStomp) {
        enemy.hp = 0;
        player.velY = -10;
        triggerScreenShake(3, 5);
        audio.playEnemyDeathSound();
        particles.createExplosion(enemy.x + enemy.width/2, enemy.y + enemy.height/2, '#9b59b6', 15);
        score += 5;
      } else if (player.takeDamage()) {
        triggerScreenShake(8, 10);
        triggerHitStop(3);
        audio.playDamageSound();
        particles.createExplosion(player.x + player.width/2, player.y + player.height/2, '#e63946', 10);
        if (player.health <= 0) {
          gameOver = true;
          audio.playGameOverSound();
        }
      }
    }
  });
  
  bullets.forEach((bullet, index) => {
    if (!bullet.isEnemy) {
      enemies.forEach(enemy => {
        if (enemy.hp !== undefined && enemy.hp <= 0) return;
        
        if (checkCollision(bullet, enemy)) {
          enemy.hp = (enemy.hp || 1) - 1;
          bullets.splice(index, 1);
          
          if (enemy.hp <= 0) {
            triggerScreenShake(3, 5);
            audio.playEnemyDeathSound();
            particles.createExplosion(enemy.x + enemy.width/2, enemy.y + enemy.height/2, '#9b59b6', 15);
            score += 5;
          }
        }
      });
      
      if (boss && boss.alive && checkCollision(bullet, boss)) {
        boss.hp--;
        bullets.splice(index, 1);
        particles.createParticles(boss.x + boss.width/2, boss.y + boss.height/2, '#ff0000', 5, 2, 8);
        
        if (boss.hp <= 0) {
          boss.alive = false;
          triggerScreenShake(15, 25);
          triggerHitStop(10);
          audio.playWinSound();
          particles.createExplosion(boss.x + boss.width/2, boss.y + boss.height/2, '#ff4500', 40);
          score += 50;
          logEvent('YFIRMAÐNR SIGRÁÐUR!');
        }
      }
    }
  });
}

function updateEnemies() {
  const enemies = levelManager.getEnemies();
  const platforms = levelManager.getPlatforms();
  
  enemies.forEach(enemy => {
    if (enemy.hp !== undefined && enemy.hp <= 0) return;
    
    if (enemy.enemyType === 'flying') {
      enemy.x += enemy.velX;
      enemy.y = (enemy.startY || enemy.y) + Math.sin(Date.now() * 0.003) * (enemy.flyRange || 50);
      
      if (enemy.x < 0) enemy.x = 0;
      if (enemy.x > levelManager.getWorldWidth() - enemy.width) enemy.x = levelManager.getWorldWidth() - enemy.width;
      
    } else if (enemy.enemyType === 'shooter') {
      const platform = platforms[enemy.platformIndex];
      if (platform) {
        enemy.x += enemy.velX;
        
        if (enemy.x <= platform.x || enemy.x + enemy.width >= platform.x + platform.width) {
          enemy.velX *= -1;
        }
        
        if (!enemy.shootCooldown) enemy.shootCooldown = 0;
        
        const distToPlayer = Math.abs((enemy.x + enemy.width/2) - (player.x + player.width/2));
        if (distToPlayer < 400 && enemy.shootCooldown <= 0) {
          const dirToPlayer = player.x < enemy.x ? -1 : 1;
          enemyBullets.push({
            x: enemy.x + enemy.width/2,
            y: enemy.y + enemy.height/2,
            width: 8,
            height: 8,
            velX: dirToPlayer * 5,
            velY: 0,
            isEnemy: true
          });
          enemy.shootCooldown = 120;
        }
        
        if (enemy.shootCooldown > 0) enemy.shootCooldown--;
      }
      
    } else {
      const platform = platforms[enemy.platformIndex];
      if (platform) {
        enemy.x += enemy.velX;
        
        if (enemy.x <= platform.x || enemy.x + enemy.width >= platform.x + platform.width) {
          enemy.velX *= -1;
        }
      }
    }
  });
  
  enemyBullets.forEach((bullet, index) => {
    bullet.x += bullet.velX;
    bullet.y += bullet.velY;
    
    if (checkCollision(bullet, player) && !player.invincible) {
      enemyBullets.splice(index, 1);
      if (player.takeDamage()) {
        audio.playDamageSound();
        if (player.health <= 0) {
          gameOver = true;
          audio.playGameOverSound();
        }
      }
    }
    
    if (bullet.x < 0 || bullet.x > levelManager.getWorldWidth()) {
      enemyBullets.splice(index, 1);
    }
  });
}

function updateBoss() {
  if (levelManager.currentLevel !== 5 || !boss || !boss.alive) {
    if (levelManager.currentLevel === 5 && !boss) {
      boss = {
        x: levelManager.getWorldWidth() - 400,
        y: 200,
        width: 80,
        height: 80,
        hp: 10,
        maxHp: 10,
        alive: true,
        velX: 2,
        velY: 1
      };
      renderer.setBoss(boss);
    }
    return;
  }
  
  boss.x += boss.velX;
  boss.y += boss.velY * Math.sin(Date.now() * 0.002);
  
  if (boss.x < levelManager.getWorldWidth() - 600 || boss.x > levelManager.getWorldWidth() - 100) {
    boss.velX *= -1;
  }
  
  if (boss.y < 100 || boss.y > 400) {
    boss.velY *= -1;
  }
  
  if (!boss.shootCooldown) boss.shootCooldown = 0;
  if (boss.shootCooldown <= 0) {
    const angleToPlayer = Math.atan2(
      (player.y + player.height/2) - (boss.y + boss.height/2),
      (player.x + player.width/2) - (boss.x + boss.width/2)
    );
    
    const speed = 6;
    enemyBullets.push({
      x: boss.x + boss.width/2,
      y: boss.y + boss.height/2,
      width: 10,
      height: 10,
      velX: Math.cos(angleToPlayer) * speed,
      velY: Math.sin(angleToPlayer) * speed,
      isEnemy: true
    });
    boss.shootCooldown = 60;
  }
  if (boss.shootCooldown > 0) boss.shootCooldown--;
}

function updateBullets() {
  bullets = bullets.filter(bullet => {
    bullet.x += bullet.velX;
    bullet.y += bullet.velY;
    return bullet.x > 0 && bullet.x < levelManager.getWorldWidth() && bullet.y > 0 && bullet.y < SCREEN_HEIGHT;
  });
}

function updateCamera() {
  const targetCameraX = player.x - SCREEN_WIDTH / 3;
  cameraX += (targetCameraX - cameraX) * 0.1;
  cameraX = Math.max(0, Math.min(cameraX, levelManager.getWorldWidth() - SCREEN_WIDTH));
}

function updateMovingPlatforms() {
  const platforms = levelManager.getPlatforms();
  let playerOnMovingPlatform = null;
  
  platforms.forEach(platform => {
    if (!platform.moving) return;
    
    const prevX = platform.x;
    const prevY = platform.y;
    
    if (platform.moveX) {
      platform.x += platform.moveX;
      if (platform.minX && platform.x <= platform.minX) {
        platform.x = platform.minX;
        platform.moveX *= -1;
      }
      if (platform.maxX && platform.x >= platform.maxX) {
        platform.x = platform.maxX;
        platform.moveX *= -1;
      }
    }
    
    if (platform.moveY) {
      platform.y += platform.moveY;
      if (platform.minY && platform.y <= platform.minY) {
        platform.y = platform.minY;
        platform.moveY *= -1;
      }
      if (platform.maxY && platform.y >= platform.maxY) {
        platform.y = platform.maxY;
        platform.moveY *= -1;
      }
    }
    
    const dx = platform.x - prevX;
    const dy = platform.y - prevY;
    
    if (player.onGround && 
        player.y + player.height >= platform.y - 5 &&
        player.y + player.height <= platform.y + 10 &&
        player.x + player.width > platform.x &&
        player.x < platform.x + platform.width) {
      player.x += dx;
      player.y += dy;
    }
  });
}

function updateSpikes() {
  const decorations = levelManager.getDecorations();
  
  decorations.forEach(dec => {
    if (dec.type !== 'spikes') return;
    
    if (!player.invincible && checkCollision(player, dec)) {
      if (player.takeDamage()) {
        triggerScreenShake(8, 10);
        triggerHitStop(3);
        audio.playDamageSound();
        particles.createExplosion(player.x + player.width/2, player.y + player.height/2, '#e63946', 10);
        if (player.health <= 0) {
          gameOver = true;
          audio.playGameOverSound();
        }
      }
    }
  });
}

function resetGame() {
  console.trace('resetGame CALLED');
  logEvent('Byrja aftur kallað');
  player.reset(100, 300);
  score = 0;
  gameOver = false;
  gameWon = false;
  cameraX = 0;
  bullets = [];
  enemyBullets = [];
  boss = null;
  shootCooldown = 0;
  particles.clearParticles();
  levelManager.generateWorld();
  setGameState(GAME_STATES.PLAYING);
  logEvent('--- NÝR LEIKUR: Borð ' + levelManager.currentLevel + ' ---');
}

function selectLevel(level) {
  levelManager.setLevel(level);
  resetGame();
  document.querySelectorAll('.level-btn').forEach(btn => btn.classList.remove('active'));
  document.getElementById('level' + level)?.classList.add('active');
}

function gameLoop() {
  const shakeOffset = getScreenShakeOffset();
  
  ctx.save();
  ctx.translate(shakeOffset.x, shakeOffset.y);
  
  ctx.clearRect(-10, -10, canvas.width + 20, canvas.height + 20);
  
  const currentState = getGameState();
  
  if (currentState === GAME_STATES.TITLE) {
    drawTitleScreen(ctx, logoImage);
    const started = updateTitle();
    if (started) {
      saveData = saveManager.loadGame();
      audio.setSoundEnabled(saveData.soundEnabled);
      levelManager.setLevel(1);
      startNewGame();
    }
  } else if (currentState === GAME_STATES.PLAYING) {
    renderer.drawBackground(ctx);
    renderer.drawDecorations(ctx, cameraX);
    renderer.drawCastle(ctx, cameraX);
    renderer.drawPlatforms(ctx, cameraX);
    renderer.drawCoins(ctx, cameraX);
    renderer.drawPowerups(ctx, cameraX);
    renderer.drawEnemies(ctx, cameraX);
    renderer.drawBoss(ctx, cameraX);
    renderer.drawBullets(ctx, bullets, cameraX);
    renderer.drawBullets(ctx, enemyBullets, cameraX);
    particles.drawParticles(ctx, cameraX);
    player.draw(ctx, cameraX);
    
    if (meleeActive) {
      const meleeX = player.facingRight ? player.x + player.width : player.x - 50;
      const screenMeleeX = meleeX - cameraX;
      
      ctx.fillStyle = `rgba(255, 255, 255, ${meleeFrame / 10})`;
      ctx.fillRect(screenMeleeX, player.y, 50, player.height);
      
      ctx.strokeStyle = `rgba(255, 215, 0, ${meleeFrame / 10})`;
      ctx.lineWidth = 3;
      ctx.strokeRect(screenMeleeX, player.y, 50, player.height);
    }
    
    drawHUD(ctx, player, score, cameraX);
    
    if (!isHitStopped()) {
      if (!gameOver && !gameWon) {
        updatePlayer();
        updateEnemies();
        updateBoss();
        updateBullets();
        updateMovingPlatforms();
        updateSpikes();
        particles.updateParticles();
        updateCamera();
      } else if (gameWon) {
        drawWin(ctx, score);
      } else {
        drawGameOver(ctx, score);
      }
    }
    
    updateScreenShake();
    updateHitStop();
    
    if (DEBUG_MODE) {
      ctx.fillStyle = '#000';
      ctx.fillRect(5, 45, 200, 80);
      ctx.fillStyle = '#0f0';
      ctx.font = '12px monospace';
      ctx.textAlign = 'left';
      ctx.fillText(`Player: (${Math.round(player.x)}, ${Math.round(player.y)})`, 10, 60);
      ctx.fillText(`Camera: ${Math.round(cameraX)}`, 10, 75);
      ctx.fillText(`Bullets: ${bullets.length}`, 10, 90);
      ctx.fillText(`Enemies: ${levelManager.getEnemies().length}`, 10, 105);
      ctx.fillText(`FPS: ~60`, 10, 120);
    }
  }
  
  ctx.restore();
  
  requestAnimationFrame(gameLoop);
}

function startNewGame() {
  score = 0;
  gameOver = false;
  gameWon = false;
  cameraX = 0;
  bullets = [];
  enemyBullets = [];
  boss = null;
  shootCooldown = 0;
  particles.clearParticles();
  levelManager.generateWorld();
  player.reset(100, 300);
  setGameState(GAME_STATES.PLAYING);
  logEvent('--- NÝR LEIKUR: Borð ' + levelManager.currentLevel + ' ---');
}

function startGame() {
  score = 0;
  gameOver = false;
  gameWon = false;
  cameraX = 0;
  bullets = [];
  enemyBullets = [];
  boss = null;
  shootCooldown = 0;
  particles.clearParticles();
  levelManager.generateWorld();
  player.reset(100, 300);
  setGameState(GAME_STATES.PLAYING);
  logEvent('--- LEIKUR HEFST: Borð ' + levelManager.currentLevel + ' ---');
}

function init() {
  saveData = saveManager.loadGame();
  audio.setSoundEnabled(saveData.soundEnabled);
  
  const logoImg = new Image();
  logoImg.src = 'logo.svg';
  logoImg.onload = () => {
    logoImage = logoImg;
  };
  
  initInput(canvas);
  setRestartCallback(() => {
    if (gameOver || gameWon) {
      resetGame();
    }
  });
  audio.initAudio();
  
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js')
      .then(reg => console.log('SW registered:', reg.scope))
      .catch(err => console.log('SW registration failed:', err));
  }
  
  const restartBtn = document.getElementById('restartBtn');
  if (restartBtn) {
    restartBtn.addEventListener('click', () => {
      if (gameOver || gameWon) resetGame();
    });
  }
  
  window.selectLevel = selectLevel;
  window.toggleDebug = toggleDebug;
  window.resetGame = resetGame;
  
  gameLoop();
}

init();
