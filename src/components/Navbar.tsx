import { useState } from "react";
import { Search, Moon, Sun, Bell, Menu, X, Zap } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useApp } from "@/context/AppContext";
import UserMenu from "./UserMenu";

interface NavbarProps {
  searchQuery?: string;
  onSearchChange?: (q: string) => void;
}

export default function Navbar({ searchQuery: externalQuery, onSearchChange: externalOnChange }: NavbarProps) {
  const { isLoggedIn, user, darkMode, toggleDark, logout, setAuthModalOpen, userAvatar } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [internalQuery, setInternalQuery] = useState("");
  const navigate = useNavigate();

  const searchQuery = externalQuery ?? internalQuery;
  const onSearchChange = externalOnChange ?? setInternalQuery;

  return (
    <header className="sticky top-0 z-50 glass-nav">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center gap-3">
        {/* Logo */}
        <a href="/" onClick={(e) => { e.preventDefault(); navigate("/"); }} className="flex items-center gap-2 shrink-0 group" aria-label="The Daily Byte Home">
          <motion.div
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.95 }}
            className="w-8 h-8 rounded-xl bg-primary flex items-center justify-center shadow-sm"
          >
            <Zap size={16} className="text-primary-foreground" fill="currentColor" />
          </motion.div>
          <span className="font-bold text-xl tracking-tight hidden sm:block">
            The Daily<span className="text-primary"> Byte</span>
          </span>
        </a>

        {/* Search Bar */}
        <div className="flex-1 max-w-xl mx-auto">
          <motion.div
            animate={{ boxShadow: searchFocused ? "0 0 0 3px hsl(var(--primary) / 0.2)" : "0 0 0 0px transparent" }}
            transition={{ duration: 0.2 }}
            className={`flex items-center rounded-full px-4 py-2 transition-colors duration-200 ${searchFocused
              ? "bg-white dark:bg-white/10 border border-primary/40"
              : "bg-white/50 dark:bg-white/5 border border-white/30 dark:border-white/10"
              }`}
          >
            <Search size={15} className="text-muted-foreground shrink-0" />
            <input
              type="search"
              placeholder="Search news, topics, categories..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && searchQuery.trim()) {
                  navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
                }
              }}
              className="flex-1 bg-transparent ml-2 text-sm outline-none text-foreground placeholder:text-muted-foreground"
              aria-label="Search news"
            />
          </motion.div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2 shrink-0">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={toggleDark}
            aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
            className="w-9 h-9 rounded-full flex items-center justify-center bg-white/40 dark:bg-white/5 border border-white/30 dark:border-white/10 text-muted-foreground hover:text-foreground transition-colors"
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={darkMode ? "sun" : "moon"}
                initial={{ opacity: 0, rotate: -30, scale: 0.7 }}
                animate={{ opacity: 1, rotate: 0, scale: 1 }}
                exit={{ opacity: 0, rotate: 30, scale: 0.7 }}
                transition={{ duration: 0.2 }}
              >
                {darkMode ? <Sun size={16} /> : <Moon size={16} />}
              </motion.div>
            </AnimatePresence>
          </motion.button>

          {/* Subscribe or Avatar */}
          {isLoggedIn ? (
            <div className="relative hidden sm:block">
              <motion.button
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="w-9 h-9 rounded-full overflow-hidden border-2 border-primary/50 shadow-sm"
                aria-label="User menu"
              >
                <img
                  src={userAvatar || "https://api.dicebear.com/9.x/notionists/svg?seed=User"}
                  alt={user?.displayName || "User"}
                  className="w-full h-full object-cover bg-muted"
                />
              </motion.button>
              <UserMenu
                open={userMenuOpen}
                onClose={() => setUserMenuOpen(false)}
                onLogout={logout}
              />
            </div>
          ) : (
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => setAuthModalOpen(true)}
              className="hidden sm:flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-full text-sm font-semibold shadow-sm hover:opacity-90 transition-opacity"
            >
              <Bell size={13} />
              Subscribe
            </motion.button>
          )}

          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="sm:hidden w-9 h-9 rounded-full flex items-center justify-center bg-white/40 dark:bg-white/5 border border-white/30 dark:border-white/10"
            aria-label="Toggle menu"
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={mobileMenuOpen ? "x" : "menu"}
                initial={{ opacity: 0, rotate: -20 }}
                animate={{ opacity: 1, rotate: 0 }}
                exit={{ opacity: 0, rotate: 20 }}
                transition={{ duration: 0.15 }}
              >
                {mobileMenuOpen ? <X size={17} /> : <Menu size={17} />}
              </motion.div>
            </AnimatePresence>
          </motion.button>
        </div>
      </div>

      {/* Mobile dropdown */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
            className="sm:hidden overflow-hidden border-t border-white/20 dark:border-white/10 px-4 py-3 space-y-2"
          >
            {isLoggedIn ? (
              <>
                <button
                  onClick={() => { navigate("/profile"); setMobileMenuOpen(false); }}
                  className="flex items-center gap-3 px-2 py-2 w-full"
                >
                  <img
                    src={userAvatar || "https://api.dicebear.com/9.x/notionists/svg?seed=User"}
                    alt={user?.displayName || "User"}
                    className="w-8 h-8 rounded-full border border-primary/50 bg-muted object-cover"
                  />
                  <div className="text-left">
                    <p className="text-sm font-semibold text-foreground">{user?.displayName || "User"}</p>
                    <p className="text-xs text-muted-foreground">{user?.email || ""}</p>
                  </div>
                </button>
                <button
                  onClick={() => { logout(); setMobileMenuOpen(false); }}
                  className="w-full text-center text-sm text-destructive py-2 hover:bg-destructive/10 rounded-xl transition-colors"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <button
                onClick={() => { setAuthModalOpen(true); setMobileMenuOpen(false); }}
                className="w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground px-4 py-2.5 rounded-full text-sm font-semibold"
              >
                <Bell size={14} />
                Subscribe to The Daily Byte
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
