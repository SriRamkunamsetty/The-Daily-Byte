import { useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bookmark,
  SlidersHorizontal,
  Sun,
  Moon,
  Bell,
  LogOut,
  User,
} from "lucide-react";
import { useApp, MOCK_USER } from "@/context/AppContext";

interface UserMenuProps {
  open: boolean;
  onClose: () => void;
  onLogout: () => void;
}

export default function UserMenu({ open, onClose, onLogout }: UserMenuProps) {
  const { darkMode, toggleDark } = useApp();
  const ref = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        onClose();
      }
    };
    if (open) document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open, onClose]);

  const menuItems = [
    { icon: User, label: "My Profile", onClick: () => navigate("/profile") },
    { icon: Bookmark, label: "Saved Articles", onClick: () => navigate("/profile") },
    { icon: SlidersHorizontal, label: "Manage Categories", onClick: () => {} },
    {
      icon: darkMode ? Sun : Moon,
      label: `Theme: ${darkMode ? "Light" : "Dark"}`,
      onClick: toggleDark,
      keepOpen: true,
    },
    { icon: Bell, label: "Manage Alerts", onClick: () => {} },
  ];

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          ref={ref}
          initial={{ opacity: 0, scale: 0.92, y: -8 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: -8 }}
          transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
          className="absolute right-0 top-full mt-2 w-64 rounded-2xl glass border border-white/20 dark:border-white/10 shadow-2xl overflow-hidden z-[60]"
        >
          {/* User info header */}
          <div className="px-4 py-3.5">
            <p className="text-sm font-semibold text-foreground truncate">
              {MOCK_USER.name}
            </p>
            <p className="text-xs text-muted-foreground truncate">
              {MOCK_USER.email}
            </p>
          </div>

          <div className="h-px bg-white/10 dark:bg-white/5" />

          {/* Menu items */}
          <div className="py-1.5">
            {menuItems.map(({ icon: Icon, label, onClick, keepOpen }) => (
              <button
                key={label}
                onClick={() => {
                  onClick();
                  if (keepOpen) return;
                  onClose();
                }}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-foreground hover:bg-white/20 dark:hover:bg-white/10 transition-colors"
              >
                <Icon size={16} className="text-muted-foreground shrink-0" />
                {label}
              </button>
            ))}
          </div>

          <div className="h-px bg-white/10 dark:bg-white/5" />

          {/* Sign out */}
          <div className="py-1.5">
            <button
              onClick={() => {
                onLogout();
                onClose();
              }}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-destructive hover:bg-destructive/10 transition-colors"
            >
              <LogOut size={16} className="shrink-0" />
              Sign Out
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
