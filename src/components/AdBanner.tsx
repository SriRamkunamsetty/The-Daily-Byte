import { useState, useRef, useEffect } from "react";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useApp } from "@/context/AppContext";
import { useAudio } from "@/hooks/useAudio";

interface AdBannerProps {
  type?: "horizontal" | "square" | "vertical" | "inline" | "sticky-footer";
  className?: string;
}

export default function AdBanner({ type = "horizontal", className = "" }: AdBannerProps) {
  const [dismissed, setDismissed] = useState(false);
  const { antigravity } = useApp();
  const { playWhoosh, playThud, playFlick, playTick } = useAudio();
  const [zIndex, setZIndex] = useState(1);
  const floorHitRef = useRef(false);

  useEffect(() => {
    if (antigravity) {
      playWhoosh();
      floorHitRef.current = false;
    }
  }, [antigravity, playWhoosh]);

  const gravityAnimation = {
    y: "80vh",
    rotate: Math.random() * 10 - 5,
    transition: {
      type: "spring" as const,
      stiffness: 100,
      damping: 10,
      mass: 1.2
    }
  };

  const normalAnimation = {
    y: 0,
    rotate: 0,
    transition: {
      type: "spring" as const,
      stiffness: 100,
      damping: 15
    }
  };

  const wrapWithGravity = (content: React.ReactNode, baseClass: string, style?: any) => {
    return (
      <motion.div
        animate={antigravity ? gravityAnimation : normalAnimation}
        drag={antigravity}
        dragConstraints={{ top: 0, left: 0, right: 0, bottom: 0 }}
        dragTransition={{ bounceStiffness: 600, bounceDamping: 20 }}
        whileDrag={{ scale: 1.05, zIndex: 100 }}
        onDragStart={() => {
          setZIndex(100);
          playTick();
        }}
        onDragEnd={(_, info) => {
          setZIndex(50);
          playFlick(info.velocity.y);
          floorHitRef.current = false;
        }}
        onUpdate={(latest: any) => {
          if (antigravity) {
            const y = typeof latest.y === "string" ? parseFloat(latest.y) : latest.y;
            const floorY = window.innerHeight * 0.8;

            if (!floorHitRef.current && y >= floorY) {
              playThud();
              floorHitRef.current = true;
            } else if (floorHitRef.current && y < floorY - 20) {
              floorHitRef.current = false;
            }
          }
        }}
        className={baseClass}
        style={{
          ...style,
          zIndex: antigravity ? zIndex : "auto",
          position: "relative",
          cursor: antigravity ? "grab" : "default",
          willChange: "transform"
        }}
      >
        {content}
      </motion.div>
    );
  };

  if (type === "sticky-footer") {
    if (dismissed) return null;
    return (
      <AnimatePresence>
        <motion.div
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          exit={{ y: 100 }}
          className="fixed bottom-0 left-0 right-0 z-50 lg:hidden"
        >
          <div className="ad-container rounded-t-2xl flex items-center justify-center text-center px-8 py-3 relative">
            <button
              onClick={() => setDismissed(true)}
              className="absolute top-2 right-3 w-6 h-6 rounded-full glass flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Dismiss ad"
            >
              <X size={12} />
            </button>
            <div className="text-muted-foreground text-xs font-semibold uppercase tracking-widest mr-3">Ad</div>
            <div className="text-muted-foreground/50 text-xs">320 × 50 — Mobile Banner</div>
          </div>
        </motion.div>
      </AnimatePresence>
    );
  }

  if (type === "vertical") {
    return wrapWithGravity(
      <>
        <div className="text-muted-foreground text-xs font-semibold uppercase tracking-widest mb-1">Advertisement</div>
        <div className="text-muted-foreground/50 text-xs">160 × 600</div>
        <div className="mt-3 w-12 h-0.5 bg-border rounded" />
        <div className="mt-2 text-muted-foreground/40 text-xs">Ad Space Available</div>
      </>,
      `ad-container rounded-2xl flex flex-col items-center justify-center text-center p-4 ${className}`,
      { minHeight: "600px" }
    );
  }

  if (type === "square") {
    return wrapWithGravity(
      <>
        <div className="text-muted-foreground text-xs font-semibold uppercase tracking-widest mb-1">Advertisement</div>
        <div className="text-muted-foreground/50 text-xs">300 × 250</div>
        <div className="mt-3 w-12 h-0.5 bg-border rounded" />
        <div className="mt-2 text-muted-foreground/40 text-xs">Ad Space Available</div>
      </>,
      `ad-container rounded-2xl flex flex-col items-center justify-center text-center p-4 ${className}`,
      { minHeight: "250px" }
    );
  }

  if (type === "inline") {
    return wrapWithGravity(
      <>
        <div className="text-muted-foreground text-xs font-semibold uppercase tracking-widest mb-1">Advertisement</div>
        <div className="text-muted-foreground/50 text-xs">728 × 90 — In-Article Ad</div>
      </>,
      `ad-container rounded-2xl flex flex-col items-center justify-center text-center px-8 py-8 w-full my-6 ${className}`,
      { minHeight: "120px" }
    );
  }

  return wrapWithGravity(
    <>
      <div className="text-muted-foreground text-xs font-semibold uppercase tracking-widest mb-1">Advertisement</div>
      <div className="text-muted-foreground/50 text-xs">728 × 90 — Horizontal Banner Ad Space</div>
    </>,
    `ad-container rounded-2xl flex flex-col items-center justify-center text-center px-8 py-6 w-full ${className}`,
    { minHeight: "90px" }
  );
}
