// Game type definitions

export enum EggColor {
  RED = 'RED',
  BLUE = 'BLUE',
  GREEN = 'GREEN'
}

export enum EggLevel {
  ONE = 1,   // General
  TWO = 2,   // Dot
  THREE = 3, // Wristband
  FOUR = 4,  // Flash
  FIVE = 5   // Golden
}

export enum EggState {
  FALLING = 'falling',
  SETTLED = 'settled',
  ASCENDING = 'ascending'
}

export type EggLevelName = 'General' | 'Dot' | 'Wristband' | 'Flash' | 'Golden';

export interface EggConfig {
  level: EggLevel;
  levelName: EggLevelName;
  sizeMultiplier: number;
}

export interface EggData {
  color: EggColor;
  level: EggLevel;
  state: EggState;
  id: string;
}

export interface CollectedAngles {
  [EggColor.RED]: number;
  [EggColor.BLUE]: number;
  [EggColor.GREEN]: number;
}

export interface GameState {
  isPlaying: boolean;
  isGameOver: boolean;
  score: number;
  collectedAngles: CollectedAngles;
  eggs: Set<string>;
}

export interface GameConfig {
  containerWidth: number;
  containerHeight: number;
  wallThickness: number;
  spawnX: number;
  spawnY: number;
  gameOverHeight: number;
  gameOverThreshold: number; // seconds
}

export interface LevelProgression {
  [key: number]: EggLevelName;
}
