import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Settings, BookmarkX, ArrowRight } from "lucide-react";
import { useApp } from "@/context/AppContext";
import { ALL_NEWS } from "@/data/news";
import NewsCard from "@/components/NewsCard";
import Navbar from "@/components/Navbar";
import NewsFooter from "@/components/NewsFooter";
import AuthModal from "@/components/AuthModal";
import SettingsModal from "@/components/SettingsModal";

export default function ProfilePage() {
  const { isLoggedIn, user, favorites, authModalOpen, setAuthModalOpen, login } = useApp();
  const [openSettings, setOpenSettings] = useState(false);

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex flex-col items-center justify-center py-32 px-4 text-center">
          <h1 className="text-2xl font-bold text-foreground mb-2">Sign in to view your profile</h1>
          <p className="text-muted-foreground mb-6 text-sm">Access your saved articles and preferences.</p>
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => setAuthModalOpen(true)}
            className="bg-primary text-primary-foreground px-6 py-2.5 rounded-full text-sm font-semibold"
          >
            Sign In
          </motion.button>
          <AuthModal open={authModalOpen} onClose={() => setAuthModalOpen(false)} onLogin={login} />
        </div>
      </div>
    );
  }

  const savedArticles = ALL_NEWS.filter((n) => favorites.has(n.id));

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <motion.main
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="max-w-7xl mx-auto px-4 py-6"
      >
        {/* Back */}
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

        {/* User card */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass rounded-2xl p-6 md:p-8 mb-10"
        >
          <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-6">
            <div className="flex flex-col md:flex-row items-center gap-5 text-center md:text-left w-full md:w-auto">
              <img
                src={user?.photoURL || "https://api.dicebear.com/9.x/notionists/svg?seed=User"}
                alt={user?.displayName || "User"}
                className="w-24 h-24 md:w-16 md:h-16 rounded-full border-2 border-primary/40 bg-muted object-cover"
              />
              <div className="flex-1 min-w-0">
                <h1 className="text-2xl md:text-xl font-bold text-foreground">{user?.displayName || "User"}</h1>
                <p className="text-base md:text-sm text-muted-foreground">{user?.email || ""}</p>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => setOpenSettings(true)}
              className="flex items-center justify-center gap-2 glass px-6 py-3 md:px-4 md:py-2 rounded-full text-base md:text-sm font-medium text-foreground hover:bg-white/30 dark:hover:bg-white/10 transition-colors w-full md:w-auto mt-2 md:mt-0"
            >
              <Settings size={18} className="md:w-4 md:h-4" />
              Settings
            </motion.button>
          </div>
        </motion.div>

        {/* Saved articles */}
        <h2 id="saved-articles" className="text-xl font-bold text-foreground mb-6" style={{ fontFamily: "Georgia, serif" }}>
          My Saved Articles
        </h2>

        {savedArticles.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="glass rounded-2xl p-12 text-center"
          >
            <BookmarkX size={40} className="mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">No saved articles yet</h3>
            <p className="text-sm text-muted-foreground mb-6">
              You haven't saved any articles yet. Go explore the news!
            </p>
            <Link to="/">
              <motion.span
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-2.5 rounded-full text-sm font-semibold"
              >
                Explore News
                <ArrowRight size={14} />
              </motion.span>
            </Link>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {savedArticles.map((item, idx) => (
              <NewsCard key={item.id} item={item} index={idx} />
            ))}
          </div>
        )}
      </motion.main>

      <NewsFooter />
      <AuthModal open={authModalOpen} onClose={() => setAuthModalOpen(false)} onLogin={login} />
      <SettingsModal open={openSettings} onClose={() => setOpenSettings(false)} />
    </div>
  );
}
