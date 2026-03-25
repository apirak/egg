export const GAME_CONFIG = {
  width: 420,
  height: 640,
  gravityY: 1,
  wallThickness: 48,
  spawnY: 48,
  fixedDeltaMs: 1000 / 60,
  maxFrameDeltaMs: 1000 / 20,
  maxSubsteps: 4,
  tilt: {
    maxTiltAngle: 45,
    gravityScale: 0.02,
    smoothingFactor: 0.15,
    deadZone: 3,
    permissionTimeout: 5000,
  },
};
