import { GAME_CONFIG } from '../config/GameConfig';

export interface DeviceOrientationData {
	beta: number;
	gamma: number;
	gravityX: number;
	gravityY: number;
}

export type PermissionState = 'prompt' | 'granted' | 'denied' | 'unsupported';

export interface DeviceOrientationServiceCallbacks {
	onOrientationChange?: (data: DeviceOrientationData) => void;
	onPermissionChange?: (state: PermissionState) => void;
}

export class DeviceOrientationService {
	private permissionState: PermissionState = 'prompt';
	private currentBeta = 0;
	private currentGamma = 0;
	private smoothedBeta = 0;
	private smoothedGamma = 0;
	private isActive = false;
	private callbacks: DeviceOrientationServiceCallbacks = {};

	constructor(callbacks?: DeviceOrientationServiceCallbacks) {
		this.callbacks = callbacks || {};
		this.checkSupport();
	}

	private checkSupport(): void {
		if (typeof window === 'undefined' || !window.DeviceOrientationEvent) {
			this.permissionState = 'unsupported';
			this.notifyPermissionChange();
			return;
		}
	}

	async requestPermission(): Promise<PermissionState> {
		if (this.permissionState === 'unsupported') {
			return this.permissionState;
		}

		const DeviceOrientationEvent = window.DeviceOrientationEvent as any;
		if (typeof DeviceOrientationEvent.requestPermission === 'function') {
			try {
				const permissionState = await DeviceOrientationEvent.requestPermission();
				this.permissionState = permissionState === 'granted' ? 'granted' : 'denied';
			} catch (error) {
				this.permissionState = 'denied';
			}
		} else {
			this.permissionState = 'granted';
		}

		this.notifyPermissionChange();
		return this.permissionState;
	}

	start(): void {
		if (this.isActive) return;
		if (this.permissionState !== 'granted') {
			return;
		}

		this.isActive = true;
		window.addEventListener('deviceorientation', this.handleOrientation);
	}

	stop(): void {
		if (!this.isActive) return;

		this.isActive = false;
		window.removeEventListener('deviceorientation', this.handleOrientation);

		this.smoothedBeta = 0;
		this.smoothedGamma = 0;
	}

	getPermissionState(): PermissionState {
		return this.permissionState;
	}

	isRunning(): boolean {
		return this.isActive;
	}

	private handleOrientation = (event: DeviceOrientationEvent): void => {
		if (event.beta === null || event.gamma === null) return;

		this.currentBeta = event.beta;
		this.currentGamma = event.gamma;

		const config = GAME_CONFIG.tilt;
		this.smoothedBeta = this.lerp(this.smoothedBeta, this.currentBeta, config.smoothingFactor);
		this.smoothedGamma = this.lerp(this.smoothedGamma, this.currentGamma, config.smoothingFactor);

		const adjustedBeta = this.applyDeadZone(this.smoothedBeta, config.deadZone);
		const adjustedGamma = this.applyDeadZone(this.smoothedGamma, config.deadZone);

		const clampedBeta = this.clamp(adjustedBeta, -config.maxTiltAngle, config.maxTiltAngle);
		const clampedGamma = this.clamp(adjustedGamma, -config.maxTiltAngle, config.maxTiltAngle);

		let gravityX = clampedGamma * config.gravityScale;
		let gravityY = clampedBeta * config.gravityScale;

		// Adjust gravity based on screen orientation type
		// DeviceOrientationEvent uses device frame (portrait), but screen may be rotated
		// Note: orientation.angle may be unreliable on some devices, use type instead
		const orientation = window.screen.orientation;
		const type = orientation?.type ?? 'portrait-primary';

		if (type === 'landscape-primary') {
			// Landscape (home button left on iOS) - rotate 90° clockwise
			[gravityX, gravityY] = [gravityY, -gravityX];
		} else if (type === 'landscape-secondary') {
			// Landscape reverse (home button right on iOS) - rotate 90° counter-clockwise
			[gravityX, gravityY] = [-gravityY, gravityX];
		} else if (type === 'portrait-secondary') {
			// Portrait upside down - invert both axes
			gravityX = -gravityX;
			gravityY = -gravityY;
		}
		// portrait-primary - no adjustment needed

		this.callbacks.onOrientationChange?.({
			beta: this.currentBeta,
			gamma: this.currentGamma,
			gravityX,
			gravityY,
		});
	};

	private lerp(start: number, end: number, factor: number): number {
		return start + (end - start) * factor;
	}

	private applyDeadZone(value: number, deadZone: number): number {
		if (Math.abs(value) < deadZone) return 0;
		return value > 0 ? value - deadZone : value + deadZone;
	}

	private clamp(value: number, min: number, max: number): number {
		return Math.max(min, Math.min(max, value));
	}

	private notifyPermissionChange(): void {
		this.callbacks.onPermissionChange?.(this.permissionState);
	}
}
