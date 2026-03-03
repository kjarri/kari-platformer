export let particles = [];

export function createParticles(x, y, color, count, minSpeed, maxSpeed) {
  for (let i = 0; i < count; i++) {
    const angle = Math.random() * Math.PI * 2;
    const speed = minSpeed + Math.random() * (maxSpeed - minSpeed);
    particles.push({
      x,
      y,
      velX: Math.cos(angle) * speed,
      velY: Math.sin(angle) * speed - 2,
      color,
      size: 3 + Math.random() * 4,
      life: 30 + Math.random() * 20
    });
  }
}

export function createExplosion(x, y, color, count = 20) {
  for (let i = 0; i < count; i++) {
    const angle = (Math.PI * 2 / count) * i + Math.random() * 0.5;
    const speed = 3 + Math.random() * 5;
    particles.push({
      x,
      y,
      velX: Math.cos(angle) * speed,
      velY: Math.sin(angle) * speed,
      color,
      size: 5 + Math.random() * 8,
      life: 40 + Math.random() * 20
    });
  }
}

export function updateParticles() {
  particles = particles.filter(p => {
    p.x += p.velX;
    p.y += p.velY;
    p.velY += 0.15;
    p.life--;
    p.size *= 0.97;
    return p.life > 0 && p.size > 0.5;
  });
}

export function drawParticles(ctx, cameraX) {
  particles.forEach(p => {
    ctx.globalAlpha = p.life / 50;
    ctx.fillStyle = p.color;
    ctx.beginPath();
    ctx.arc(p.x - cameraX, p.y, p.size, 0, Math.PI * 2);
    ctx.fill();
  });
  ctx.globalAlpha = 1;
}

export function clearParticles() {
  particles = [];
}
