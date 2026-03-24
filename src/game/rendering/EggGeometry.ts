// Egg geometry calculations using Bezier curves

import { EggColor, EggLevel } from '../../types/game';
import { COLOR_PALETTE } from '../config';

export interface Circle {
  x: number;
  y: number;
  radius: number;
}

export interface TangentPoints {
  left1: { x: number; y: number };
  left2: { x: number; y: number };
  right1: { x: number; y: number };
  right2: { x: number; y: number };
}

export class EggGeometry {
  /**
   * Calculate the two circles that form the egg shape
   */
  static calculateEggCircles(size: number): { large: Circle; small: Circle } {
    return {
      large: {
        x: 0,
        y: size * 0.2,
        radius: size * 0.5
      },
      small: {
        x: 0,
        y: -size * 0.3,
        radius: size * 0.35
      }
    };
  }

  /**
   * Calculate tangent points between two circles
   */
  static calculateTangentPoints(circle1: Circle, circle2: Circle): TangentPoints {
    const dx = circle2.x - circle1.x;
    const dy = circle2.y - circle1.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    // Angle from circle1 to circle2
    const angle = Math.atan2(dy, dx);

    // Calculate tangent angles
    const r1 = circle1.radius;
    const r2 = circle2.radius;
    const angleOffset = Math.asin((r2 - r1) / distance);

    // Left side tangents
    const leftAngle1 = angle - Math.PI / 2 + angleOffset;
    const leftAngle2 = angle - Math.PI / 2 + angleOffset;

    // Right side tangents
    const rightAngle1 = angle + Math.PI / 2 - angleOffset;
    const rightAngle2 = angle + Math.PI / 2 - angleOffset;

    return {
      left1: {
        x: circle1.x + Math.cos(leftAngle1) * r1,
        y: circle1.y + Math.sin(leftAngle1) * r1
      },
      left2: {
        x: circle2.x + Math.cos(leftAngle2) * r2,
        y: circle2.y + Math.sin(leftAngle2) * r2
      },
      right1: {
        x: circle1.x + Math.cos(rightAngle1) * r1,
        y: circle1.y + Math.sin(rightAngle1) * r1
      },
      right2: {
        x: circle2.x + Math.cos(rightAngle2) * r2,
        y: circle2.y + Math.sin(rightAngle2) * r2
      }
    };
  }

  /**
   * Draw an egg shape using Bezier curves
   */
  static drawEggShape(
    ctx: CanvasRenderingContext2D,
    size: number,
    color: EggColor,
    level: EggLevel
  ): void {
    const circles = this.calculateEggCircles(size);
    const tangents = this.calculateTangentPoints(circles.large, circles.small);

    const palette = COLOR_PALETTE[color];

    ctx.beginPath();
    ctx.moveTo(tangents.left1.x, tangents.left1.y);

    // Left Bezier curve
    ctx.bezierCurveTo(
      tangents.left1.x - circles.large.radius * 0.5,
      tangents.left1.y,
      tangents.left2.x - circles.small.radius * 0.3,
      tangents.left2.y,
      tangents.left2.x,
      tangents.left2.y
    );

    // Top arc (small circle)
    ctx.arc(circles.small.x, circles.small.y, circles.small.radius,
      Math.atan2(tangents.left2.y - circles.small.y, tangents.left2.x - circles.small.x),
      Math.atan2(tangents.right2.y - circles.small.y, tangents.right2.x - circles.small.x),
      false
    );

    // Right Bezier curve
    ctx.bezierCurveTo(
      tangents.right2.x + circles.small.radius * 0.3,
      tangents.right2.y,
      tangents.right1.x + circles.large.radius * 0.5,
      tangents.right1.y,
      tangents.right1.x,
      tangents.right1.y
    );

    // Bottom arc (large circle)
    ctx.arc(circles.large.x, circles.large.y, circles.large.radius,
      Math.atan2(tangents.right1.y - circles.large.y, tangents.right1.x - circles.large.x),
      Math.atan2(tangents.left1.y - circles.large.y, tangents.left1.x - circles.large.x),
      false
    );

    ctx.closePath();

    // Fill with color
    ctx.fillStyle = palette.primary;
    ctx.fill();

    // Add subtle gradient for 3D effect
    const gradient = ctx.createRadialGradient(
      -size * 0.2, -size * 0.2, 0,
      0, 0, size
    );
    gradient.addColorStop(0, 'rgba(255, 255, 255, 0.3)');
    gradient.addColorStop(1, 'rgba(0, 0, 0, 0.1)');
    ctx.fillStyle = gradient;
    ctx.fill();

    // Stroke
    ctx.strokeStyle = palette.stroke;
    ctx.lineWidth = 2;
    ctx.stroke();

    // Add level indicator (dot pattern)
    this.drawLevelIndicator(ctx, size, level);
  }

  /**
   * Draw visual indicator for egg level
   */
  static drawLevelIndicator(
    ctx: CanvasRenderingContext2D,
    size: number,
    level: EggLevel
  ): void {
    const dotSize = size * 0.1;
    const centerX = 0;
    const centerY = size * 0.1;

    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';

    for (let i = 0; i < level; i++) {
      const angle = (i / level) * Math.PI * 2 - Math.PI / 2;
      const x = centerX + Math.cos(angle) * size * 0.2;
      const y = centerY + Math.sin(angle) * size * 0.2;

      ctx.beginPath();
      ctx.arc(x, y, dotSize, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  /**
   * Get the bounding box for an egg of given size
   */
  static getEggBounds(size: number): { width: number; height: number } {
    return {
      width: size * 1.2,
      height: size * 1.6
    };
  }
}
