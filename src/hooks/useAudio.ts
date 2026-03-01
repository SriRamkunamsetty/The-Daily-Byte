import { useRef, useCallback, useEffect } from "react";
import { useApp } from "@/context/AppContext";

// Sound paths (expecting these in public/sounds/)
const SOUNDS = {
    whoosh: "/sounds/whoosh.mp3",
    thud1: "/sounds/thud-1.mp3",
    thud2: "/sounds/thud-2.mp3",
    thud3: "/sounds/thud-3.mp3",
    flick: "/sounds/flick.mp3",
};

export function useAudio() {
    const { isMuted } = useApp();
    const audioContextRef = useRef<AudioContext | null>(null);
    const buffersRef = useRef<Record<string, AudioBuffer>>({});

    // Initialize AudioContext on first interaction
    const initAudio = useCallback(() => {
        if (!audioContextRef.current) {
            audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
        }
        if (audioContextRef.current.state === "suspended") {
            audioContextRef.current.resume();
        }
    }, []);

    // Fetch and decode audio
    const loadSound = useCallback(async (name: string, url: string) => {
        if (buffersRef.current[name] || !audioContextRef.current) return;
        try {
            const response = await fetch(url);
            const arrayBuffer = await response.arrayBuffer();
            const audioBuffer = await audioContextRef.current.decodeAudioData(arrayBuffer);
            buffersRef.current[name] = audioBuffer;
        } catch (e) {
            console.error(`Failed to load sound: ${name}`, e);
        }
    }, []);

    useEffect(() => {
        // We don't preload all sounds here to save bandwidth, 
        // but we ensure the context is ready
        const handleFirstInteraction = () => {
            initAudio();
            // Load essential sounds
            Object.entries(SOUNDS).forEach(([name, url]) => loadSound(name, url));
            window.removeEventListener("mousedown", handleFirstInteraction);
            window.removeEventListener("touchstart", handleFirstInteraction);
            window.removeEventListener("keydown", handleFirstInteraction);
        };

        window.addEventListener("mousedown", handleFirstInteraction);
        window.addEventListener("touchstart", handleFirstInteraction);
        window.addEventListener("keydown", handleFirstInteraction);

        return () => {
            window.removeEventListener("mousedown", handleFirstInteraction);
            window.removeEventListener("touchstart", handleFirstInteraction);
            window.removeEventListener("keydown", handleFirstInteraction);
        };
    }, [initAudio, loadSound]);

    const playSound = useCallback((name: keyof typeof SOUNDS, options = { volume: 0.5, pitch: 1.0 }) => {
        if (isMuted || !audioContextRef.current || !buffersRef.current[name]) return;

        const source = audioContextRef.current.createBufferSource();
        source.buffer = buffersRef.current[name];

        const gainNode = audioContextRef.current.createGain();
        gainNode.gain.value = options.volume;

        // Pitch randomization (±10%)
        source.playbackRate.value = options.pitch * (0.9 + Math.random() * 0.2);

        source.connect(gainNode);
        gainNode.connect(audioContextRef.current.destination);
        source.start(0);
    }, [isMuted]);

    const vibrate = useCallback((pattern: number | number[]) => {
        if (isMuted || !("vibrate" in navigator)) return;
        navigator.vibrate(pattern);
    }, [isMuted]);

    const playThud = useCallback(() => {
        const variations: Array<keyof typeof SOUNDS> = ["thud1", "thud2", "thud3"];
        const randomThud = variations[Math.floor(Math.random() * variations.length)];
        playSound(randomThud, { volume: 0.4, pitch: 1.0 });
        vibrate(20);
    }, [playSound, vibrate]);

    const playWhoosh = useCallback(() => {
        if (isMuted || !audioContextRef.current || !buffersRef.current.whoosh) return;

        const source = audioContextRef.current.createBufferSource();
        source.buffer = buffersRef.current.whoosh;

        const gainNode = audioContextRef.current.createGain();
        gainNode.gain.setValueAtTime(0, audioContextRef.current.currentTime);
        // Fade in over 1 second
        gainNode.gain.linearRampToValueAtTime(0.3, audioContextRef.current.currentTime + 1.2);

        source.playbackRate.value = 0.8 + Math.random() * 0.2;

        source.connect(gainNode);
        gainNode.connect(audioContextRef.current.destination);
        source.start(0);
    }, [isMuted]);

    const playFlick = useCallback((velocity: number) => {
        // Only play if velocity is high (absolute value)
        if (isMuted || Math.abs(velocity) < 600) return;
        playSound("flick", { volume: 0.5, pitch: 1.2 });
    }, [isMuted, playSound]);

    const playTick = useCallback(() => {
        if ("vibrate" in navigator) {
            vibrate(10);
        }
    }, [vibrate]);

    return { playWhoosh, playThud, playFlick, playTick, initAudio };
}
