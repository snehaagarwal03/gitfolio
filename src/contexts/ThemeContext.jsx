import { createContext, useContext, useState, useEffect } from "react";

const ThemeContext = createContext(null);

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}

/**
 * ThemeProvider manages light/dark mode for portfolio and resume pages.
 * The main GitFolio website is always dark-themed.
 * Portfolio pages support light/dark toggle.
 * Resume page UI supports light/dark toggle, but the resume paper is always white.
 */
export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem("gitfolio-theme");
    return saved || "dark";
  });

  useEffect(() => {
    localStorage.setItem("gitfolio-theme", theme);

    // Apply theme class to document for portfolio/resume pages
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
      document.documentElement.classList.remove("light");
    } else {
      document.documentElement.classList.add("light");
      document.documentElement.classList.remove("dark");
    }
  }, [theme]);

  function toggleTheme() {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  }

  const value = {
    theme,
    setTheme,
    toggleTheme,
    isDark: theme === "dark",
  };

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}
