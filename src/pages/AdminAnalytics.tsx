import { motion } from "framer-motion";
import { BarChart3, Eye, TrendingUp, Users } from "lucide-react";

const stats = [
  { icon: Eye, label: "Total Views", value: "1.2M", change: "+12.4%" },
  { icon: Users, label: "Subscribers", value: "48.3K", change: "+5.2%" },
  { icon: TrendingUp, label: "Engagement Rate", value: "68%", change: "+3.1%" },
  { icon: BarChart3, label: "Articles Published", value: "142", change: "+8" },
];

export default function AdminAnalytics() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
    >
      <h1 className="text-2xl font-bold text-foreground mb-8" style={{ fontFamily: "Georgia, serif" }}>
        Analytics
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        {stats.map(({ icon: Icon, label, value, change }, idx) => (
          <motion.div
            key={label}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.08 }}
            className="glass rounded-2xl p-5"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <Icon size={20} className="text-primary" />
              </div>
              <span className="text-xs text-muted-foreground font-medium">{label}</span>
            </div>
            <p className="text-2xl font-bold text-foreground">{value}</p>
            <p className="text-xs text-emerald-500 font-medium mt-1">{change}</p>
          </motion.div>
        ))}
      </div>

      <div className="glass rounded-2xl p-8 text-center">
        <BarChart3 size={48} className="text-muted-foreground/30 mx-auto mb-4" />
        <p className="text-muted-foreground text-sm">
          Detailed charts and analytics coming soon.
        </p>
      </div>
    </motion.div>
  );
}
