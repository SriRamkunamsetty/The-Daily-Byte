import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Clock, Bookmark, BookmarkCheck, Share2 } from "lucide-react";
import { ALL_NEWS } from "@/data/news";
import { useApp } from "@/context/AppContext";
import Navbar from "@/components/Navbar";
import NewsFooter from "@/components/NewsFooter";
import AuthModal from "@/components/AuthModal";
import AdBanner from "@/components/AdBanner";

const categoryColors: Record<string, string> = {
  "AI Agents": "bg-blue-500/15 text-blue-600 dark:text-blue-300 border border-blue-300/30",
  "Computer Vision": "bg-purple-500/15 text-purple-600 dark:text-purple-300 border border-purple-300/30",
  "Finance": "bg-emerald-500/15 text-emerald-600 dark:text-emerald-300 border border-emerald-300/30",
  "Sports": "bg-orange-500/15 text-orange-600 dark:text-orange-300 border border-orange-300/30",
  "Geopolitics": "bg-red-500/15 text-red-600 dark:text-red-300 border border-red-300/30",
  "IoT & Hardware": "bg-cyan-500/15 text-cyan-600 dark:text-cyan-300 border border-cyan-300/30",
  "Web Dev": "bg-indigo-500/15 text-indigo-600 dark:text-indigo-300 border border-indigo-300/30",
};

export default function ArticlePage() {
  const { id } = useParams();
  const { favorites, toggleFavorite, authModalOpen, setAuthModalOpen, login } = useApp();
  const article = ALL_NEWS.find((n) => n.id === Number(id));

  if (!article) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-2">Article Not Found</h1>
          <Link to="/" className="text-primary hover:underline text-sm">← Back to Home</Link>
        </div>
      </div>
    );
  }

  const isFav = favorites.has(article.id);
  const tagClass = categoryColors[article.category] ?? "bg-secondary text-secondary-foreground";

  // Split content into paragraphs for inline ad injection
  const paragraphs = (article as any).content?.split("\n\n") ?? [article.description];
  const adInsertIndices = new Set<number>();
  if (paragraphs.length >= 4) {
    const mid = Math.floor(paragraphs.length / 3);
    adInsertIndices.add(mid);
    adInsertIndices.add(mid * 2);
  } else if (paragraphs.length >= 2) {
    adInsertIndices.add(Math.floor(paragraphs.length / 2));
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Ad 1: Top Banner below navbar */}
      <aside className="max-w-4xl mx-auto px-4 pt-4" aria-label="Advertisement">
        <AdBanner type="horizontal" />
      </aside>

      <motion.main
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
        className="max-w-4xl mx-auto px-4 py-6"
      >
        {/* Back button */}
        <Link to="/">
          <motion.div
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="inline-flex items-center gap-2 glass rounded-full px-4 py-2 text-sm font-medium text-foreground mb-6 hover:bg-white/30 dark:hover:bg-white/10 transition-colors"
          >
            <ArrowLeft size={16} />
            Back to Home
          </motion.div>
        </Link>

        {/* Hero image */}
        <div className="relative rounded-2xl overflow-hidden mb-8 aspect-video">
          <img
            src={article.image}
            alt={article.imageAlt}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
        </div>

        {/* Meta row */}
        <div className="flex items-center flex-wrap gap-3 mb-4">
          <span className={`text-xs font-semibold px-3 py-1 rounded-full backdrop-blur-sm ${tagClass}`}>
            {article.category}
          </span>
          <span className="flex items-center gap-1 text-muted-foreground text-xs">
            <Clock size={12} />
            {article.timeAgo}
          </span>
          <span className="text-muted-foreground text-xs">February 25, 2026</span>
        </div>

        {/* Title */}
        <h1 className="text-3xl md:text-4xl font-bold text-foreground leading-tight mb-6">
          {article.title}
        </h1>

        {/* Action row */}
        <div className="flex items-center gap-3 mb-8 pb-6 border-b border-white/15 dark:border-white/10">
          <motion.button
            whileTap={{ scale: 0.85 }}
            onClick={() => toggleFavorite(article.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              isFav
                ? "bg-primary/15 text-primary border border-primary/30"
                : "glass text-muted-foreground hover:text-foreground"
            }`}
          >
            <motion.div
              key={isFav ? "filled" : "empty"}
              initial={{ scale: 0.5 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 500, damping: 15 }}
            >
              {isFav ? <BookmarkCheck size={16} /> : <Bookmark size={16} />}
            </motion.div>
            {isFav ? "Saved" : "Save Article"}
          </motion.button>

          <motion.button
            whileTap={{ scale: 0.9 }}
            className="flex items-center gap-2 glass px-4 py-2 rounded-full text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <Share2 size={16} />
            Share
          </motion.button>
        </div>

        {/* Article body with inline ads */}
        <div className="prose prose-lg dark:prose-invert max-w-none">
          {paragraphs.map((paragraph: string, i: number) => (
            <div key={i}>
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + i * 0.05 }}
                className="text-foreground/90 text-base leading-relaxed mb-5"
              >
                {paragraph}
              </motion.p>
              {/* Ads 2 & 3: Inline ads between paragraphs */}
              {adInsertIndices.has(i) && (
                <aside aria-label="Advertisement">
                  <AdBanner type="inline" />
                </aside>
              )}
            </div>
          ))}
        </div>

        {/* Ad 4: Bottom anchor after article */}
        <aside className="mt-10 mb-6" aria-label="Advertisement">
          <AdBanner type="horizontal" />
        </aside>
      </motion.main>

      <NewsFooter />
      <AuthModal open={authModalOpen} onClose={() => setAuthModalOpen(false)} onLogin={login} />

      {/* Ad 5: Sticky footer ad on mobile */}
      <AdBanner type="sticky-footer" />
    </div>
  );
}
