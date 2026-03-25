import { Bodies, Composite, Engine, World, Sleeping, Body } from "matter-js";
import type { EggEntity } from "../entities/EggFactory";
import { GAME_CONFIG } from "../config/GameConfig";

export class PhysicsWorld {
  private engine: Engine;
  private width: number;
  private height: number;
  private walls: Body[] = [];
  private eggs: EggEntity[] = [];
  private currentGravity: { x: number; y: number };

  constructor(
    width: number = GAME_CONFIG.width,
    height: number = GAME_CONFIG.height,
  ) {
    this.width = width;
    this.height = height;

    this.currentGravity = { x: 0, y: GAME_CONFIG.gravityY };
    this.engine = Engine.create({
      gravity: { x: 0, y: GAME_CONFIG.gravityY },
      enableSleeping: true,
      positionIterations: 14,
      velocityIterations: 10,
      constraintIterations: 6,
    });
    this.buildWalls();
  }

  setGravity(x: number, y: number): void {
    this.currentGravity = { x, y };
    this.engine.world.gravity.x = x;
    this.engine.world.gravity.y = y;

    // Wake up all sleeping eggs when gravity changes
    for (const egg of this.eggs) {
      if (egg.body.isSleeping) {
        Sleeping.set(egg.body, false);
      }
    }
  }

  getGravity(): { x: number; y: number } {
    return this.currentGravity;
  }

  resetGravity(): void {
    this.setGravity(0, GAME_CONFIG.gravityY);
  }

  resize(width: number, height: number): void {
    this.width = width;
    this.height = height;
    this.rebuildWalls();
  }

  addEgg(egg: EggEntity): void {
    this.eggs.push(egg);
    World.add(this.engine.world, egg.body);
  }

  removeEgg(egg: EggEntity): void {
    this.eggs = this.eggs.filter((item) => item.id !== egg.id);
    World.remove(this.engine.world, egg.body);
  }

  removeEggs(eggs: EggEntity[]): void {
    for (const egg of eggs) {
      this.removeEgg(egg);
    }
  }

  getEggs(): EggEntity[] {
    return this.eggs;
  }

  step(deltaMs: number = GAME_CONFIG.fixedDeltaMs): void {
    Engine.update(this.engine, deltaMs);
  }

  destroy(): void {
    this.eggs = [];
    Composite.clear(this.engine.world, false);
    Engine.clear(this.engine);
  }

  private buildWalls(): void {
    const t = GAME_CONFIG.wallThickness;
    const halfT = t / 2;
    const left = Bodies.rectangle(-halfT, this.height / 2, t, this.height * 2, {
      isStatic: true,
      label: "wall",
    });
    const right = Bodies.rectangle(
      this.width + halfT,
      this.height / 2,
      t,
      this.height * 2,
      { isStatic: true, label: "wall" },
    );
    const bottom = Bodies.rectangle(
      this.width / 2,
      this.height + halfT,
      this.width + t * 2,
      t,
      { isStatic: true, label: "wall" },
    );
    const top = Bodies.rectangle(
      this.width / 2,
      -halfT,
      this.width + t * 2,
      t,
      { isStatic: true, label: "wall" },
    );

    this.walls = [left, right, bottom, top];
    World.add(this.engine.world, this.walls);
  }

  private rebuildWalls(): void {
    if (this.walls.length > 0) {
      World.remove(this.engine.world, this.walls);
    }
    this.buildWalls();
  }
}
