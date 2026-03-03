import { SCREEN_WIDTH, SCREEN_HEIGHT, POWERUP_TYPES } from './constants.js';
import { getPlatforms, getCoins, getEnemies, getDecorations, getPowerups, getCastle, getCurrentTheme } from './levelManager.js';

export function drawBackground(ctx) {
  const theme = getCurrentTheme();
  
  switch(theme) {
    case 'grasslands':
      const grassGrad = ctx.createLinearGradient(0, 0, 0, SCREEN_HEIGHT);
      grassGrad.addColorStop(0, '#87ceeb');
      grassGrad.addColorStop(0.6, '#e0f7fa');
      grassGrad.addColorStop(1, '#90ee90');
      ctx.fillStyle = grassGrad;
      ctx.fillRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);
      break;
      
    case 'desert':
      const desertGrad = ctx.createLinearGradient(0, 0, 0, SCREEN_HEIGHT);
      desertGrad.addColorStop(0, '#87ceeb');
      desertGrad.addColorStop(0.5, '#fff8dc');
      desertGrad.addColorStop(1, '#f4a460');
      ctx.fillStyle = desertGrad;
      ctx.fillRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);
      break;
      
    case 'cave':
      ctx.fillStyle = '#1a1a1a';
      ctx.fillRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);
      break;
      
    case 'snow':
      const snowGrad = ctx.createLinearGradient(0, 0, 0, SCREEN_HEIGHT);
      snowGrad.addColorStop(0, '#b0c4de');
      snowGrad.addColorStop(0.6, '#e8f4f8');
      snowGrad.addColorStop(1, '#f0f8ff');
      ctx.fillStyle = snowGrad;
      ctx.fillRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);
      break;
      
    case 'volcanic':
      const volcGrad = ctx.createLinearGradient(0, 0, 0, SCREEN_HEIGHT);
      volcGrad.addColorStop(0, '#2d1b1b');
      volcGrad.addColorStop(0.5, '#4a2020');
      volcGrad.addColorStop(1, '#1a0a0a');
      ctx.fillStyle = volcGrad;
      ctx.fillRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);
      break;
      
    default:
      ctx.fillStyle = '#87ceeb';
      ctx.fillRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);
  }
}

export function drawDecorations(ctx, cameraX) {
  const decorations = getDecorations();
  const theme = getCurrentTheme();
  
  decorations.forEach(dec => {
    const dx = dec.x - cameraX;
    if (dx > SCREEN_WIDTH + 100 || dx < -100) return;
    
    switch(dec.type) {
      case 'tree':
        ctx.fillStyle = '#4a3728';
        ctx.fillRect(dx + dec.size * 0.4, dec.y - dec.size * 0.2, dec.size * 0.2, dec.size * 0.3);
        ctx.fillStyle = '#2d6a4f';
        ctx.beginPath();
        ctx.moveTo(dx, dec.y - dec.size * 0.2);
        ctx.lineTo(dx + dec.size / 2, dec.y - dec.size);
        ctx.lineTo(dx + dec.size, dec.y - dec.size * 0.2);
        ctx.closePath();
        ctx.fill();
        break;
        
      case 'bush':
        ctx.fillStyle = '#40916c';
        ctx.beginPath();
        ctx.arc(dx, dec.y, dec.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(dx - dec.size * 0.6, dec.y + 2, dec.size * 0.7, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(dx + dec.size * 0.6, dec.y + 2, dec.size * 0.7, 0, Math.PI * 2);
        ctx.fill();
        break;
        
      case 'cloud':
        ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
        ctx.beginPath();
        ctx.arc(dx, dec.y, dec.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(dx - dec.size * 0.7, dec.y + 5, dec.size * 0.7, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(dx + dec.size * 0.7, dec.y + 5, dec.size * 0.7, 0, Math.PI * 2);
        ctx.fill();
        break;
        
      case 'cactus':
        ctx.fillStyle = '#228b22';
        ctx.fillRect(dx, dec.y - dec.size * 1.5, dec.size * 0.3, dec.size * 1.5);
        ctx.fillRect(dx - dec.size * 0.4, dec.y - dec.size * 0.8, dec.size * 0.3, dec.size * 0.5);
        ctx.fillRect(dx + dec.size * 0.1, dec.y - dec.size * 1.1, dec.size * 0.3, dec.size * 0.4);
        break;
        
      case 'pyramid':
        ctx.fillStyle = '#deb887';
        ctx.beginPath();
        ctx.moveTo(dx, dec.y);
        ctx.lineTo(dx + dec.size / 2, dec.y - dec.size);
        ctx.lineTo(dx + dec.size, dec.y);
        ctx.closePath();
        ctx.fill();
        ctx.fillStyle = '#d2b48c';
        ctx.beginPath();
        ctx.moveTo(dx + dec.size * 0.3, dec.y);
        ctx.lineTo(dx + dec.size / 2, dec.y - dec.size * 0.6);
        ctx.lineTo(dx + dec.size * 0.7, dec.y);
        ctx.closePath();
        ctx.fill();
        break;
        
      case 'stalactite':
        ctx.fillStyle = '#5a5a5a';
        ctx.beginPath();
        ctx.moveTo(dx, dec.y);
        ctx.lineTo(dx + dec.size * 0.3, dec.y + dec.size);
        ctx.lineTo(dx - dec.size * 0.3, dec.y + dec.size);
        ctx.closePath();
        ctx.fill();
        break;
        
      case 'rock':
        ctx.fillStyle = '#4a4a4a';
        ctx.beginPath();
        ctx.ellipse(dx, dec.y, dec.size, dec.size * 0.6, 0, 0, Math.PI * 2);
        ctx.fill();
        break;
        
      case 'mushroom':
        ctx.fillStyle = '#8b4513';
        ctx.fillRect(dx - 2, dec.y - dec.size * 0.3, 4, dec.size * 0.3);
        ctx.fillStyle = '#ff4444';
        ctx.beginPath();
        ctx.arc(dx, dec.y - dec.size * 0.3, dec.size * 0.5, 0, Math.PI * 2);
        ctx.fill();
        break;
        
      case 'snowtree':
        ctx.fillStyle = '#4a3728';
        ctx.fillRect(dx + dec.size * 0.4, dec.y - dec.size * 0.2, dec.size * 0.2, dec.size * 0.3);
        ctx.fillStyle = '#e8f4f8';
        ctx.beginPath();
        ctx.moveTo(dx, dec.y - dec.size * 0.2);
        ctx.lineTo(dx + dec.size / 2, dec.y - dec.size);
        ctx.lineTo(dx + dec.size, dec.y - dec.size * 0.2);
        ctx.closePath();
        ctx.fill();
        break;
        
      case 'snowman':
        ctx.fillStyle = '#f5f5f5';
        ctx.beginPath();
        ctx.arc(dx, dec.y, dec.size * 0.8, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(dx, dec.y - dec.size * 1.3, dec.size * 0.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(dx, dec.y - dec.size * 2, dec.size * 0.35, 0, Math.PI * 2);
        ctx.fill();
        break;
        
      case 'lava':
        ctx.fillStyle = '#ff4500';
        ctx.beginPath();
        ctx.arc(dx, dec.y, dec.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#ffa500';
        ctx.beginPath();
        ctx.arc(dx, dec.y, dec.size * 0.6, 0, Math.PI * 2);
        ctx.fill();
        break;
        
      case 'smoke':
        ctx.fillStyle = `rgba(100, 100, 100, ${0.3 + Math.random() * 0.2})`;
        ctx.beginPath();
        ctx.arc(dx, dec.y, dec.size, 0, Math.PI * 2);
        ctx.fill();
        break;
        
      case 'spikes':
        ctx.fillStyle = '#666';
        const spikeCount = Math.floor(dec.width / 10);
        for (let i = 0; i < spikeCount; i++) {
          const spikeX = dx + i * 10;
          ctx.beginPath();
          ctx.moveTo(spikeX, dec.y + dec.height);
          ctx.lineTo(spikeX + 5, dec.y);
          ctx.lineTo(spikeX + 10, dec.y + dec.height);
          ctx.closePath();
          ctx.fill();
        }
        break;
    }
  });
}

export function drawCastle(ctx, cameraX) {
  const castle = getCastle();
  const cx = castle.x - cameraX;
  
  ctx.fillStyle = '#4a4e69';
  ctx.fillRect(cx, castle.y, castle.width, castle.height);
  
  ctx.fillStyle = '#22223b';
  ctx.fillRect(cx + 20, castle.y - 30, castle.width - 40, 40);
  
  for (let i = 0; i < 3; i++) {
    ctx.fillRect(cx + 20 + i * 70, castle.y - 50, 30, 25);
  }
  
  ctx.fillStyle = '#1a1a2e';
  ctx.fillRect(castle.doorX - cameraX, castle.doorY, castle.doorWidth, castle.doorHeight);
  
  ctx.fillStyle = '#ffd700';
  ctx.beginPath();
  ctx.arc(castle.doorX - cameraX + castle.doorWidth / 2, castle.doorY + 30, 8, 0, Math.PI * 2);
  ctx.fill();
}

export function drawPlatforms(ctx, cameraX) {
  const platforms = getPlatforms();
  const theme = getCurrentTheme();
  
  platforms.forEach(platform => {
    if (platform.x - cameraX > SCREEN_WIDTH || platform.x + platform.width - cameraX < 0) return;
    
    const px = platform.x - cameraX;
    
    if (platform.moving) {
      ctx.fillStyle = '#8b5a2b';
      ctx.beginPath();
      ctx.roundRect(px, platform.y, platform.width, platform.height, 5);
      ctx.fill();
      ctx.fillStyle = '#a0522d';
      ctx.fillRect(px, platform.y, platform.width, 6);
      
      ctx.fillStyle = '#ffd700';
      for (let i = 0; i < platform.width; i += 20) {
        ctx.beginPath();
        ctx.arc(px + i + 10, platform.y + platform.height / 2, 3, 0, Math.PI * 2);
        ctx.fill();
      }
      return;
    }
    
    switch(theme) {
      case 'desert':
        ctx.fillStyle = '#c2956e';
        ctx.beginPath();
        ctx.roundRect(px, platform.y, platform.width, platform.height, 5);
        ctx.fill();
        ctx.fillStyle = '#d4a574';
        ctx.fillRect(px, platform.y, platform.width, 8);
        break;
        
      case 'cave':
        ctx.fillStyle = '#4a4a4a';
        ctx.beginPath();
        ctx.roundRect(px, platform.y, platform.width, platform.height, 3);
        ctx.fill();
        ctx.fillStyle = '#5a5a5a';
        ctx.fillRect(px, platform.y, platform.width, 6);
        break;
        
      case 'snow':
        ctx.fillStyle = '#a8c8dc';
        ctx.beginPath();
        ctx.roundRect(px, platform.y, platform.width, platform.height, 5);
        ctx.fill();
        ctx.fillStyle = '#e8f4f8';
        ctx.beginPath();
        ctx.roundRect(px, platform.y, platform.width, 10, [5, 5, 0, 0]);
        ctx.fill();
        break;
        
      case 'volcanic':
        ctx.fillStyle = '#2a1a1a';
        ctx.beginPath();
        ctx.roundRect(px, platform.y, platform.width, platform.height, 3);
        ctx.fill();
        ctx.fillStyle = '#4a2a2a';
        ctx.fillRect(px, platform.y, platform.width, 8);
        break;
        
      default:
        ctx.fillStyle = '#40916c';
        ctx.beginPath();
        ctx.roundRect(px, platform.y, platform.width, platform.height, 5);
        ctx.fill();
        ctx.fillStyle = '#52b788';
        ctx.fillRect(px, platform.y, platform.width, 8);
    }
  });
}

export function drawCoins(ctx, cameraX) {
  const coins = getCoins();
  
  coins.forEach(coin => {
    if (coin.collected) return;
    
    const cx = coin.x - cameraX;
    if (cx > SCREEN_WIDTH + 20 || cx < -20) return;
    
    ctx.fillStyle = '#ffd700';
    ctx.beginPath();
    ctx.arc(cx + coin.width / 2, coin.y + coin.height / 2, coin.width / 2, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.fillStyle = '#ffaa00';
    ctx.beginPath();
    ctx.arc(cx + coin.width / 2, coin.y + coin.height / 2, coin.width / 2 - 3, 0, Math.PI * 2);
    ctx.fill();
  });
}

export function drawPowerups(ctx, cameraX) {
  const powerups = getPowerups();
  
  powerups.forEach(powerup => {
    if (powerup.collected) return;
    
    const px = powerup.x - cameraX;
    if (px > SCREEN_WIDTH + 20 || px < -20) return;
    
    const type = POWERUP_TYPES[powerup.type];
    ctx.fillStyle = type.color;
    ctx.beginPath();
    ctx.roundRect(px, powerup.y, powerup.width, powerup.height, 5);
    ctx.fill();
    
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 14px "Courier New", monospace';
    ctx.textAlign = 'center';
    ctx.fillText(type.symbol, px + powerup.width / 2, powerup.y + powerup.height - 6);
  });
}

export function drawEnemies(ctx, cameraX) {
  const enemies = getEnemies();
  
  enemies.forEach(enemy => {
    if (enemy.hp !== undefined && enemy.hp <= 0) return;
    
    const ex = enemy.x - cameraX;
    if (ex > SCREEN_WIDTH + 50 || ex < -50) return;
    
    if (enemy.enemyType === 'flying') {
      ctx.fillStyle = '#dc143c';
      ctx.beginPath();
      ctx.ellipse(ex + enemy.width / 2, enemy.y + enemy.height / 2, enemy.width / 2, enemy.height / 2, 0, 0, Math.PI * 2);
      ctx.fill();
      
      ctx.fillStyle = '#ff6b6b';
      ctx.beginPath();
      ctx.ellipse(ex + enemy.width / 2, enemy.y + enemy.height / 2 - 5, enemy.width / 3, enemy.height / 3, 0, 0, Math.PI * 2);
      ctx.fill();
      
      ctx.fillStyle = '#fff';
      ctx.fillRect(ex + enemy.width / 2 - 8, enemy.y + 5, 5, 5);
      ctx.fillRect(ex + enemy.width / 2 + 3, enemy.y + 5, 5, 5);
      
      ctx.fillStyle = '#333';
      ctx.fillRect(ex + enemy.width / 2 - 6, enemy.y + enemy.height - 3, 12, 4);
      ctx.fillRect(ex - 5, enemy.y + enemy.height / 2 - 8, 8, 12);
      ctx.fillRect(ex + enemy.width - 3, enemy.y + enemy.height / 2 - 8, 8, 12);
      
    } else if (enemy.enemyType === 'shooter') {
      ctx.fillStyle = '#228b22';
      ctx.fillRect(ex, enemy.y, enemy.width, enemy.height);
      
      ctx.fillStyle = '#90ee90';
      ctx.fillRect(ex + 5, enemy.y + 5, 10, 10);
      
      ctx.fillStyle = enemy.velX > 0 ? '#000' : '#333';
      const eyeX = enemy.velX > 0 ? ex + enemy.width - 10 : ex + 2;
      ctx.fillRect(eyeX, enemy.y + 8, 6, 6);
      
      if (enemy.shootCooldown && enemy.shootCooldown < 30) {
        ctx.fillStyle = '#ff0000';
        ctx.beginPath();
        ctx.arc(ex + enemy.width / 2, enemy.y - 5, 4, 0, Math.PI * 2);
        ctx.fill();
      }
      
    } else {
      ctx.fillStyle = '#9b59b6';
      ctx.fillRect(ex, enemy.y, enemy.width, enemy.height);
      
      ctx.fillStyle = '#8e44ad';
      ctx.fillRect(ex + 3, enemy.y + 3, enemy.width - 6, 10);
      
      ctx.fillStyle = '#fff';
      ctx.fillRect(ex + 5, enemy.y + 8, 8, 8);
      ctx.fillRect(ex + enemy.width - 13, enemy.y + 8, 8, 8);
      ctx.fillStyle = '#000';
      ctx.fillRect(ex + 7, enemy.y + 10, 4, 4);
      ctx.fillRect(ex + enemy.width - 11, enemy.y + 10, 4, 4);
    }
  });
}

let boss = null;

export function setBoss(bossInstance) {
  boss = bossInstance;
}

export function drawBoss(ctx, cameraX) {
  if (!boss || !boss.alive) return;
  
  const bx = boss.x - cameraX;
  if (bx > SCREEN_WIDTH + 100 || bx < -100) return;
  
  ctx.fillStyle = '#c0392b';
  ctx.fillRect(bx, boss.y, boss.width, boss.height);
  
  ctx.fillStyle = '#e74c3c';
  ctx.fillRect(bx + 10, boss.y + 10, boss.width - 20, boss.height - 30);
  
  ctx.fillStyle = '#fff';
  ctx.fillRect(bx + 20, boss.y + 30, 15, 15);
  ctx.fillRect(bx + boss.width - 35, boss.y + 30, 15, 15);
  ctx.fillStyle = '#000';
  ctx.fillRect(bx + 25, boss.y + 35, 5, 5);
  ctx.fillRect(bx + boss.width - 30, boss.y + 35, 5, 5);
  
  ctx.fillStyle = '#2c3e50';
  ctx.fillRect(bx + 10, boss.y + boss.height - 15, 30, 10);
  ctx.fillRect(bx + boss.width - 40, boss.y + boss.height - 15, 30, 10);
  
  const barWidth = boss.width;
  const barHeight = 10;
  const barX = bx;
  const barY = boss.y - 25;
  
  ctx.fillStyle = '#333';
  ctx.fillRect(barX, barY, barWidth, barHeight);
  
  const hpPercent = boss.hp / boss.maxHp;
  ctx.fillStyle = hpPercent > 0.5 ? '#27ae60' : hpPercent > 0.25 ? '#f39c12' : '#e74c3c';
  ctx.fillRect(barX + 1, barY + 1, (barWidth - 2) * hpPercent, barHeight - 2);
}

export function drawBullets(ctx, bullets, cameraX) {
  bullets.forEach(bullet => {
    const bx = bullet.x - cameraX;
    if (bx > SCREEN_WIDTH + 20 || bx < -20) return;
    
    ctx.fillStyle = bullet.isEnemy ? '#ff0000' : '#ffff00';
    ctx.beginPath();
    ctx.arc(bx, bullet.y, 5, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.fillStyle = bullet.isEnemy ? '#ff6600' : '#ffffff';
    ctx.beginPath();
    ctx.arc(bx, bullet.y, 3, 0, Math.PI * 2);
    ctx.fill();
  });
}
