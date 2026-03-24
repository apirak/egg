export class GameLoop {
  private frameId: number | null = null;
  private running = false;
  private lastTime = 0;
  private onFrame: (deltaMs: number) => void;

  constructor(onFrame: (deltaMs: number) => void) {
    this.onFrame = onFrame;
  }

  start(): void {
    if (this.running) return;
    this.running = true;
    this.lastTime = performance.now();
    this.frameId = requestAnimationFrame(this.tick);
  }

  stop(): void {
    this.running = false;
    if (this.frameId !== null) {
      cancelAnimationFrame(this.frameId);
      this.frameId = null;
    }
  }

  private tick = (time: number): void => {
    if (!this.running) return;
    const deltaMs = Math.min(33, time - this.lastTime);
    this.lastTime = time;
    this.onFrame(deltaMs);
    this.frameId = requestAnimationFrame(this.tick);
  };
}
