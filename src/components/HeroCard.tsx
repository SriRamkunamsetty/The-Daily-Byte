import { Clock, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import heroImg from "@/assets/hero-news.jpg";

export default function HeroCard() {
  const navigate = useNavigate();

  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
      className="relative w-full overflow-hidden rounded-3xl cursor-pointer"
      style={{ minHeight: "460px" }}
      onClick={() => navigate("/article/1")}
    >
      {/* Background image */}
      <img
        src={heroImg}
        alt="Breaking news: Global leaders convene emergency summit on AI governance"
        className="absolute inset-0 w-full h-full object-cover"
        loading="eager"
      />

      {/* Gradient overlay */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to top, hsl(215 25% 5% / 0.97) 0%, hsl(215 25% 8% / 0.60) 50%, hsl(215 25% 8% / 0.05) 100%)",
        }}
      />

      {/* Glass accent bar on top */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />

      {/* Content */}
      <div
        className="relative flex flex-col justify-end h-full p-6 md:p-10"
        style={{ minHeight: "460px" }}
      >
        {/* Breaking badge */}
        <div className="flex items-center gap-2 mb-4">
          <motion.span
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, type: "spring", stiffness: 300 }}
            className="flex items-center gap-1.5 bg-red-600/90 backdrop-blur-sm text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider border border-red-400/30"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-white inline-block animate-pulse" />
            Breaking News
          </motion.span>
        </div>

        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.5 }}
          className="text-white text-2xl md:text-4xl font-bold leading-tight mb-3 max-w-3xl"
        >
          Global Leaders Convene Emergency Summit on AI Governance as Autonomous Agents Reshape Industries
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.25, duration: 0.5 }}
          className="text-gray-300 text-sm md:text-base mb-5 max-w-2xl leading-relaxed line-clamp-2"
        >
          World leaders and tech executives gathered in Geneva for an unprecedented summit, addressing the rapid proliferation of AI agents in critical infrastructure, financial systems, and public services worldwide.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.4 }}
          className="flex items-center justify-between flex-wrap gap-4"
        >
          <div className="flex items-center gap-4 text-gray-400 text-sm">
            <span className="flex items-center gap-1.5">
              <Clock size={14} />
              2 hours ago
            </span>
            <span className="text-blue-400 font-medium bg-blue-500/10 px-2.5 py-0.5 rounded-full border border-blue-400/20 text-xs backdrop-blur-sm">
              AI Agents
            </span>
          </div>
          <motion.span
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            className="flex items-center gap-2 bg-white/15 hover:bg-white/25 backdrop-blur-md text-white border border-white/25 px-5 py-2.5 rounded-full text-sm font-semibold transition-colors duration-200"
          >
            Read Full Story
            <ArrowRight size={14} />
          </motion.span>
        </motion.div>
      </div>
    </motion.article>
  );
}
