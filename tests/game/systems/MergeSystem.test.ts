import { Bodies } from "matter-js";
import { afterEach, describe, expect, it, vi } from "vitest";
import { MergeSystem } from "../../../src/game/systems/MergeSystem";
import type { EggEntity } from "../../../src/game/entities/EggFactory";
import type { EggColor, EggLevel } from "../../../src/types/egg";

function createEggEntity(
  id: string,
  color: EggColor,
  level: EggLevel,
  x: number,
  y: number,
): EggEntity {
  return {
    id,
    color,
    level,
    body: Bodies.circle(x, y, 10),
    sprite: { canvas: {} as HTMLCanvasElement, width: 20, height: 20 },
    displayWidth: 20,
    displayHeight: 20,
  };
}

describe("MergeSystem", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("finds a pair when same-color same-level eggs collide", () => {
    vi.spyOn(performance, "now").mockReturnValue(1000);
    const mergeSystem = new MergeSystem();
    const eggs = [
      createEggEntity("a", "red", 2, 0, 0),
      createEggEntity("b", "red", 2, 10, 0),
    ];

    const pair = mergeSystem.findMergePair(eggs);

    expect(pair).not.toBeNull();
    expect(pair?.map((egg) => egg.id)).toEqual(["a", "b"]);
  });

  it("ignores eggs that differ by color or level", () => {
    vi.spyOn(performance, "now").mockReturnValue(1000);
    const mergeSystem = new MergeSystem();

    const differentColor = [
      createEggEntity("a", "red", 2, 0, 0),
      createEggEntity("b", "blue", 2, 10, 0),
    ];
    const differentLevel = [
      createEggEntity("c", "red", 2, 0, 0),
      createEggEntity("d", "red", 3, 10, 0),
    ];

    expect(mergeSystem.findMergePair(differentColor)).toBeNull();
    expect(mergeSystem.findMergePair(differentLevel)).toBeNull();
  });

  it("respects merge cooldown before allowing the same eggs to merge again", () => {
    const nowSpy = vi.spyOn(performance, "now");
    const mergeSystem = new MergeSystem();
    const eggs = [
      createEggEntity("a", "green", 1, 0, 0),
      createEggEntity("b", "green", 1, 10, 0),
    ];

    nowSpy.mockReturnValue(1000);
    mergeSystem.markMerged(["a", "b"]);

    nowSpy.mockReturnValue(1050);
    expect(mergeSystem.findMergePair(eggs)).toBeNull();

    nowSpy.mockReturnValue(1125);
    expect(mergeSystem.findMergePair(eggs)?.map((egg) => egg.id)).toEqual([
      "a",
      "b",
    ]);
  });

  it("skips non-colliding eggs even when color and level match", () => {
    vi.spyOn(performance, "now").mockReturnValue(1000);
    const mergeSystem = new MergeSystem();
    const eggs = [
      createEggEntity("a", "yellow", 4, 0, 0),
      createEggEntity("b", "yellow", 4, 100, 0),
    ];

    expect(mergeSystem.findMergePair(eggs)).toBeNull();
  });
});
