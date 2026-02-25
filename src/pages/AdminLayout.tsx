import { useEffect } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { LayoutDashboard, PlusCircle, BarChart3, FileText, ArrowLeft } from "lucide-react";
import { useApp, MOCK_USER } from "@/context/AppContext";

const sidebarItems = [
  { icon: FileText, label: "All Posts", path: "/admin" },
  { icon: PlusCircle, label: "Create New Post", path: "/admin/create" },
  { icon: BarChart3, label: "Analytics", path: "/admin/analytics" },
];

export default function AdminLayout() {
  const { isLoggedIn, role } = useApp();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!isLoggedIn || role !== "admin") {
      navigate("/", { replace: true });
    }
  }, [isLoggedIn, role, navigate]);

  if (!isLoggedIn || role !== "admin") return null;

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <motion.aside
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="w-64 shrink-0 glass-nav border-r border-white/15 dark:border-white/8 flex flex-col sticky top-0 h-screen"
      >
        {/* Brand */}
        <div className="px-5 py-5 border-b border-white/10 dark:border-white/5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500 flex items-center justify-center shadow-sm">
              <LayoutDashboard size={18} className="text-white" />
            </div>
            <div>
              <p className="font-bold text-sm text-foreground">CEO Dashboard</p>
              <p className="text-[11px] text-muted-foreground">The Daily Byte</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <img
              src={MOCK_USER.avatar}
              alt={MOCK_USER.name}
              className="w-7 h-7 rounded-full border border-amber-400/50 bg-muted"
            />
            <p className="text-xs text-muted-foreground truncate">{MOCK_USER.name}</p>
          </div>
        </div>

        {/* Nav items */}
        <nav className="flex-1 py-4 px-3 space-y-1">
          {sidebarItems.map(({ icon: Icon, label, path }) => {
            const active = location.pathname === path;
            return (
              <button
                key={path}
                onClick={() => navigate(path)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                  active
                    ? "bg-primary/15 text-primary"
                    : "text-muted-foreground hover:text-foreground hover:bg-white/15 dark:hover:bg-white/5"
                }`}
              >
                <Icon size={18} />
                {label}
              </button>
            );
          })}
        </nav>

        {/* Back to site */}
        <div className="px-3 py-4 border-t border-white/10 dark:border-white/5">
          <button
            onClick={() => navigate("/")}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-muted-foreground hover:text-foreground hover:bg-white/15 dark:hover:bg-white/5 transition-colors"
          >
            <ArrowLeft size={18} />
            Back to Site
          </button>
        </div>
      </motion.aside>

      {/* Main content */}
      <main className="flex-1 p-8 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}
