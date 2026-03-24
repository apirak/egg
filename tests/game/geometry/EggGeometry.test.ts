import { describe, expect, it } from "vitest";
import {
  DEFAULT_EGG_GEOMETRY,
  EggGeometry,
} from "../../../src/game/geometry/EggGeometry";

describe("EggGeometry", () => {
  it("reports positive dimensions for the default egg", () => {
    const geometry = new EggGeometry();

    expect(geometry.getEggWidth()).toBe(40);
    expect(geometry.getEggHeight()).toBe(46);
  });

  it("returns a stable center offset and circle centers", () => {
    const geometry = new EggGeometry(DEFAULT_EGG_GEOMETRY);
    const centers = geometry.getCircleCenters();

    expect(geometry.getCenterOffset()).toBe(3);
    expect(centers.large).toEqual({ x: 0, y: 0 });
    expect(centers.small).toEqual({ x: 0, y: -12 });
  });

  it("calculates finite tangent points in mirrored pairs", () => {
    const geometry = new EggGeometry();
    const tangents = geometry.calculateTangentPoints();

    expect(Number.isFinite(tangents.leftLarge.x)).toBe(true);
    expect(Number.isFinite(tangents.leftLarge.y)).toBe(true);
    expect(Number.isFinite(tangents.leftSmall.x)).toBe(true);
    expect(Number.isFinite(tangents.leftSmall.y)).toBe(true);
    expect(tangents.leftLarge.x).toBeCloseTo(-tangents.rightLarge.x, 5);
    expect(tangents.leftSmall.x).toBeCloseTo(-tangents.rightSmall.x, 5);
    expect(tangents.leftSmall.y).toBeLessThan(tangents.leftLarge.y);
  });
});
