let audioContext = null;
let soundEnabled = true;

function getAudioContext() {
  if (!audioContext) {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
  }
  return audioContext;
}

export function initAudio() {
  if ('ontouchstart' in window || navigator.maxTouchPoints > 0) {
    getAudioContext();
  }
}

export function setSoundEnabled(enabled) {
  soundEnabled = enabled;
}

export function isSoundEnabled() {
  return soundEnabled;
}

function playTone(frequency, duration, type = 'square', volume = 0.1) {
  if (!soundEnabled) return;
  
  try {
    const ctx = getAudioContext();
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);
    
    oscillator.type = type;
    oscillator.frequency.setValueAtTime(frequency, ctx.currentTime);
    
    gainNode.gain.setValueAtTime(volume, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
    
    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + duration);
  } catch (e) {
    console.warn('Audio not available:', e);
  }
}

export function playJumpSound() {
  playTone(300, 0.15, 'square', 0.08);
  setTimeout(() => playTone(450, 0.15, 'square', 0.06), 50);
}

export function playCoinSound() {
  playTone(900, 0.1, 'sine', 0.1);
  setTimeout(() => playTone(1200, 0.15, 'sine', 0.08), 80);
}

export function playDamageSound() {
  playTone(150, 0.3, 'sawtooth', 0.1);
  setTimeout(() => playTone(100, 0.2, 'sawtooth', 0.08), 100);
}

export function playShootSound() {
  playTone(600, 0.08, 'square', 0.05);
}

export function playWinSound() {
  const notes = [400, 500, 600, 800];
  notes.forEach((note, i) => {
    setTimeout(() => playTone(note, 0.2, 'square', 0.08), i * 120);
  });
}

export function playGameOverSound() {
  playTone(300, 0.3, 'sawtooth', 0.1);
  setTimeout(() => playTone(250, 0.3, 'sawtooth', 0.1), 200);
  setTimeout(() => playTone(200, 0.5, 'sawtooth', 0.1), 400);
}

export function playEnemyDeathSound() {
  playTone(200, 0.15, 'square', 0.08);
  setTimeout(() => playTone(150, 0.1, 'square', 0.06), 50);
}

export function playPowerupSound() {
  playTone(500, 0.1, 'sine', 0.1);
  setTimeout(() => playTone(700, 0.1, 'sine', 0.1), 80);
  setTimeout(() => playTone(900, 0.15, 'sine', 0.1), 160);
}
