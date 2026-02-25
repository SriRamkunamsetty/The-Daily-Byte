import { Zap } from "lucide-react";
import { motion } from "framer-motion";

export default function NewsFooter() {
  return (
    <footer className="mt-16 border-t border-white/20 dark:border-white/10 glass-bar">
      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-primary flex items-center justify-center shadow-sm">
              <Zap size={16} className="text-primary-foreground" fill="currentColor" />
            </div>
            <span className="font-bold text-xl tracking-tight">
              The Daily<span className="text-primary"> Byte</span>
            </span>
          </div>

          {/* Links */}
          <nav className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2" aria-label="Footer navigation">
            {["About Us", "Privacy Policy", "Contact"].map((link) => (
              <motion.a
                key={link}
                href="#"
                whileHover={{ y: -1 }}
                className="text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                {link}
              </motion.a>
            ))}
          </nav>
        </div>

        <div className="mt-8 pt-6 border-t border-white/20 dark:border-white/10 text-center">
          <p className="text-muted-foreground text-sm">
            © {new Date().getFullYear()} The Daily Byte. Designed and Developed by{" "}
            <span className="text-foreground font-semibold">Mohan SriRam Kunamsetty</span>.
            All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
