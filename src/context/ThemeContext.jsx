import { createContext, useContext, useState, useCallback } from "react";
import { THEMES } from "../constants";

const ThemeContext = createContext(null);

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}

export function ThemeProvider({ children }) {
  const [portfolioTheme, setPortfolioTheme] = useState(THEMES.DARK);
  const [portfolioColorScheme, setPortfolioColorScheme] = useState("default");

  const togglePortfolioTheme = useCallback(() => {
    setPortfolioTheme((prev) =>
      prev === THEMES.DARK ? THEMES.LIGHT : THEMES.DARK
    );
  }, []);

  const changeColorScheme = useCallback((scheme) => {
    setPortfolioColorScheme(scheme);
  }, []);

  return (
    <ThemeContext.Provider
      value={{
        portfolioTheme,
        portfolioColorScheme,
        togglePortfolioTheme,
        changeColorScheme,
        setPortfolioTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}
