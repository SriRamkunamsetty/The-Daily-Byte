import { useState } from "react";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface AdBannerProps {
  type?: "horizontal" | "square" | "vertical" | "inline" | "sticky-footer";
  className?: string;
}

export default function AdBanner({ type = "horizontal", className = "" }: AdBannerProps) {
  const [dismissed, setDismissed] = useState(false);

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
    return (
      <div
        className={`ad-container rounded-2xl flex flex-col items-center justify-center text-center p-4 ${className}`}
        style={{ minHeight: "600px" }}
        aria-label="Advertisement Space"
        role="complementary"
      >
        <div className="text-muted-foreground text-xs font-semibold uppercase tracking-widest mb-1">Advertisement</div>
        <div className="text-muted-foreground/50 text-xs">160 × 600</div>
        <div className="mt-3 w-12 h-0.5 bg-border rounded" />
        <div className="mt-2 text-muted-foreground/40 text-xs">Ad Space Available</div>
      </div>
    );
  }

  if (type === "square") {
    return (
      <div
        className={`ad-container rounded-2xl flex flex-col items-center justify-center text-center p-4 ${className}`}
        style={{ minHeight: "250px" }}
        aria-label="Advertisement Space"
        role="complementary"
      >
        <div className="text-muted-foreground text-xs font-semibold uppercase tracking-widest mb-1">Advertisement</div>
        <div className="text-muted-foreground/50 text-xs">300 × 250</div>
        <div className="mt-3 w-12 h-0.5 bg-border rounded" />
        <div className="mt-2 text-muted-foreground/40 text-xs">Ad Space Available</div>
      </div>
    );
  }

  if (type === "inline") {
    return (
      <div
        className={`ad-container rounded-2xl flex flex-col items-center justify-center text-center px-8 py-8 w-full my-6 ${className}`}
        style={{ minHeight: "120px" }}
        aria-label="Advertisement Space"
        role="complementary"
      >
        <div className="text-muted-foreground text-xs font-semibold uppercase tracking-widest mb-1">Advertisement</div>
        <div className="text-muted-foreground/50 text-xs">728 × 90 — In-Article Ad</div>
      </div>
    );
  }

  return (
    <div
      className={`ad-container rounded-2xl flex flex-col items-center justify-center text-center px-8 py-6 w-full ${className}`}
      style={{ minHeight: "90px" }}
      aria-label="Advertisement Space"
      role="complementary"
    >
      <div className="text-muted-foreground text-xs font-semibold uppercase tracking-widest mb-1">Advertisement</div>
      <div className="text-muted-foreground/50 text-xs">728 × 90 — Horizontal Banner Ad Space</div>
    </div>
  );
}
