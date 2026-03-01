import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from "react";
import type { NewsItem } from "@/components/NewsCard";
import { useShake } from "@/hooks/useShake";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged, signOut, type User } from "firebase/auth";
import { getUserRole, getUserFavorites, toggleFavoriteInDb } from "@/lib/api";

export type UserRole = "user" | "admin";

interface AppContextValue {
  isLoggedIn: boolean;
  user: User | null;
  role: UserRole;
  login: (role?: UserRole) => void;
  logout: () => Promise<void>;
  favorites: Set<string>;
  toggleFavorite: (id: string) => Promise<boolean>;
  authModalOpen: boolean;
  setAuthModalOpen: (v: boolean) => void;
  darkMode: boolean;
  toggleDark: () => void;
  userPosts: NewsItem[];
  addPost: (post: NewsItem) => void;
  antigravity: boolean;
  toggleAntigravity: () => void;
  isMuted: boolean;
  toggleMute: () => void;
  userAvatar: string | null;
  updateUserAvatar: (url: string | null) => void;
}

const AppContext = createContext<AppContextValue | null>(null);

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<UserRole>("user");
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [userPosts, setUserPosts] = useState<NewsItem[]>([]);
  const [antigravity, setAntigravity] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [userAvatar, setUserAvatarState] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setIsLoggedIn(true);
        setUser(firebaseUser);
        setUserAvatarState(localStorage.getItem('userAvatar') || firebaseUser.photoURL || null);
        const userRole = await getUserRole(firebaseUser.uid);
        setRole(userRole);
        const favs = await getUserFavorites(firebaseUser.uid);
        setFavorites(favs);
      } else {
        setIsLoggedIn(false);
        setUser(null);
        setUserAvatarState(null);
        setRole("user");
        setFavorites(new Set());
      }
    });

    return () => unsubscribe();
  }, []);

  const login = useCallback((r: UserRole = "user") => {
    console.warn("Deprecated local login called. Use Firebase auth UI.");
  }, []);

  const logout = useCallback(async () => {
    await signOut(auth);
  }, []);

  const toggleFavorite = useCallback(
    async (id: string) => {
      if (!auth.currentUser) {
        setAuthModalOpen(true);
        return false;
      }

      const isCurrentlyFav = favorites.has(id);
      setFavorites((prev) => {
        const next = new Set(prev);
        if (next.has(id)) next.delete(id);
        else next.add(id);
        return next;
      });

      try {
        await toggleFavoriteInDb(auth.currentUser.uid, id, isCurrentlyFav);
      } catch (err) {
        console.error("Failed to toggle favorite:", err);
        setFavorites((prev) => {
          const next = new Set(prev);
          if (isCurrentlyFav) next.add(id);
          else next.delete(id);
          return next;
        });
      }

      return true;
    },
    [favorites]
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

  const toggleAntigravity = useCallback(() => {
    setAntigravity((v) => !v);
  }, []);

  const toggleMute = useCallback(() => {
    setIsMuted((v) => !v);
  }, []);

  const updateUserAvatar = useCallback((url: string | null) => {
    setUserAvatarState(url);
    if (url) {
      localStorage.setItem('userAvatar', url);
    } else {
      localStorage.removeItem('userAvatar');
    }
  }, []);

  useShake(toggleAntigravity);

  return (
    <AppContext.Provider
      value={{
        isLoggedIn,
        user,
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
        antigravity,
        toggleAntigravity,
        isMuted,
        toggleMute,
        userAvatar,
        updateUserAvatar,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}
