// Level progression configuration

import { EggConfig, EggLevelName, LevelProgression } from '../../types/game';

export const LEVEL_CONFIG: Record<number, EggConfig> = {
  1: {
    level: 1,
    levelName: 'General',
    sizeMultiplier: 1.0
  },
  2: {
    level: 2,
    levelName: 'Dot',
    sizeMultiplier: 1.2
  },
  3: {
    level: 3,
    levelName: 'Wristband',
    sizeMultiplier: 1.44 // 1.2 * 1.2
  },
  4: {
    level: 4,
    levelName: 'Flash',
    sizeMultiplier: 1.728 // 1.2^3
  },
  5: {
    level: 5,
    levelName: 'Golden',
    sizeMultiplier: 2.0736 // 1.2^4
  }
};

export const LEVEL_PROGRESSION: LevelProgression = {
  1: 'General',
  2: 'Dot',
  3: 'Wristband',
  4: 'Flash',
  5: 'Golden'
};

export const getNextLevel = (currentLevel: number): number | null => {
  if (currentLevel < 5) return currentLevel + 1;
  return null; // Level 5 merges into ascension
};

export const getEggSize = (level: number, baseSize: number): number => {
  const config = LEVEL_CONFIG[level];
  return baseSize * config.sizeMultiplier;
};

export const isAscensionLevel = (level: number): boolean => {
  return level === 5;
};
