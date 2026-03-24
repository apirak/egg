// Egg factory for creating eggs with proper physics and geometry

import Matter from 'matter-js';
import { EggColor, EggLevel, EggState } from '../../types/game';
import { Egg } from './Egg';
import { EggGeometry } from '../rendering/EggGeometry';
import { getEggSize, EGG_BASE_SIZE, PHYSICS_CONFIG } from '../config';

export class EggFactory {
  /**
   * Create an egg with compound body (two overlapping circles)
   */
  createEgg(
    color: EggColor,
    level: EggLevel,
    position: { x: number; y: number },
    state: EggState = EggState.FALLING
  ): Egg {
    const size = getEggSize(level, EGG_BASE_SIZE);
    const circles = EggGeometry.calculateEggCircles(size);

    // Create two circles for compound body
    const circleLarge = Matter.Bodies.circle(
      position.x + circles.large.x,
      position.y + circles.large.y,
      circles.large.radius,
      {
        friction: PHYSICS_CONFIG.friction,
        frictionStatic: PHYSICS_CONFIG.frictionStatic,
        restitution: PHYSICS_CONFIG.restitution,
        density: PHYSICS_CONFIG.density
      }
    );

    const circleSmall = Matter.Bodies.circle(
      position.x + circles.small.x,
      position.y + circles.small.y,
      circles.small.radius,
      {
        friction: PHYSICS_CONFIG.friction,
        frictionStatic: PHYSICS_CONFIG.frictionStatic,
        restitution: PHYSICS_CONFIG.restitution,
        density: PHYSICS_CONFIG.density
      }
    );

    // Create compound body
    const compoundBody = Matter.Body.create({
      position,
      parts: [circleLarge, circleSmall],
      friction: PHYSICS_CONFIG.friction,
      frictionStatic: PHYSICS_CONFIG.frictionStatic,
      restitution: PHYSICS_CONFIG.restitution,
      density: PHYSICS_CONFIG.density
    });

    return new Egg(compoundBody, color, level, state);
  }

  /**
   * Create merged egg from two parent eggs
   */
  createMergedEgg(
    egg1: Egg,
    egg2: Egg,
    nextLevel: EggLevel
  ): Egg {
    // Calculate position (midpoint between parents)
    const pos1 = egg1.getPosition();
    const pos2 = egg2.getPosition();
    const position = {
      x: (pos1.x + pos2.x) / 2,
      y: (pos1.y + pos2.y) / 2
    };

    // Add slight upward velocity to separate from stack
    const body = this.createEgg(egg1.color, nextLevel, position).body;
    Matter.Body.setVelocity(body, { x: 0, y: -2 });

    return new Egg(body, egg1.color, nextLevel, EggState.FALLING);
  }

  /**
   * Create random L1 egg
   */
  createRandomL1Egg(position: { x: number; y: number }): Egg {
    const colors: EggColor[] = [EggColor.RED, EggColor.BLUE, EggColor.GREEN];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    return this.createEgg(randomColor, 1, position);
  }

  /**
   * Create egg specifically for spawn queue
   */
  createSpawnEgg(x: number, y: number): Egg {
    return this.createRandomL1Egg({ x, y });
  }

  /**
   * Get spawn position for new egg
   */
  getSpawnPosition(containerWidth: number, spawnY: number): { x: number; y: number } {
    return {
      x: containerWidth / 2,
      y: spawnY
    };
  }
}

// Singleton instance
let eggFactoryInstance: EggFactory | null = null;

export const getEggFactory = (): EggFactory => {
  if (!eggFactoryInstance) {
    eggFactoryInstance = new EggFactory();
  }
  return eggFactoryInstance;
};
