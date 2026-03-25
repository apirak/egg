import { useState, useCallback, useRef } from 'preact/hooks';
import { DeviceOrientationService, type DeviceOrientationData, type PermissionState } from '../game/services/DeviceOrientationService';

interface UseDeviceOrientationReturn {
	orientation: DeviceOrientationData | null;
	permissionState: PermissionState;
	isEnabled: boolean;
	isSupported: boolean;
	requestPermission: () => Promise<PermissionState>;
	enable: () => void;
	disable: () => void;
	toggle: () => void;
}

export function useDeviceOrientation(): UseDeviceOrientationReturn {
	const [orientation, setOrientation] = useState<DeviceOrientationData | null>(null);
	const [permissionState, setPermissionState] = useState<PermissionState>('prompt');
	const [isEnabled, setIsEnabled] = useState(false);
	const serviceRef = useRef<DeviceOrientationService | null>(null);

	if (!serviceRef.current) {
		serviceRef.current = new DeviceOrientationService({
			onOrientationChange: (data) => {
				setOrientation(data);
			},
			onPermissionChange: (state) => {
				setPermissionState(state);
			},
		});
	}

	const requestPermission = useCallback(async (): Promise<PermissionState> => {
		if (!serviceRef.current) return 'unsupported';
		return await serviceRef.current.requestPermission();
	}, []);

	const enable = useCallback(() => {
		if (!serviceRef.current) return;
		// Use the service's current permission state directly
		const actualState = serviceRef.current.getPermissionState();
		if (actualState !== 'granted') {
			console.warn('[useDeviceOrientation] Cannot enable: permission state =', actualState);
			return;
		}
		serviceRef.current.start();
		setIsEnabled(true);
	}, []);

	const disable = useCallback(() => {
		if (!serviceRef.current) return;
		serviceRef.current.stop();
		setIsEnabled(false);
		setOrientation(null);
	}, []);

	const toggle = useCallback(() => {
		if (isEnabled) {
			disable();
		} else {
			enable();
		}
	}, [isEnabled, enable, disable]);

	return {
		orientation,
		permissionState,
		isEnabled,
		isSupported: permissionState !== 'unsupported',
		requestPermission,
		enable,
		disable,
		toggle,
	};
}
