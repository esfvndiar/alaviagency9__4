import React from "react";
import { useTheme } from "../hooks/use-theme";
import { Moon, Sun } from "lucide-react";

interface ThemeToggleProps {
  className?: string;
}

const ThemeToggle: React.FC<ThemeToggleProps> = ({ className = "" }) => {
  const { resolvedTheme, toggleTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  return (
    <button
      onClick={toggleTheme}
      className={`p-2 rounded-full transition-colors duration-300 ${
        isDark
          ? "bg-zinc-800 text-zinc-200 hover:bg-zinc-700"
          : "bg-zinc-100 text-zinc-800 hover:bg-zinc-200"
      } ${className}`}
      aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
    >
      {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
    </button>
  );
};

export default ThemeToggle;
