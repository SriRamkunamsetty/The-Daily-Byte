import { useState, useMemo } from "react";
import { useApp } from "@/context/AppContext";
import { useNews } from "@/hooks/useNews";
import Navbar from "@/components/Navbar";
import CategoryTabs from "@/components/CategoryTabs";
import HeroCard from "@/components/HeroCard";
import NewsCard, { type NewsItem } from "@/components/NewsCard";
import AdBanner from "@/components/AdBanner";
import NewsAd from "@/components/NewsAd";
import NewsFooter from "@/components/NewsFooter";
import AuthModal from "@/components/AuthModal";

const Index = () => {
  const { authModalOpen, setAuthModalOpen, login, antigravity } = useApp();
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const { articles: allArticles, loading: isLoading } = useNews(activeCategory);

  const filteredNews = useMemo(() => {
    let news = allArticles;
    if (activeCategory !== "Top News" && activeCategory !== "All") {
      news = news.filter((n) => n.category.toLowerCase() === activeCategory.toLowerCase());
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      news = news.filter(
        (n) =>
          n.title.toLowerCase().includes(q) ||
          n.description.toLowerCase().includes(q) ||
          n.category.toLowerCase().includes(q)
      );
    }
    return news;
  }, [activeCategory, searchQuery, allArticles]);

  const gridItems = useMemo(() => {
    const items: Array<{ type: "news"; item: NewsItem } | { type: "ad"; id: number }> = [];
    let adCount = 0;

    // Safety check in case filteredNews is extremely large or malformed
    const safeNews = Array.isArray(filteredNews) ? filteredNews : [];

    safeNews.forEach((item, idx) => {
      items.push({ type: "news", item });
      if ((idx + 1) % 5 === 0) {
        adCount++;
        items.push({ type: "ad", id: adCount });
      }
    });
    return items;
  }, [filteredNews]);

  return (
    <div className={`min-h-screen bg-background ${antigravity ? "overflow-hidden h-screen" : ""}`}>
      <Navbar searchQuery={searchQuery} onSearchChange={setSearchQuery} />

      {/* Ad 1: Top Banner below navbar, above category tabs */}
      <aside className="max-w-7xl mx-auto px-4 pt-3" aria-label="Advertisement">
        <AdBanner type="horizontal" />
      </aside>

      <CategoryTabs active={activeCategory} onChange={setActiveCategory} />

      <main className="max-w-7xl mx-auto px-4 py-6">
        {(activeCategory === "Top News" || activeCategory === "All" || activeCategory === "AI Agents") && !searchQuery && (
          <section className="mb-6" aria-label="Featured breaking news">
            <HeroCard />
          </section>
        )}

        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-foreground" style={{ fontFamily: "Georgia, serif" }}>
            {searchQuery
              ? `Search results for "${searchQuery}"`
              : (activeCategory === "Top News" || activeCategory === "All")
                ? "Latest Stories"
                : activeCategory}
          </h2>
          {filteredNews.length > 0 && (
            <span className="text-sm text-muted-foreground">
              {filteredNews.length} {filteredNews.length === 1 ? "story" : "stories"}
            </span>
          )}
        </div>

        {filteredNews.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground">
            <p className="text-lg">No stories found.</p>
            <p className="text-sm mt-1">Try a different category or search term.</p>
          </div>
        ) : (
          <div className="flex gap-6">
            {/* Main content area – 75% on desktop */}
            <div className="flex-1 min-w-0">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {gridItems.map((entry, idx) =>
                  entry.type === "news" ? (
                    <NewsCard key={`news-${entry.item.id}`} item={entry.item} index={idx} />
                  ) : (
                    <aside key={`ad-${entry.id}`} aria-label="Advertisement" className="flex">
                      <NewsAd />
                    </aside>
                  )
                )}
              </div>
            </div>

            {/* Ad 6: Desktop Sticky Sidebar */}
            <aside className="hidden lg:block w-[280px] shrink-0" aria-label="Sidebar advertisement">
              <div className="sticky top-36">
                <AdBanner type="vertical" />
              </div>
            </aside>
          </div>
        )}
      </main>

      <NewsFooter />
      <AuthModal open={authModalOpen} onClose={() => setAuthModalOpen(false)} onLogin={login} />
    </div>
  );
};

export default Index;
