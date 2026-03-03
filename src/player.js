import { MOVE_SPEED, JUMP_FORCE, GRAVITY, FRICTION } from './constants.js';

export class Player {
  constructor() {
    this.x = 100;
    this.y = 300;
    this.width = 32;
    this.height = 48;
    this.velX = 0;
    this.velY = 0;
    this.onGround = false;
    this.color = '#e63946';
    this.facingRight = true;
    this.health = 3;
    this.maxHealth = 3;
    this.invincible = 0;
    this.invincibleDuration = 90;
    this.shield = 0;
    this.speedBoost = 0;
    this.coyoteTime = 0;
    this.coyoteFrames = 8;
    this.jumpBuffer = 0;
    this.jumpBufferFrames = 10;
  }

  reset(x = 100, y = 300) {
    this.x = x;
    this.y = y;
    this.velX = 0;
    this.velY = 0;
    this.facingRight = true;
    this.health = this.maxHealth;
    this.invincible = 0;
    this.shield = 0;
    this.speedBoost = 0;
    this.coyoteTime = 0;
    this.jumpBuffer = 0;
  }

  update(keys, platforms) {
    const speed = this.speedBoost > 0 ? MOVE_SPEED * 1.5 : MOVE_SPEED;
    
    const wasOnGround = this.onGround;

    if (keys.left) {
      this.velX = -speed;
      this.facingRight = false;
    } else if (keys.right) {
      this.velX = speed;
      this.facingRight = true;
    } else {
      this.velX *= FRICTION;
    }

    const wantsToJump = keys.jump || keys.jumpBuffered;

    if (wantsToJump && (this.onGround || this.coyoteTime > 0)) {
      this.velY = JUMP_FORCE;
      this.onGround = false;
      this.coyoteTime = 0;
      this.jumpBuffer = 0;
    }

    if (wasOnGround && !this.onGround && this.velY >= 0) {
      this.coyoteTime = this.coyoteFrames;
    }
    if (this.coyoteTime > 0) this.coyoteTime--;

    if (this.jumpBuffer > 0 && !wantsToJump) {
      this.jumpBuffer = 0;
    }

    this.velY += GRAVITY;

    this.x += this.velX;
    this.y += this.velY;

    this.onGround = false;

    for (const platform of platforms) {
      if (this.checkPlatformCollision(platform)) {
        if (this.velY > 0 && this.y + this.height - this.velY <= platform.y + 5) {
          this.y = platform.y - this.height;
          this.velY = 0;
          this.onGround = true;
        } else if (this.velY < 0 && this.y - this.velY >= platform.y + platform.height - 5) {
          this.y = platform.y + platform.height;
          this.velY = 0;
        }
      }
    }

    if (this.invincible > 0) this.invincible--;
    if (this.shield > 0) this.shield--;
    if (this.speedBoost > 0) this.speedBoost--;
  }

  checkPlatformCollision(platform) {
    return (
      this.x < platform.x + platform.width &&
      this.x + this.width > platform.x &&
      this.y < platform.y + platform.height &&
      this.y + this.height > platform.y
    );
  }

  takeDamage() {
    if (this.invincible > 0) return false;
    
    if (this.shield > 0) {
      this.shield = 0;
      this.invincible = this.invincibleDuration;
      return true;
    }
    
    this.health--;
    this.invincible = this.invincibleDuration;
    return this.health <= 0;
  }

  draw(ctx, cameraX) {
    const screenX = this.x - cameraX;
    
    if (this.invincible > 0 && Math.floor(this.invincible / 5) % 2 === 0) {
      return;
    }

    if (this.shield > 0) {
      ctx.strokeStyle = `rgba(0, 255, 255, ${0.3 + Math.sin(Date.now() * 0.01) * 0.2})`;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(screenX + this.width / 2, this.y + this.height / 2, this.width * 0.9, 0, Math.PI * 2);
      ctx.stroke();
    }

    if (this.speedBoost > 0) {
      ctx.fillStyle = `rgba(255, 170, 0, ${0.3 + Math.random() * 0.2})`;
      ctx.fillRect(screenX - 4, this.y - 4, this.width + 8, this.height + 8);
    }

    ctx.fillStyle = this.color;
    ctx.fillRect(screenX, this.y, this.width, this.height);

    ctx.fillStyle = '#ffd6a5';
    ctx.fillRect(screenX + 6, this.y + 8, 20, 16);

    ctx.fillStyle = '#1d3557';
    ctx.fillRect(screenX + 8, this.y + 12, 6, 6);
    ctx.fillRect(screenX + 18, this.y + 12, 6, 6);

    const gunX = this.facingRight ? this.x + this.width - 4 : this.x - 8;
    ctx.fillStyle = '#333';
    ctx.fillRect(gunX - cameraX, this.y + 20, 12, 8);
    ctx.fillStyle = '#555';
    ctx.fillRect(gunX - cameraX + (this.facingRight ? 8 : 0), this.y + 22, 4, 4);
  }
}
