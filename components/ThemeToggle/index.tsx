"use client";

import { useEffect, useState } from "react";
import { Moon, Sun, Monitor } from "lucide-react";

type Theme = "light" | "dark" | "system";

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>("system");

  // Initialize theme from localStorage or default to system
  useEffect(() => {
    const stored = localStorage.getItem("theme") as Theme | null;
    if (stored === "dark" || stored === "light" || stored === "system") {
      setTheme(stored);
      applyTheme(stored);
    } else {
      setTheme("system");
      applyTheme("system");
    }
  }, []);

  const applyTheme = (newTheme: Theme) => {
    if (newTheme === "system") {
      const isDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      document.documentElement.classList.toggle("dark", isDark);
    } else {
      document.documentElement.classList.toggle("dark", newTheme === "dark");
    }
  };

  const toggleTheme = () => {
    const themeOrder: Theme[] = ["light", "dark", "system"];
    const currentIndex = themeOrder.indexOf(theme);
    const newTheme = themeOrder[(currentIndex + 1) % themeOrder.length];
    
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    applyTheme(newTheme);
  };

  const getIcon = () => {
    switch (theme) {
      case "light":
        return <Sun size={20} />;
      case "dark":
        return <Moon size={20} />;
      case "system":
        return <Monitor size={20} />;
    }
  };

  return (
    <button
      onClick={toggleTheme}
      className="p-2 text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50 transition-colors rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800"
      aria-label={`Toggle theme (current: ${theme})`}
      title={`Current theme: ${theme}`}
    >
      {getIcon()}
    </button>
  );
}
