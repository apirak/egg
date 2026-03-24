import { Collision } from "matter-js";
import type { EggEntity } from "../entities/EggFactory";

/**
 * Finds merge candidates among existing eggs.
 * A valid merge requires same color + same level + active collision.
 */
export class MergeSystem {
  private readonly recentMergeAt: Map<string, number> = new Map();
  private readonly mergeCooldownMs = 120;

  findMergePair(eggs: EggEntity[]): [EggEntity, EggEntity] | null {
    const now = performance.now();
    this.pruneRecent(now);

    for (let i = 0; i < eggs.length; i++) {
      for (let j = i + 1; j < eggs.length; j++) {
        const a = eggs[i];
        const b = eggs[j];

        if (a.color !== b.color || a.level !== b.level) continue;
        if (this.isCoolingDown(a.id, now) || this.isCoolingDown(b.id, now))
          continue;
        if (!Collision.collides(a.body, b.body)) continue;

        return [a, b];
      }
    }

    return null;
  }

  markMerged(ids: string[]): void {
    const now = performance.now();
    for (const id of ids) {
      this.recentMergeAt.set(id, now);
    }
  }

  private isCoolingDown(id: string, now: number): boolean {
    const at = this.recentMergeAt.get(id);
    if (!at) return false;
    return now - at < this.mergeCooldownMs;
  }

  private pruneRecent(now: number): void {
    for (const [id, at] of this.recentMergeAt.entries()) {
      if (now - at > this.mergeCooldownMs * 2) {
        this.recentMergeAt.delete(id);
      }
    }
  }
}
