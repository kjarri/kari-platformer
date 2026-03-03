const SAVE_KEY = 'hoppa_save_data';

const defaultSaveData = {
  highestLevel: 1,
  totalCoins: 0,
  highScore: 0,
  soundEnabled: true,
  lastPlayed: null
};

let saveData = { ...defaultSaveData };

export function loadGame() {
  try {
    const saved = localStorage.getItem(SAVE_KEY);
    if (saved) {
      saveData = { ...defaultSaveData, ...JSON.parse(saved) };
    }
  } catch (e) {
    console.warn('Failed to load save data:', e);
  }
  return saveData;
}

export function saveGame() {
  try {
    saveData.lastPlayed = new Date().toISOString();
    localStorage.setItem(SAVE_KEY, JSON.stringify(saveData));
  } catch (e) {
    console.warn('Failed to save game:', e);
  }
}

export function getSaveData() {
  return saveData;
}

export function updateHighestLevel(level) {
  if (level > saveData.highestLevel) {
    saveData.highestLevel = level;
    saveGame();
  }
}

export function addCoins(amount) {
  saveData.totalCoins += amount;
  saveGame();
}

export function updateHighScore(newScore) {
  if (newScore > saveData.highScore) {
    saveData.highScore = newScore;
    saveGame();
  }
}

export function setSoundEnabled(enabled) {
  saveData.soundEnabled = enabled;
  saveGame();
}

export function isSoundEnabled() {
  return saveData.soundEnabled;
}

export function getHighestLevel() {
  return saveData.highestLevel;
}

export function hasSaveData() {
  return saveData.highestLevel > 1 || saveData.totalCoins > 0 || saveData.highScore > 0;
}

export function clearSaveData() {
  saveData = { ...defaultSaveData };
  try {
    localStorage.removeItem(SAVE_KEY);
  } catch (e) {
    console.warn('Failed to clear save data:', e);
  }
}
