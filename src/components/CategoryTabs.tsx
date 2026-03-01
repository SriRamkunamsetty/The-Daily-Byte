import { useRef } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

export const CATEGORIES = [
  "All",
  "Technology",
  "Business",
  "Science"
];

interface CategoryTabsProps {
  active: string;
  onChange: (cat: string) => void;
}

export default function CategoryTabs({ active, onChange }: CategoryTabsProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: "left" | "right") => {
    scrollRef.current?.scrollBy({ left: dir === "left" ? -200 : 200, behavior: "smooth" });
  };

  return (
    <nav className="sticky top-16 z-40 glass-bar" aria-label="News categories">
      <div className="max-w-7xl mx-auto px-4 relative flex items-center">
        <button
          onClick={() => scroll("left")}
          className="hidden md:flex shrink-0 w-8 h-8 items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
          aria-label="Scroll categories left"
        >
          <ChevronLeft size={17} />
        </button>

        <div
          ref={scrollRef}
          className="category-scroll flex gap-1 overflow-x-auto py-2.5 px-1"
          role="tablist"
        >
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              role="tab"
              aria-selected={active === cat}
              onClick={() => onChange(cat)}
              className="relative shrink-0 px-4 py-1.5 rounded-full text-sm font-medium transition-colors duration-150 z-10 outline-none"
              style={{ color: active === cat ? "hsl(var(--primary-foreground))" : "hsl(var(--muted-foreground))" }}
            >
              {/* Sliding animated pill background */}
              {active === cat && (
                <motion.span
                  layoutId="active-pill"
                  className="absolute inset-0 rounded-full bg-primary shadow-sm"
                  transition={{
                    type: "spring",
                    stiffness: 420,
                    damping: 32,
                    mass: 0.8,
                  }}
                  style={{ zIndex: -1 }}
                />
              )}
              <span className={`relative z-10 transition-colors duration-150 ${active === cat ? "text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}>
                {cat}
              </span>
            </button>
          ))}
        </div>

        <button
          onClick={() => scroll("right")}
          className="hidden md:flex shrink-0 w-8 h-8 items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
          aria-label="Scroll categories right"
        >
          <ChevronRight size={17} />
        </button>
      </div>
    </nav>
  );
}
