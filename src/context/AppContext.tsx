import { createContext, useContext, useState, useCallback, type ReactNode } from "react";
import type { NewsItem } from "@/components/NewsCard";

interface AppContextValue {
  isLoggedIn: boolean;
  login: () => void;
  logout: () => void;
  favorites: Set<number>;
  toggleFavorite: (id: number) => boolean; // returns false if not logged in
  authModalOpen: boolean;
  setAuthModalOpen: (v: boolean) => void;
  darkMode: boolean;
  toggleDark: () => void;
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
  const [favorites, setFavorites] = useState<Set<number>>(new Set());
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  const login = useCallback(() => setIsLoggedIn(true), []);
  const logout = useCallback(() => {
    setIsLoggedIn(false);
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

  return (
    <AppContext.Provider
      value={{
        isLoggedIn,
        login,
        logout,
        favorites,
        toggleFavorite,
        authModalOpen,
        setAuthModalOpen,
        darkMode,
        toggleDark,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}
