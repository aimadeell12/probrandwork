import { Moon, Sun, Monitor } from "lucide-react";
import { useTheme } from "./theme-provider";

interface ThemeToggleProps {
  className?: string;
}

export function ThemeToggle({ className }: ThemeToggleProps) {
  const { theme, setTheme } = useTheme();

  const cycleTheme = () => {
    if (theme === "light") {
      setTheme("dark");
    } else if (theme === "dark") {
      setTheme("system");
    } else {
      setTheme("light");
    }
  };

  return (
    <button 
      onClick={cycleTheme}
      className={`p-2 rounded-full ${className}`}
      aria-label="Toggle theme"
      data-testid="button-toggle-theme"
    >
      {theme === "light" ? (
        <Moon size={20} />
      ) : theme === "dark" ? (
        <Sun size={20} />
      ) : (
        <Monitor size={20} />
      )}
    </button>
  );
}