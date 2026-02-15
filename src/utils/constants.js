// Application-wide constants

export const APP_NAME = "GitFolio";
export const APP_TAGLINE = "AI-Powered GitHub Portfolio & Resume Generator";
export const APP_DOMAIN = "gitfolio.in";

// GitHub API
export const GITHUB_API_BASE = "https://api.github.com";

// Gemini API
export const GEMINI_API_BASE = "https://generativelanguage.googleapis.com/v1beta";

// Route paths
export const ROUTES = {
  HOME: "/",
  LOGIN: "/login",
  DASHBOARD: "/dashboard",
  PORTFOLIO: "/portfolio/:username",
  RESUME: "/resume",
};

// Portfolio themes
export const PORTFOLIO_THEMES = {
  MODERN: "modern",
  MINIMALIST: "minimalist",
  COLORFUL: "colorful",
};

// Resume font options
export const RESUME_FONTS = [
  { label: "Inter", value: "'Inter', sans-serif" },
  { label: "Georgia", value: "'Georgia', serif" },
  { label: "Roboto Mono", value: "'Roboto Mono', monospace" },
  { label: "Merriweather", value: "'Merriweather', serif" },
  { label: "Open Sans", value: "'Open Sans', sans-serif" },
];

// Default sections that appear in portfolio
export const DEFAULT_SECTIONS = [
  "hero",
  "about",
  "skills",
  "projects",
  "stats",
  "contact",
];

// Optional sections user can add
export const OPTIONAL_SECTIONS = [
  { id: "education", label: "Education", icon: "FaGraduationCap" },
  { id: "experience", label: "Experience", icon: "FaBriefcase" },
  { id: "achievements", label: "Achievements", icon: "FaTrophy" },
  { id: "certifications", label: "Certifications", icon: "FaCertificate" },
  { id: "custom", label: "Custom Section", icon: "FaPlus" },
];
