import { SCREEN_WIDTH, SCREEN_HEIGHT } from './constants.js';

export let platforms = [];
export let coins = [];
export let enemies = [];
export let decorations = [];
export let powerups = [];
export let castle = {};
export let currentLevel = 1;
export let WORLD_WIDTH = SCREEN_WIDTH * 5;
export let currentTheme = 'grasslands';

export function setLevel(level) {
  currentLevel = level;
}

export function generateWorld() {
  switch(currentLevel) {
    case 1: generateLevel1(); break;
    case 2: generateLevel2(); break;
    case 3: generateLevel3(); break;
    case 4: generateLevel4(); break;
    case 5: generateLevel5(); break;
    default: generateLevel1();
  }
}

function generateLevel1() {
  WORLD_WIDTH = SCREEN_WIDTH * 5;
  currentTheme = 'grasslands';
  platforms = [];
  coins = [];
  enemies = [];
  decorations = [];
  powerups = [];
  
  platforms.push({ x: 0, y: 550, width: 600, height: 50 });
  
  platforms.push({ x: 700, y: 520, width: 150, height: 25 });
  platforms.push({ x: 900, y: 450, width: 100, height: 25 });
  platforms.push({ x: 1050, y: 380, width: 120, height: 25 });
  platforms.push({ x: 1200, y: 320, width: 100, height: 25 });
  platforms.push({ x: 1400, y: 400, width: 150, height: 25 });
  
  platforms.push({ x: 1600, y: 550, width: 500, height: 50 });
  
  platforms.push({ x: 1700, y: 480, width: 80, height: 25 });
  platforms.push({ x: 1850, y: 400, width: 100, height: 25 });
  platforms.push({ x: 2000, y: 320, width: 80, height: 25 });
  platforms.push({ x: 2150, y: 250, width: 120, height: 25 });
  
  platforms.push({ x: 2300, y: 550, width: 400, height: 50 });
  
  platforms.push({ x: 2400, y: 470, width: 100, height: 25 });
  platforms.push({ x: 2550, y: 380, width: 150, height: 25 });
  platforms.push({ x: 2750, y: 300, width: 100, height: 25 });
  platforms.push({ x: 2900, y: 220, width: 80, height: 25 });
  
  platforms.push({ x: 3100, y: 550, width: 450, height: 50 });
  
  platforms.push({ x: 3200, y: 450, width: 120, height: 25 });
  platforms.push({ x: 3400, y: 350, width: 100, height: 25 });
  platforms.push({ x: 3550, y: 280, width: 150, height: 25 });
  platforms.push({ x: 3750, y: 200, width: 100, height: 25 });
  
  platforms.push({ x: 3950, y: 550, width: 500, height: 50 });
  
  coins.push(
    { x: 760, y: 480, width: 20, height: 20, collected: false },
    { x: 930, y: 410, width: 20, height: 20, collected: false },
    { x: 1090, y: 340, width: 20, height: 20, collected: false },
    { x: 1230, y: 280, width: 20, height: 20, collected: false },
    { x: 1450, y: 360, width: 20, height: 20, collected: false },
    { x: 1730, y: 440, width: 20, height: 20, collected: false },
    { x: 1880, y: 360, width: 20, height: 20, collected: false },
    { x: 2030, y: 280, width: 20, height: 20, collected: false },
    { x: 2190, y: 210, width: 20, height: 20, collected: false },
    { x: 2440, y: 430, width: 20, height: 20, collected: false },
    { x: 2600, y: 340, width: 20, height: 20, collected: false },
    { x: 2780, y: 260, width: 20, height: 20, collected: false },
    { x: 2930, y: 180, width: 20, height: 20, collected: false },
    { x: 3240, y: 410, width: 20, height: 20, collected: false },
    { x: 3430, y: 310, width: 20, height: 20, collected: false },
    { x: 3600, y: 240, width: 20, height: 20, collected: false },
    { x: 3780, y: 160, width: 20, height: 20, collected: false }
  );
  
  enemies.push({ x: 200, y: 520, width: 32, height: 30, velX: 1.5, platformIndex: 0 });
  enemies.push({ x: 450, y: 520, width: 32, height: 30, velX: -1.5, platformIndex: 0 });
  enemies.push({ x: 730, y: 490, width: 32, height: 30, velX: 1.2, platformIndex: 1 });
  enemies.push({ x: 1450, y: 370, width: 32, height: 30, velX: -1.8, platformIndex: 5 });
  enemies.push({ x: 1650, y: 520, width: 32, height: 30, velX: 2, platformIndex: 6 });
  enemies.push({ x: 1900, y: 520, width: 32, height: 30, velX: -1.5, platformIndex: 6 });
  enemies.push({ x: 2150, y: 220, width: 32, height: 30, velX: 1, platformIndex: 9 });
  enemies.push({ x: 2450, y: 520, width: 32, height: 30, velX: 1.8, platformIndex: 10 });
  enemies.push({ x: 2800, y: 270, width: 32, height: 30, velX: -1.2, platformIndex: 13 });
  enemies.push({ x: 3300, y: 520, width: 32, height: 30, velX: 2, platformIndex: 16 });
  enemies.push({ x: 3600, y: 250, width: 32, height: 30, velX: 1.5, platformIndex: 18 });
  
  enemies.push({ x: 600, y: 200, width: 32, height: 24, velX: 1.5, enemyType: 'flying', flyRange: 120, startY: 200 });
  enemies.push({ x: 1300, y: 150, width: 32, height: 24, velX: -1.8, enemyType: 'flying', flyRange: 100, startY: 150 });
  enemies.push({ x: 2200, y: 180, width: 32, height: 24, velX: 2, enemyType: 'flying', flyRange: 150, startY: 180 });
  enemies.push({ x: 3000, y: 220, width: 32, height: 24, velX: -1.5, enemyType: 'flying', flyRange: 130, startY: 220 });
  
  enemies.push({ x: 1100, y: 290, width: 32, height: 30, velX: 1, platformIndex: 4, enemyType: 'shooter' });
  enemies.push({ x: 2000, y: 200, width: 32, height: 30, velX: -1.2, platformIndex: 8, enemyType: 'shooter' });
  enemies.push({ x: 2600, y: 250, width: 32, height: 30, velX: 1.5, platformIndex: 12, enemyType: 'shooter' });
  enemies.push({ x: 3500, y: 300, width: 32, height: 30, velX: -1, platformIndex: 17, enemyType: 'shooter' });
  
  powerups.push(
    { x: 950, y: 400, width: 24, height: 24, type: 'shield', collected: false },
    { x: 1800, y: 350, width: 24, height: 24, type: 'speed', collected: false },
    { x: 2500, y: 450, width: 24, height: 24, type: 'shield', collected: false },
    { x: 3200, y: 300, width: 24, height: 24, type: 'speed', collected: false }
  );
  
  for (let i = 0; i < 12; i++) {
    decorations.push({ type: 'tree', x: 100 + i * 350, y: 530, size: 40 + Math.random() * 25 });
  }
  for (let i = 0; i < 8; i++) {
    decorations.push({ type: 'bush', x: 200 + i * 450, y: 525 + Math.random() * 25, size: 12 + Math.random() * 10 });
  }
  for (let i = 0; i < 15; i++) {
    decorations.push({ type: 'cloud', x: i * 280 + Math.random() * 150, y: 40 + Math.random() * 60, size: 25 + Math.random() * 15 });
  }
  
  castle = { x: WORLD_WIDTH - 280, y: 350, width: 220, height: 200, doorX: WORLD_WIDTH - 180, doorY: 420, doorWidth: 60, doorHeight: 130 };
  platforms.push({ x: WORLD_WIDTH - 320, y: 550, width: 350, height: 50 });
}

function generateLevel2() {
  WORLD_WIDTH = SCREEN_WIDTH * 5;
  currentTheme = 'desert';
  platforms = [];
  coins = [];
  enemies = [];
  decorations = [];
  powerups = [];
  
  platforms.push({ x: 0, y: 550, width: 500, height: 50 });
  
  for (let i = 0; i < 8; i++) {
    platforms.push({
      x: 550 + i * 180,
      y: 500 - (i % 3) * 80,
      width: 100 + Math.random() * 50,
      height: 25
    });
  }
  
  platforms.push({ x: 2000, y: 550, width: 600, height: 50 });
  
  for (let i = 0; i < 6; i++) {
    platforms.push({
      x: 2100 + i * 150,
      y: 450 - i * 60,
      width: 80,
      height: 25
    });
  }
  
  platforms.push({ x: 3000, y: 550, width: 500, height: 50 });
  
  for (let i = 0; i < 5; i++) {
    decorations.push({ type: 'cactus', x: 100 + i * 200, y: 530, size: 20 + Math.random() * 15 });
  }
  for (let i = 0; i < 6; i++) {
    decorations.push({ type: 'pyramid', x: 300 + i * 400, y: 530, size: 60 + Math.random() * 40 });
  }
  for (let i = 0; i < 10; i++) {
    decorations.push({ type: 'cloud', x: i * 250 + Math.random() * 100, y: 50 + Math.random() * 50, size: 30 + Math.random() * 20 });
  }
  
  for (let i = 0; i < 20; i++) {
    coins.push({
      x: 100 + i * 180 + Math.random() * 50,
      y: 300 + Math.random() * 200,
      width: 20,
      height: 20,
      collected: false
    });
  }
  
  for (let i = 0; i < 12; i++) {
    enemies.push({
      x: 200 + i * 300,
      y: 520,
      width: 32,
      height: 30,
      velX: (Math.random() > 0.5 ? 1 : -1) * (1 + Math.random()),
      platformIndex: Math.floor(i / 2)
    });
  }
  
  for (let i = 0; i < 4; i++) {
    enemies.push({
      x: 800 + i * 500,
      y: 150,
      width: 32,
      height: 24,
      velX: (Math.random() > 0.5 ? 1 : -1) * 2,
      enemyType: 'flying',
      flyRange: 100,
      startY: 150
    });
  }
  
  castle = { x: WORLD_WIDTH - 280, y: 350, width: 220, height: 200, doorX: WORLD_WIDTH - 180, doorY: 420, doorWidth: 60, doorHeight: 130 };
  platforms.push({ x: WORLD_WIDTH - 320, y: 550, width: 350, height: 50 });
}

function generateLevel3() {
  WORLD_WIDTH = SCREEN_WIDTH * 5;
  currentTheme = 'cave';
  platforms = [];
  coins = [];
  enemies = [];
  decorations = [];
  powerups = [];
  
  platforms.push({ x: 0, y: 550, width: 400, height: 50 });
  
  platforms.push({ x: 400, y: 450, width: 100, height: 20, moving: true, moveX: 2, minX: 400, maxX: 600 });
  platforms.push({ x: 700, y: 380, width: 100, height: 20, moving: true, moveY: 1.5, minY: 280, maxY: 450 });
  
  for (let i = 0; i < 8; i++) {
    platforms.push({
      x: 500 + i * 180,
      y: 480 - Math.sin(i * 0.8) * 150,
      width: 80 + Math.random() * 40,
      height: 25
    });
  }
  
  platforms.push({ x: 1800, y: 550, width: 300, height: 50 });
  platforms.push({ x: 2200, y: 550, width: 300, height: 50 });
  
  platforms.push({ x: 2000, y: 400, width: 120, height: 20, moving: true, moveX: 1.5, minX: 1950, maxX: 2250 });
  
  for (let i = 0; i < 6; i++) {
    platforms.push({
      x: 2100 + i * 150,
      y: 420 - i * 50,
      width: 70,
      height: 25
    });
  }
  
  platforms.push({ x: 3000, y: 550, width: 400, height: 50 });
  
  platforms.push({ x: 3200, y: 350, width: 100, height: 20, moving: true, moveY: 2, minY: 250, maxY: 450 });
  
  for (let i = 0; i < 15; i++) {
    decorations.push({ type: 'stalactite', x: 50 + i * 200, y: 60 + Math.random() * 30, size: 30 + Math.random() * 30 });
  }
  for (let i = 0; i < 10; i++) {
    decorations.push({ type: 'rock', x: 100 + i * 300, y: 530, size: 15 + Math.random() * 20 });
  }
  
  decorations.push({ type: 'spikes', x: 800, y: 535, width: 80, height: 15 });
  decorations.push({ type: 'spikes', x: 1400, y: 535, width: 60, height: 15 });
  decorations.push({ type: 'spikes', x: 2600, y: 535, width: 100, height: 15 });
  
  for (let i = 0; i < 25; i++) {
    coins.push({
      x: 100 + i * 150 + Math.random() * 50,
      y: 200 + Math.random() * 300,
      width: 20,
      height: 20,
      collected: false
    });
  }
  
  for (let i = 0; i < 12; i++) {
    enemies.push({
      x: 200 + i * 250,
      y: 520,
      width: 32,
      height: 30,
      velX: (Math.random() > 0.5 ? 1 : -1) * 1.5,
      platformIndex: Math.floor(i / 3)
    });
  }
  
  for (let i = 0; i < 6; i++) {
    enemies.push({
      x: 600 + i * 400,
      y: 100,
      width: 32,
      height: 24,
      velX: (Math.random() > 0.5 ? 1 : -1) * 2.5,
      enemyType: 'flying',
      flyRange: 80,
      startY: 100
    });
  }
  
  castle = { x: WORLD_WIDTH - 280, y: 350, width: 220, height: 200, doorX: WORLD_WIDTH - 180, doorY: 420, doorWidth: 60, doorHeight: 130 };
  platforms.push({ x: WORLD_WIDTH - 320, y: 550, width: 350, height: 50 });
}

function generateLevel4() {
  WORLD_WIDTH = SCREEN_WIDTH * 5;
  currentTheme = 'snow';
  platforms = [];
  coins = [];
  enemies = [];
  decorations = [];
  powerups = [];
  
  platforms.push({ x: 0, y: 550, width: 450, height: 50 });
  
  for (let i = 0; i < 9; i++) {
    platforms.push({
      x: 500 + i * 180,
      y: 500 - (i % 4) * 90,
      width: 100,
      height: 25
    });
  }
  
  platforms.push({ x: 1900, y: 550, width: 550, height: 50 });
  
  for (let i = 0; i < 7; i++) {
    platforms.push({
      x: 2000 + i * 160,
      y: 440 - i * 70,
      width: 90,
      height: 25
    });
  }
  
  platforms.push({ x: 3200, y: 550, width: 450, height: 50 });
  
  for (let i = 0; i < 12; i++) {
    decorations.push({ type: 'snowtree', x: 80 + i * 280, y: 530, size: 35 + Math.random() * 20 });
  }
  for (let i = 0; i < 8; i++) {
    decorations.push({ type: 'snowman', x: 200 + i * 350, y: 525, size: 12 + Math.random() * 8 });
  }
  
  for (let i = 0; i < 22; i++) {
    coins.push({
      x: 100 + i * 170,
      y: 250 + Math.random() * 250,
      width: 20,
      height: 20,
      collected: false
    });
  }
  
  for (let i = 0; i < 14; i++) {
    enemies.push({
      x: 150 + i * 280,
      y: 520,
      width: 32,
      height: 30,
      velX: (Math.random() > 0.5 ? 1 : -1) * (1.2 + Math.random() * 0.8),
      platformIndex: Math.floor(i / 3)
    });
  }
  
  for (let i = 0; i < 5; i++) {
    enemies.push({
      x: 700 + i * 450,
      y: 120,
      width: 32,
      height: 24,
      velX: (Math.random() > 0.5 ? 1 : -1) * 2,
      enemyType: 'flying',
      flyRange: 120,
      startY: 120
    });
  }
  
  powerups.push(
    { x: 600, y: 450, width: 24, height: 24, type: 'shield', collected: false },
    { x: 1500, y: 400, width: 24, height: 24, type: 'speed', collected: false },
    { x: 2800, y: 350, width: 24, height: 24, type: 'shield', collected: false }
  );
  
  castle = { x: WORLD_WIDTH - 280, y: 350, width: 220, height: 200, doorX: WORLD_WIDTH - 180, doorY: 420, doorWidth: 60, doorHeight: 130 };
  platforms.push({ x: WORLD_WIDTH - 320, y: 550, width: 350, height: 50 });
}

function generateLevel5() {
  WORLD_WIDTH = SCREEN_WIDTH * 6;
  currentTheme = 'volcanic';
  platforms = [];
  coins = [];
  enemies = [];
  decorations = [];
  powerups = [];
  
  platforms.push({ x: 0, y: 550, width: 400, height: 50 });
  
  for (let i = 0; i < 8; i++) {
    platforms.push({
      x: 450 + i * 200,
      y: 480 - (i % 3) * 100,
      width: 90,
      height: 25
    });
  }
  
  platforms.push({ x: 1900, y: 550, width: 600, height: 50 });
  
  platforms.push({ x: 2000, y: 450, width: 100, height: 25 });
  platforms.push({ x: 2200, y: 380, width: 100, height: 25 });
  platforms.push({ x: 2400, y: 300, width: 150, height: 25 });
  
  platforms.push({ x: 2700, y: 550, width: 600, height: 50 });
  
  for (let i = 0; i < 5; i++) {
    decorations.push({ type: 'lava', x: 200 + i * 400, y: 535, size: 20 + Math.random() * 15 });
  }
  for (let i = 0; i < 8; i++) {
    decorations.push({ type: 'smoke', x: 150 + i * 350, y: 50 + Math.random() * 30, size: 40 + Math.random() * 30 });
  }
  
  for (let i = 0; i < 18; i++) {
    coins.push({
      x: 100 + i * 200,
      y: 200 + Math.random() * 300,
      width: 20,
      height: 20,
      collected: false
    });
  }
  
  for (let i = 0; i < 10; i++) {
    enemies.push({
      x: 100 + i * 300,
      y: 520,
      width: 32,
      height: 30,
      velX: (Math.random() > 0.5 ? 1 : -1) * 2,
      platformIndex: Math.floor(i / 2)
    });
  }
  
  for (let i = 0; i < 4; i++) {
    enemies.push({
      x: 600 + i * 400,
      y: 150,
      width: 32,
      height: 24,
      velX: (Math.random() > 0.5 ? 1 : -1) * 2.5,
      enemyType: 'flying',
      flyRange: 100,
      startY: 150
    });
  }
  
  powerups.push(
    { x: 500, y: 430, width: 24, height: 24, type: 'shield', collected: false },
    { x: 1200, y: 380, width: 24, height: 24, type: 'speed', collected: false },
    { x: 2100, y: 500, width: 24, height: 24, type: 'shield', collected: false }
  );
  
  castle = { x: WORLD_WIDTH - 280, y: 350, width: 220, height: 200, doorX: WORLD_WIDTH - 180, doorY: 420, doorWidth: 60, doorHeight: 130 };
  platforms.push({ x: WORLD_WIDTH - 320, y: 550, width: 350, height: 50 });
}

export function getPlatforms() {
  return platforms;
}

export function getCoins() {
  return coins;
}

export function getEnemies() {
  return enemies;
}

export function getDecorations() {
  return decorations;
}

export function getPowerups() {
  return powerups;
}

export function getCastle() {
  return castle;
}

export function getWorldWidth() {
  return WORLD_WIDTH;
}

export function getCurrentTheme() {
  return currentTheme;
}
