// Matter.js Physics World wrapper

import Matter from 'matter-js';
import { PhysicsWorldConfig, EggBody } from '../../types/physics';
import { PHYSICS_CONFIG } from '../config';

export class PhysicsWorld {
  public engine: Matter.Engine;
  public world: Matter.World;
  public runner: Matter.Runner;
  private render: Matter.Render | null = null;

  constructor(config: PhysicsWorldConfig) {
    // Create engine
    this.engine = Matter.Engine.create({
      gravity: { x: 0, y: PHYSICS_CONFIG.gravity }
    });

    this.world = this.engine.world;

    // Enable sleeping for performance
    this.engine.enableSleeping = true;

    // Set up boundaries
    this.setBoundaries(config);

    // Create runner
    this.runner = Matter.Runner.create();
  }

  private setBoundaries(config: PhysicsWorldConfig): void {
    const { width, height, wallThickness } = config;

    // Create ground
    const ground = Matter.Bodies.rectangle(
      width / 2,
      height + wallThickness / 2,
      width,
      wallThickness,
      { isStatic: true, render: { fillStyle: '#2c3e50' } }
    );

    // Create left wall
    const leftWall = Matter.Bodies.rectangle(
      -wallThickness / 2,
      height / 2,
      wallThickness,
      height,
      { isStatic: true, render: { fillStyle: '#2c3e50' } }
    );

    // Create right wall
    const rightWall = Matter.Bodies.rectangle(
      width + wallThickness / 2,
      height / 2,
      wallThickness,
      height,
      { isStatic: true, render: { fillStyle: '#2c3e50' } }
    );

    Matter.Composite.add(this.world, [ground, leftWall, rightWall]);
  }

  addBody(body: Matter.Body): void {
    Matter.Composite.add(this.world, body);
  }

  removeBody(body: Matter.Body): void {
    Matter.Composite.remove(this.world, body);
  }

  start(): void {
    Matter.Runner.run(this.runner, this.engine);
  }

  stop(): void {
    Matter.Runner.stop(this.runner);
  }

  update(deltaTime: number): void {
    Matter.Engine.update(this.engine, deltaTime);
  }

  getBodies(): Matter.Body[] {
    return Matter.Composite.allBodies(this.world);
  }

  getBodiesInBounds(bounds: { min: { x: number; y: number }; max: { x: number; y: number } }): Matter.Body[] {
    return Matter.Query.region(this.getBodies(), bounds);
  }

  cleanup(): void {
    this.stop();
    Matter.Engine.clear(this.engine);
    if (this.render) {
      Matter.Render.stop(this.render);
      this.render.canvas.remove();
      this.render.canvas = null!;
      this.render.context = null!;
      this.render.textures = {};
    }
  }
}
