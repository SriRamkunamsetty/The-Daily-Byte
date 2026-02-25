import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { PlusCircle, Clock, ExternalLink } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { ALL_NEWS } from "@/data/news";
import { useApp } from "@/context/AppContext";

export default function AdminPosts() {
  const navigate = useNavigate();
  const { userPosts } = useApp();

  const allPosts = useMemo(() => [...userPosts, ...ALL_NEWS], [userPosts]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
    >
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-foreground" style={{ fontFamily: "Georgia, serif" }}>
            All Posts
          </h1>
          <p className="text-sm text-muted-foreground mt-1">{allPosts.length} total articles</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => navigate("/admin/create")}
          className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary text-primary-foreground text-sm font-semibold shadow-sm hover:opacity-90 transition-opacity"
        >
          <PlusCircle size={16} />
          New Post
        </motion.button>
      </div>

      <div className="glass rounded-2xl overflow-hidden">
        <div className="grid grid-cols-[1fr_150px_160px_80px] gap-4 px-5 py-3 border-b border-white/10 dark:border-white/5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          <span>Title</span>
          <span>Category</span>
          <span>Published</span>
          <span>View</span>
        </div>

        {allPosts.map((post, idx) => (
          <motion.div
            key={post.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: idx * 0.02 }}
            className="grid grid-cols-[1fr_150px_160px_80px] gap-4 px-5 py-3.5 items-center border-b border-white/5 dark:border-white/3 hover:bg-white/10 dark:hover:bg-white/3 transition-colors"
          >
            <p className="text-sm font-medium text-foreground truncate">{post.title}</p>
            <span className="text-xs text-muted-foreground">{post.category}</span>
            <span className="text-xs text-muted-foreground flex items-center gap-1">
              <Clock size={12} />
              {post.createdAt
                ? formatDistanceToNow(post.createdAt, { addSuffix: true })
                : post.timeAgo}
            </span>
            <button
              onClick={() => navigate(`/article/${post.id}`)}
              className="text-primary hover:text-primary/70 transition-colors"
            >
              <ExternalLink size={16} />
            </button>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
