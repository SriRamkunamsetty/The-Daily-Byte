interface AdBannerProps {
  type?: "horizontal" | "square";
  className?: string;
}

export default function AdBanner({ type = "horizontal", className = "" }: AdBannerProps) {
  if (type === "square") {
    return (
      <div
        className={`ad-container rounded-2xl flex flex-col items-center justify-center text-center p-4 ${className}`}
        style={{ minHeight: "250px" }}
        aria-label="Advertisement Space"
        role="complementary"
      >
        <div className="text-muted-foreground text-xs font-semibold uppercase tracking-widest mb-1">Advertisement</div>
        <div className="text-muted-foreground/50 text-xs">250 × 250</div>
        <div className="mt-3 w-12 h-0.5 bg-border rounded" />
        <div className="mt-2 text-muted-foreground/40 text-xs">Ad Space Available</div>
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
