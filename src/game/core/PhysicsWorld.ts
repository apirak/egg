import { Bodies, Composite, Engine, Runner, World } from "matter-js";
import type { Body } from "matter-js";
import type { EggEntity } from "../entities/EggFactory";
import { GAME_CONFIG } from "../config/GameConfig";

export class PhysicsWorld {
  private engine: Engine;
  private runner: Runner;
  private width: number;
  private height: number;
  private walls: Body[] = [];
  private eggs: EggEntity[] = [];

  constructor(
    width: number = GAME_CONFIG.width,
    height: number = GAME_CONFIG.height,
  ) {
    this.width = width;
    this.height = height;

    this.engine = Engine.create({
      gravity: { x: 0, y: GAME_CONFIG.gravityY },
    });
    this.runner = Runner.create();
    this.buildWalls();
  }

  start(): void {
    Runner.run(this.runner, this.engine);
  }

  stop(): void {
    Runner.stop(this.runner);
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

  getEggs(): EggEntity[] {
    return this.eggs;
  }

  step(deltaMs: number = GAME_CONFIG.fixedDeltaMs): void {
    Engine.update(this.engine, deltaMs);
  }

  destroy(): void {
    this.stop();
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

    this.walls = [left, right, bottom];
    World.add(this.engine.world, this.walls);
  }

  private rebuildWalls(): void {
    if (this.walls.length > 0) {
      World.remove(this.engine.world, this.walls);
    }
    this.buildWalls();
  }
}
