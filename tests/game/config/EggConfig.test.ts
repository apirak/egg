import { describe, expect, it } from "vitest";
import {
  EGG_COLOR_WEIGHT_TOTAL,
  EGG_COLOR_WEIGHTS,
  getAllEggTypes,
  getEggDisplayName,
  getEggId,
  getGameplayEggSize,
  pickWeightedEggColor,
} from "../../../src/game/config/EggConfig";

describe("EggConfig", () => {
  it("returns all 30 egg type combinations", () => {
    const types = getAllEggTypes();
    const uniqueIds = new Set(types.map((type) => getEggId(type)));

    expect(types).toHaveLength(30);
    expect(uniqueIds.size).toBe(30);
  });

  it("formats egg ids and display names consistently", () => {
    expect(getEggId({ color: "gray", level: 6 })).toBe("gray-L6");
    expect(getEggDisplayName({ color: "blue", level: 2 })).toBe(
      "Blue Dot (L2)",
    );
  });

  it("keeps gameplay size at least one pixel", () => {
    expect(getGameplayEggSize(0)).toBe(1);
    expect(getGameplayEggSize(36)).toBe(6);
  });

  it("matches the configured total weight", () => {
    const computedTotal = Object.values(EGG_COLOR_WEIGHTS).reduce(
      (sum, weight) => sum + weight,
      0,
    );

    expect(EGG_COLOR_WEIGHT_TOTAL).toBe(20);
    expect(EGG_COLOR_WEIGHT_TOTAL).toBe(computedTotal);
  });

  it("maps deterministic random values into weighted color buckets", () => {
    expect(pickWeightedEggColor(0)).toBe("red");
    expect(pickWeightedEggColor(0.099)).toBe("red");
    expect(pickWeightedEggColor(0.1)).toBe("blue");
    expect(pickWeightedEggColor(0.249)).toBe("blue");
    expect(pickWeightedEggColor(0.25)).toBe("green");
    expect(pickWeightedEggColor(0.449)).toBe("green");
    expect(pickWeightedEggColor(0.45)).toBe("yellow");
    expect(pickWeightedEggColor(0.699)).toBe("yellow");
    expect(pickWeightedEggColor(0.7)).toBe("gray");
    expect(pickWeightedEggColor(0.999999)).toBe("gray");
  });
});
