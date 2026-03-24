// Egg type definitions and constants

import { EggColor, EggLevel, EggState, EggLevelName } from '../../types/game';

export interface EggTypeConfig {
  color: EggColor;
  level: EggLevel;
  levelName: EggLevelName;
  size: number;
}

export const EGG_COLORS: EggColor[] = [EggColor.RED, EggColor.BLUE, EggColor.GREEN];

export const EGG_LEVELS: EggLevel[] = [1, 2, 3, 4, 5];

export const EGG_LEVEL_NAMES: Record<EggLevel, EggLevelName> = {
  1: 'General',
  2: 'Dot',
  3: 'Wristband',
  4: 'Flash',
  5: 'Golden'
};

export const getRandomColor = (): EggColor => {
  return EGG_COLORS[Math.floor(Math.random() * EGG_COLORS.length)];
};

export const getEggTypeKey = (color: EggColor, level: EggLevel): string => {
  return `${color}-${level}`;
};

export const parseEggTypeKey = (key: string): { color: EggColor; level: EggLevel } | null => {
  const parts = key.split('-');
  if (parts.length !== 2) return null;

  const color = parts[0] as EggColor;
  const level = parseInt(parts[1]) as EggLevel;

  if (!EGG_COLORS.includes(color)) return null;
  if (!EGG_LEVELS.includes(level)) return null;

  return { color, level };
};
