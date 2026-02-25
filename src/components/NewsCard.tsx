import { useNavigate } from "react-router-dom";
import { Clock, ArrowRight, Bookmark, BookmarkCheck } from "lucide-react";
import { motion } from "framer-motion";
import { useApp } from "@/context/AppContext";

export interface NewsItem {
  id: number;
  title: string;
  description: string;
  category: string;
  timeAgo: string;
  image: string;
  imageAlt: string;
  content?: string;
}

interface NewsCardProps {
  item: NewsItem;
  index?: number;
}

const categoryColors: Record<string, string> = {
  "AI Agents": "bg-blue-500/15 text-blue-600 dark:text-blue-300 border border-blue-300/30",
  "Computer Vision": "bg-purple-500/15 text-purple-600 dark:text-purple-300 border border-purple-300/30",
  "Finance": "bg-emerald-500/15 text-emerald-600 dark:text-emerald-300 border border-emerald-300/30",
  "Sports": "bg-orange-500/15 text-orange-600 dark:text-orange-300 border border-orange-300/30",
  "Geopolitics": "bg-red-500/15 text-red-600 dark:text-red-300 border border-red-300/30",
  "IoT & Hardware": "bg-cyan-500/15 text-cyan-600 dark:text-cyan-300 border border-cyan-300/30",
  "Web Dev": "bg-indigo-500/15 text-indigo-600 dark:text-indigo-300 border border-indigo-300/30",
  "Top News": "bg-amber-500/15 text-amber-600 dark:text-amber-300 border border-amber-300/30",
};

export default function NewsCard({ item, index = 0 }: NewsCardProps) {
  const tagClass = categoryColors[item.category] ?? "bg-secondary text-secondary-foreground";
  const { favorites, toggleFavorite } = useApp();
  const isFav = favorites.has(item.id);
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/article/${item.id}`);
  };

  const handleBookmark = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleFavorite(item.id);
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.05, ease: [0.4, 0, 0.2, 1] }}
      whileHover={{ scale: 1.025, y: -4 }}
      onClick={handleCardClick}
      className="group glass glass-hover rounded-2xl overflow-hidden flex flex-col h-full cursor-pointer"
      style={{ transition: "transform 0.3s ease-out, box-shadow 0.3s ease-out" }}
    >
      {/* Thumbnail */}
      <div className="relative overflow-hidden aspect-video">
        <img
          src={item.image}
          alt={item.imageAlt}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <div className="absolute top-3 left-3">
          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full backdrop-blur-sm ${tagClass}`}>
            {item.category}
          </span>
        </div>
        {/* Bookmark icon */}
        <motion.button
          whileTap={{ scale: 0.75 }}
          onClick={handleBookmark}
          className={`absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-sm transition-colors ${
            isFav
              ? "bg-primary/80 text-primary-foreground"
              : "bg-black/30 text-white/80 hover:bg-black/50"
          }`}
          aria-label={isFav ? "Remove bookmark" : "Bookmark article"}
        >
          <motion.div
            key={isFav ? "filled" : "empty"}
            initial={{ scale: 0.5 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 500, damping: 15 }}
          >
            {isFav ? <BookmarkCheck size={14} /> : <Bookmark size={14} />}
          </motion.div>
        </motion.button>
      </div>

      {/* Body */}
      <div className="flex flex-col flex-1 p-4">
        <h2 className="font-bold text-base leading-snug mb-2 line-clamp-2 group-hover:text-primary transition-colors duration-200 text-card-foreground">
          {item.title}
        </h2>
        <p className="text-muted-foreground text-sm leading-relaxed line-clamp-2 flex-1">
          {item.description}
        </p>

        <div className="flex items-center justify-between mt-4 pt-3 border-t border-white/20 dark:border-white/10">
          <span className="flex items-center gap-1 text-muted-foreground text-xs">
            <Clock size={12} />
            {item.timeAgo}
          </span>
          <span className="flex items-center gap-1 text-primary text-xs font-semibold group/link">
            <span>Read More</span>
            <ArrowRight size={12} />
          </span>
        </div>
      </div>
    </motion.article>
  );
}
