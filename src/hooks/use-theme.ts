import { useTheme as useNextTheme } from 'next-themes';

/**
 * Custom hook for accessing and controlling the theme
 * Wraps next-themes' useTheme hook for consistent usage across the application
 */
export function useTheme() {
  const { theme, setTheme, systemTheme, themes, resolvedTheme } = useNextTheme();

  /**
   * Toggle between light and dark themes
   */
  const toggleTheme = () => {
    setTheme(resolvedTheme === 'dark' ? 'light' : 'dark');
  };

  /**
   * Check if the current theme is dark
   */
  const isDarkTheme = resolvedTheme === 'dark';

  return {
    theme,
    setTheme,
    systemTheme,
    themes,
    resolvedTheme,
    toggleTheme,
    isDarkTheme,
  };
}

export default useTheme;
