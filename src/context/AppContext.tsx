import { createContext, useContext, useState, useCallback, type ReactNode } from "react";
import type { NewsItem } from "@/components/NewsCard";

export type UserRole = "user" | "admin";

interface AppContextValue {
  isLoggedIn: boolean;
  role: UserRole;
  login: (role?: UserRole) => void;
  logout: () => void;
  favorites: Set<number>;
  toggleFavorite: (id: number) => boolean;
  authModalOpen: boolean;
  setAuthModalOpen: (v: boolean) => void;
  darkMode: boolean;
  toggleDark: () => void;
  userPosts: NewsItem[];
  addPost: (post: NewsItem) => void;
}

const AppContext = createContext<AppContextValue | null>(null);

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}

export const MOCK_USER = {
  name: "Mohan SriRam Kunamsetty",
  email: "mohan.sriram@dailybyte.com",
  avatar: "https://api.dicebear.com/9.x/notionists/svg?seed=Mohan",
};

export function AppProvider({ children }: { children: ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [role, setRole] = useState<UserRole>("user");
  const [favorites, setFavorites] = useState<Set<number>>(new Set());
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [userPosts, setUserPosts] = useState<NewsItem[]>([]);

  const login = useCallback((r: UserRole = "user") => {
    setIsLoggedIn(true);
    setRole(r);
  }, []);

  const logout = useCallback(() => {
    setIsLoggedIn(false);
    setRole("user");
    setFavorites(new Set());
  }, []);

  const toggleFavorite = useCallback(
    (id: number) => {
      if (!isLoggedIn) {
        setAuthModalOpen(true);
        return false;
      }
      setFavorites((prev) => {
        const next = new Set(prev);
        if (next.has(id)) next.delete(id);
        else next.add(id);
        return next;
      });
      return true;
    },
    [isLoggedIn]
  );

  const toggleDark = useCallback(() => {
    setDarkMode((d) => {
      document.documentElement.classList.toggle("dark", !d);
      return !d;
    });
  }, []);

  const addPost = useCallback((post: NewsItem) => {
    setUserPosts((prev) => [post, ...prev]);
  }, []);

  return (
    <AppContext.Provider
      value={{
        isLoggedIn,
        role,
        login,
        logout,
        favorites,
        toggleFavorite,
        authModalOpen,
        setAuthModalOpen,
        darkMode,
        toggleDark,
        userPosts,
        addPost,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}
