import { Outlet } from "react-router-dom";
import { useTheme } from "../../context/ThemeContext";

export default function PortfolioLayout() {
  const { portfolioTheme } = useTheme();

  return (
    <div
      className={`min-h-screen ${
        portfolioTheme === "dark" ? "bg-gray-950 text-white" : "bg-white text-gray-900"
      }`}
    >
      <Outlet />
    </div>
  );
}
