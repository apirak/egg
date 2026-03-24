import { describe, expect, it } from "vitest";
import {
  DEFAULT_EGG_MATH,
  eggPointsToPath,
  generateEggPoints,
  getEggDimensions,
} from "../../../src/game/geometry/EggGeometryMath";

describe("EggGeometryMath", () => {
  it("returns one more point than the segment count to close the loop", () => {
    const points = generateEggPoints(DEFAULT_EGG_MATH, 12);

    expect(points).toHaveLength(13);
  });

  it("generates only finite coordinates", () => {
    const points = generateEggPoints(DEFAULT_EGG_MATH, 24);

    expect(points.every((point) => Number.isFinite(point.x))).toBe(true);
    expect(points.every((point) => Number.isFinite(point.y))).toBe(true);
  });

  it("keeps horizontal bounds approximately symmetric", () => {
    const points = generateEggPoints(DEFAULT_EGG_MATH, 240);
    const xs = points.map((point) => point.x);
    const minX = Math.min(...xs);
    const maxX = Math.max(...xs);

    expect(Math.abs(maxX)).toBeCloseTo(Math.abs(minX), 5);
  });

  it("returns positive dimensions and a closed path string", () => {
    const dimensions = getEggDimensions(DEFAULT_EGG_MATH);
    const path = eggPointsToPath(generateEggPoints(DEFAULT_EGG_MATH, 8));

    expect(dimensions.width).toBeGreaterThan(0);
    expect(dimensions.height).toBeGreaterThan(0);
    expect(path.startsWith("M ")).toBe(true);
    expect(path.endsWith("Z")).toBe(true);
  });
});
