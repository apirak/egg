// Game configuration constants

import { GameConfig } from '../../types/game';

export const GAME_CONFIG: GameConfig = {
  containerWidth: 400,
  containerHeight: 600,
  wallThickness: 20,
  spawnX: 200,
  spawnY: 50,
  gameOverHeight: 100,
  gameOverThreshold: 2000 // 2 seconds in ms
};

export const COLOR_PALETTE = {
  [`${'RED'}`]: { primary: '#E74C3C', stroke: '#C0392B' },
  [`${'BLUE'}`]: { primary: '#3498DB', stroke: '#2980B9' },
  [`${'GREEN'}`]: { primary: '#2ECC71', stroke: '#27AE60' }
};

export const PHYSICS_CONFIG = {
  gravity: 1,
  restitution: 0.3, // Bounciness
  friction: 0.5,
  frictionStatic: 0.8,
  density: 0.001
};

export const EGG_BASE_SIZE = 40; // Base radius for level 1 eggs

export const MERGE_COOLDOWN = 500; // ms between merges

export const DROP_COOLDOWN = 300; // ms between drops

export const HOLD_DROP_INTERVAL = 200; // ms for auto-drop while holding

export const TAP_THRESHOLD = 300; // ms to distinguish tap from hold

export const ASCENSION_DURATION = 1000; // ms for ascension animation
