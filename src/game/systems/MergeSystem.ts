// Collision detection and merge logic system

import Matter from 'matter-js';
import { Egg } from '../entities/Egg';
import { EggColor } from '../../types/game';
import { getNextLevel, isAscensionLevel } from '../config';
import { MergeEvent } from '../../types/physics';

export interface MergeResult {
  merged: boolean;
  newEgg: Egg | null;
  ascension: boolean;
  removedEggs: string[];
}

export class MergeSystem {
  private mergeCooldowns: Map<string, number> = new Map();
  private readonly cooldownMs: number;

  constructor(cooldownMs: number = 500) {
    this.cooldownMs = cooldownMs;
  }

  /**
   * Handle collision events from Matter.js
   */
  handleCollisions(event: Matter.IEventCollision<Matter.Engine>): MergeEvent[] {
    const mergeEvents: MergeEvent[] = [];

    for (const pair of event.pairs) {
      const bodyA = pair.bodyA;
      const bodyB = pair.bodyB;

      // Check if both bodies are eggs
      if (!this.isEggBody(bodyA) || !this.isEggBody(bodyB)) continue;

      const eggA = this.getEggFromBody(bodyA);
      const eggB = this.getEggFromBody(bodyB);

      if (!eggA || !eggB) continue;

      // Check merge conditions: SAME color AND SAME level
      if (eggA.color !== eggB.color || eggA.level !== eggB.level) continue;

      // Check cooldown
      if (this.isOnCooldown(eggA.id) || this.isOnCooldown(eggB.id)) continue;

      // Create merge event
      const mergeEvent: MergeEvent = {
        egg1Id: eggA.id,
        egg2Id: eggB.id,
        color: eggA.color,
        level: eggA.level,
        position: {
          x: (eggA.getPosition().x + eggB.getPosition().x) / 2,
          y: (eggA.getPosition().y + eggB.getPosition().y) / 2
        }
      };

      mergeEvents.push(mergeEvent);

      // Set cooldown
      this.setCooldown(eggA.id);
      this.setCooldown(eggB.id);
    }

    return mergeEvents;
  }

  /**
   * Process a merge event and return result
   */
  processMerge(event: MergeEvent, eggMap: Map<string, Egg>): MergeResult {
    const egg1 = eggMap.get(event.egg1Id);
    const egg2 = eggMap.get(event.egg2Id);

    if (!egg1 || !egg2) {
      return { merged: false, newEgg: null, ascension: false, removedEggs: [] };
    }

    // Check for ascension (Level 5 + Level 5)
    if (isAscensionLevel(event.level)) {
      return {
        merged: true,
        newEgg: null,
        ascension: true,
        removedEggs: [egg1.id, egg2.id]
      };
    }

    // Get next level
    const nextLevel = getNextLevel(event.level);
    if (nextLevel === null) {
      return { merged: false, newEgg: null, ascension: false, removedEggs: [] };
    }

    // Create merged egg
    const newEgg = this.createMergedEgg(egg1, egg2, nextLevel);

    return {
      merged: true,
      newEgg,
      ascension: false,
      removedEggs: [egg1.id, egg2.id]
    };
  }

  /**
   * Create merged egg from two eggs
   */
  private createMergedEgg(egg1: Egg, egg2: Egg, nextLevel: number): Egg {
    const pos1 = egg1.getPosition();
    const pos2 = egg2.getPosition();
    const position = {
      x: (pos1.x + pos2.x) / 2,
      y: (pos1.y + pos2.y) / 2
    };

    // Import here to avoid circular dependency
    const { EggFactory } = require('../entities/EggFactory');
    const factory = new EggFactory();

    const mergedEgg = factory.createEgg(
      egg1.color,
      nextLevel as any,
      position,
      egg1.state
    );

    // Add upward velocity
    Matter.Body.setVelocity(mergedEgg.body, { x: 0, y: -2 });

    return mergedEgg;
  }

  /**
   * Check if body is an egg
   */
  private isEggBody(body: Matter.Body): boolean {
    return 'isEgg' in body && (body as any).isEgg === true;
  }

  /**
   * Get egg from body (would need reference in real implementation)
   */
  private getEggFromBody(body: Matter.Body): Egg | null {
    // This would be implemented by looking up in game engine's egg map
    return null;
  }

  /**
   * Check if egg is on cooldown
   */
  private isOnCooldown(eggId: string): boolean {
    const cooldownEnd = this.mergeCooldowns.get(eggId);
    if (!cooldownEnd) return false;
    return Date.now() < cooldownEnd;
  }

  /**
   * Set cooldown for egg
   */
  private setCooldown(eggId: string): void {
    this.mergeCooldowns.set(eggId, Date.now() + this.cooldownMs);
  }

  /**
   * Clean up expired cooldowns
   */
  cleanupCooldowns(): void {
    const now = Date.now();
    for (const [id, end] of this.mergeCooldowns.entries()) {
      if (now >= end) {
        this.mergeCooldowns.delete(id);
      }
    }
  }

  /**
   * Reset all cooldowns
   */
  reset(): void {
    this.mergeCooldowns.clear();
  }
}
