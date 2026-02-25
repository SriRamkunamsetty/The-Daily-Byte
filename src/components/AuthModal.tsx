import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Mail, Lock, Chrome, Shield } from "lucide-react";
import type { UserRole } from "@/context/AppContext";

interface AuthModalProps {
  open: boolean;
  onClose: () => void;
  onLogin: (role?: UserRole) => void;
}

export default function AuthModal({ open, onClose, onLogin }: AuthModalProps) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [adminMode, setAdminMode] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin(adminMode ? "admin" : "user");
    onClose();
    setAdminMode(false);
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* Modal */}
          <motion.div
            className="relative w-full max-w-md rounded-2xl glass border border-white/20 dark:border-white/10 p-8 shadow-2xl"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
          >
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-white/20 dark:hover:bg-white/10 transition-colors"
              aria-label="Close"
            >
              <X size={16} />
            </button>

            {/* Header */}
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-foreground mb-1">
                {adminMode ? "Admin Login" : isSignUp ? "Create Account" : "Welcome Back"}
              </h2>
              <p className="text-sm text-muted-foreground">
                {adminMode
                  ? "Sign in as CEO / Administrator"
                  : isSignUp
                  ? "Join The Daily Byte for personalized news"
                  : "Sign in to your Daily Byte account"}
              </p>
            </div>

            {/* Admin mode badge */}
            {adminMode && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 justify-center mb-4 px-3 py-2 rounded-xl bg-amber-500/15 border border-amber-400/30 text-amber-600 dark:text-amber-300 text-xs font-semibold"
              >
                <Shield size={14} />
                Administrator Access
              </motion.div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="relative">
                <Mail
                  size={16}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground"
                />
                <input
                  type="email"
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/50 dark:bg-white/5 border border-white/30 dark:border-white/10 text-foreground placeholder:text-muted-foreground text-sm outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all"
                  required
                />
              </div>

              <div className="relative">
                <Lock
                  size={16}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground"
                />
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/50 dark:bg-white/5 border border-white/30 dark:border-white/10 text-foreground placeholder:text-muted-foreground text-sm outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all"
                  required
                />
              </div>

              <motion.button
                type="submit"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`w-full py-3 rounded-xl font-semibold text-sm shadow-md hover:opacity-90 transition-opacity ${
                  adminMode
                    ? "bg-amber-500 text-white"
                    : "bg-primary text-primary-foreground"
                }`}
              >
                {adminMode ? "Sign In as Admin" : isSignUp ? "Create Account" : "Sign In"}
              </motion.button>
            </form>

            {/* Divider */}
            <div className="flex items-center gap-3 my-6">
              <div className="flex-1 h-px bg-white/20 dark:bg-white/10" />
              <span className="text-xs text-muted-foreground">or</span>
              <div className="flex-1 h-px bg-white/20 dark:bg-white/10" />
            </div>

            {/* Google */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                onLogin(adminMode ? "admin" : "user");
                onClose();
                setAdminMode(false);
              }}
              className="w-full py-3 rounded-xl bg-white/60 dark:bg-white/10 border border-white/30 dark:border-white/10 text-foreground font-medium text-sm flex items-center justify-center gap-2 hover:bg-white/80 dark:hover:bg-white/15 transition-colors"
            >
              <Chrome size={16} />
              Continue with Google
            </motion.button>

            {/* Toggle + Admin shortcut */}
            <div className="mt-6 space-y-2">
              <p className="text-center text-sm text-muted-foreground">
                {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
                <button
                  onClick={() => setIsSignUp(!isSignUp)}
                  className="text-primary font-semibold hover:underline"
                >
                  {isSignUp ? "Sign in" : "Sign up"}
                </button>
              </p>

              {/* Hidden admin toggle — triple-click or direct button */}
              <button
                onClick={() => setAdminMode(!adminMode)}
                className="mx-auto flex items-center gap-1.5 text-[11px] text-muted-foreground/50 hover:text-muted-foreground transition-colors"
              >
                <Shield size={10} />
                {adminMode ? "Switch to User Login" : "Admin Login"}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
