// Physics-related type definitions

import { Body, Engine } from 'matter-js';

export interface PhysicsWorldConfig {
  width: number;
  height: number;
  wallThickness: number;
  gravity?: number;
}

export interface EggBody extends Body {
  isEgg: true;
  eggId: string;
  eggColor: string;
  eggLevel: number;
}

export interface CollisionPair {
  bodyA: Body;
  bodyB: Body;
}

export interface MergeEvent {
  egg1Id: string;
  egg2Id: string;
  color: string;
  level: number;
  position: { x: number; y: number };
}

export interface AscensionEvent {
  eggId: string;
  color: string;
  startPosition: { x: number; y: number };
  targetPosition: { x: number; y: number };
}
