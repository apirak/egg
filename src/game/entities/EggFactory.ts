import { Bodies, Body } from "matter-js";
import type { EggColor, EggLevel, EggSprite } from "../../types/egg";
import { getSpriteGenerator } from "../rendering/SpriteGenerator";
import {
  EGG_COLORS,
  pickWeightedEggColor,
  EGG_SIZE_MULTIPLIERS,
  EGG_SPRITE_RENDER_SCALE,
  GAMEPLAY_EGG_SIZE_RATIO,
  getGameplayEggSize,
} from "../config/EggConfig";
import {
  DEFAULT_EGG_MATH,
  generateEggPoints,
} from "../geometry/EggGeometryMath";

export interface EggEntity {
  id: string;
  color: EggColor;
  level: EggLevel;
  body: Body;
  sprite: EggSprite;
  displayWidth: number;
  displayHeight: number;
}

let eggIdCounter = 0;

export class EggFactory {
  createEgg(
    x: number,
    y: number,
    level: EggLevel = 1,
    color?: EggColor,
  ): EggEntity {
    const eggColor = color ?? this.randomColor();
    const sprite = getSpriteGenerator().getSpriteForColor(eggColor, level);
    const displayWidth = getGameplayEggSize(sprite.width);
    const displayHeight = getGameplayEggSize(sprite.height);

    const body = this.createEggBody(x, y, level);
    body.label = "egg";

    return {
      id: `egg-${eggIdCounter++}`,
      color: eggColor,
      level,
      body,
      sprite,
      displayWidth,
      displayHeight,
    };
  }

  private createEggBody(x: number, y: number, level: EggLevel): Body {
    const scale = EGG_SPRITE_RENDER_SCALE * GAMEPLAY_EGG_SIZE_RATIO;
    const levelScale = EGG_SIZE_MULTIPLIERS[level] ?? 1;
    const points = generateEggPoints(
      {
        ...DEFAULT_EGG_MATH,
        a: DEFAULT_EGG_MATH.a * levelScale,
        b: DEFAULT_EGG_MATH.b * levelScale,
      },
      28,
    );
    const vertices = points.map((point) => ({
      x: point.x * scale,
      y: point.y * scale,
    }));

    return Bodies.fromVertices(x, y, [vertices], {
      restitution: 0.08,
      friction: 0.55,
      frictionStatic: 1.4,
      frictionAir: 0.04,
      density: 0.0014,
      slop: 0.01,
      sleepThreshold: 45,
    });
  }

  private randomColor(): EggColor {
    return pickWeightedEggColor();
  }
}
