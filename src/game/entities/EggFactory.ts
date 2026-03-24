import { Bodies, Body } from "matter-js";
import type { EggColor, EggLevel, EggSprite } from "../../types/egg";
import { getSpriteGenerator } from "../rendering/SpriteGenerator";
import { EGG_COLORS, getGameplayEggSize } from "../config/EggConfig";

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

    const body = this.createEggBody(x, y, displayWidth, displayHeight);
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

  private createEggBody(
    x: number,
    y: number,
    width: number,
    height: number,
  ): Body {
    const largeRadius = Math.max(5, Math.round(width * 0.28));
    const smallRadius = Math.max(4, Math.round(width * 0.2));
    const verticalOffset = Math.max(5, Math.round(height * 0.22));

    const largeCircle = Bodies.circle(
      x,
      y + verticalOffset * 0.25,
      largeRadius,
    );
    const smallCircle = Bodies.circle(x, y - verticalOffset * 0.5, smallRadius);

    return Body.create({
      parts: [largeCircle, smallCircle],
      restitution: 0.18,
      friction: 0.35,
      frictionAir: 0.012,
      density: 0.0014,
    });
  }

  private randomColor(): EggColor {
    const colors = EGG_COLORS;
    return colors[Math.floor(Math.random() * colors.length)];
  }
}
