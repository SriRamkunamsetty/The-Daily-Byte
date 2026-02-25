import { useMemo } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Search, ArrowLeft } from "lucide-react";
import Navbar from "@/components/Navbar";
import NewsCard from "@/components/NewsCard";
import NewsFooter from "@/components/NewsFooter";
import AuthModal from "@/components/AuthModal";
import { ALL_NEWS } from "@/data/news";
import { useApp } from "@/context/AppContext";

export default function SearchPage() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") ?? "";
  const navigate = useNavigate();
  const { authModalOpen, setAuthModalOpen, login, userPosts } = useApp();

  const allArticles = useMemo(() => [...userPosts, ...ALL_NEWS], [userPosts]);

  const results = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return allArticles.filter(
      (n) =>
        n.title.toLowerCase().includes(q) ||
        n.description.toLowerCase().includes(q) ||
        n.category.toLowerCase().includes(q)
    );
  }, [query, allArticles]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <motion.main
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="max-w-7xl mx-auto px-4 py-8"
      >
        <div className="mb-8">
          <button
            onClick={() => navigate("/")}
            className="inline-flex items-center gap-2 glass rounded-full px-4 py-2 text-sm font-medium text-foreground mb-4 hover:bg-white/30 dark:hover:bg-white/10 transition-colors"
          >
            <ArrowLeft size={16} />
            Back to Home
          </button>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground" style={{ fontFamily: "Georgia, serif" }}>
            Search Results for: <span className="text-primary">"{query}"</span>
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            {results.length} {results.length === 1 ? "article" : "articles"} found
          </p>
        </div>

        {results.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {results.map((item, idx) => (
              <NewsCard key={item.id} item={item} index={idx} />
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass rounded-2xl p-12 text-center max-w-lg mx-auto"
          >
            <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
              <Search size={36} className="text-primary" />
            </div>
            <h2 className="text-xl font-bold text-foreground mb-2">No articles found</h2>
            <p className="text-muted-foreground text-sm mb-6">
              No articles found matching "<span className="font-medium text-foreground">{query}</span>"
            </p>
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate("/")}
              className="px-6 py-2.5 rounded-full bg-primary text-primary-foreground text-sm font-semibold shadow-sm hover:opacity-90 transition-opacity"
            >
              Clear Search and Return Home
            </motion.button>
          </motion.div>
        )}
      </motion.main>

      <NewsFooter />
      <AuthModal open={authModalOpen} onClose={() => setAuthModalOpen(false)} onLogin={login} />
    </div>
  );
}
