import { createContext, useContext, useEffect, useState } from "react";
import { setupStatusBar } from "@/lib/capacitor";

type Theme = "dark";

interface ThemeProviderProps {
  children: React.ReactNode;
}

interface ThemeContextValue {
  theme: Theme;
  actualTheme: "dark";
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export function ThemeProvider({ children }: ThemeProviderProps) {
  const [theme] = useState<Theme>("dark");
  const [actualTheme] = useState<"dark">("dark");

  useEffect(() => {
    const root = document.documentElement;
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    
    // Force dark mode
    root.classList.add("dark");
    metaThemeColor?.setAttribute("content", "#a855f7");
    
    setupStatusBar().catch(console.error);
  }, []);

  const setTheme = (newTheme: Theme) => {
    // Theme is always dark, no changes possible
  };

  return (
    <ThemeContext.Provider value={{ theme, actualTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
