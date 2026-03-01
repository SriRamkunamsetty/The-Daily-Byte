import { useEffect, useCallback } from "react";

export const requestShakePermission = async (): Promise<boolean> => {
    if (typeof window !== "undefined" && "DeviceMotionEvent" in window) {
        const DeviceMotion = DeviceMotionEvent as any;
        if (typeof DeviceMotion.requestPermission === "function") {
            try {
                const response = await DeviceMotion.requestPermission();
                return response === "granted";
            } catch (e) {
                console.error("DeviceMotion permission error:", e);
                return false;
            }
        }
        return true; // Not required or already supported
    }
    return false;
};

export function useShake(onShake: () => void, threshold = 15) {
    const handleMotion = useCallback((event: DeviceMotionEvent) => {
        const acc = event.accelerationIncludingGravity;
        if (!acc) return;

        const { x, y, z } = acc;
        const acceleration = Math.sqrt((x || 0) ** 2 + (y || 0) ** 2 + (z || 0) ** 2);

        if (acceleration > threshold) {
            onShake();
        }
    }, [onShake, threshold]);

    useEffect(() => {
        if (typeof window !== "undefined" && "DeviceMotionEvent" in window) {
            window.addEventListener("devicemotion", handleMotion);
        }

        return () => {
            window.removeEventListener("devicemotion", handleMotion);
        };
    }, [handleMotion]);
}
