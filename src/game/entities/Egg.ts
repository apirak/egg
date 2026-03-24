// Egg entity class combining physics body with game data

import Matter from 'matter-js';
import { EggColor, EggLevel, EggState } from '../../types/game';
import { EggBody } from '../../types/physics';

let idCounter = 0;

export class Egg {
  public readonly id: string;
  public readonly body: Matter.Body;
  public readonly color: EggColor;
  public readonly level: EggLevel;
  public state: EggState;
  public markedForRemoval: boolean = false;

  constructor(
    body: Matter.Body,
    color: EggColor,
    level: EggLevel,
    state: EggState = EggState.FALLING
  ) {
    this.id = `egg-${++idCounter}-${Date.now()}`;
    this.body = body;
    this.color = color;
    this.level = level;
    this.state = state;

    // Link body to egg for collision detection
    (this.body as EggBody).isEgg = true;
    (this.body as EggBody).eggId = this.id;
    (this.body as EggBody).eggColor = color;
    (this.body as EggBody).eggLevel = level;
  }

  /**
   * Get current position
   */
  getPosition(): { x: number; y: number } {
    return { ...this.body.position };
  }

  /**
   * Get current rotation angle
   */
  getRotation(): number {
    return this.body.angle;
  }

  /**
   * Get velocity
   */
  getVelocity(): { x: number; y: number } {
    return { ...this.body.velocity };
  }

  /**
   * Check if egg is at rest (low velocity)
   */
  isAtRest(threshold: number = 0.1): boolean {
    const speed = Math.sqrt(
      this.body.velocity.x ** 2 + this.body.velocity.y ** 2
    );
    const angularSpeed = Math.abs(this.body.angularVelocity);
    return speed < threshold && angularSpeed < threshold;
  }

  /**
   * Mark egg for removal from game
   */
  markForRemoval(): void {
    this.markedForRemoval = true;
  }

  /**
   * Set egg state
   */
  setState(state: EggState): void {
    this.state = state;
  }

  /**
   * Get size based on level
   */
  getSize(baseSize: number): number {
    const multipliers = { 1: 1.0, 2: 1.2, 3: 1.44, 4: 1.728, 5: 2.0736 };
    return baseSize * multipliers[this.level as keyof typeof multipliers];
  }

  /**
   * Create a copy of this egg with new properties
   */
  static createFromEgg(
    egg: Egg,
    newLevel?: EggLevel,
    newPosition?: { x: number; y: number }
  ): Egg {
    const level = newLevel ?? egg.level;
    const position = newPosition ?? egg.getPosition();

    // Create new body at same position
    const newBody = Matter.Body.create({
      position,
      ...egg.body.body
    });

    return new Egg(newBody, egg.color, level, egg.state);
  }

  /**
   * Get string representation
   */
  toString(): string {
    return `Egg(${this.id}, ${this.color}, L${this.level}, ${this.state})`;
  }

  /**
   * Reset static ID counter (for testing)
   */
  static resetIdCounter(): void {
    idCounter = 0;
  }
}
