export const ROUTES = {
  LANDING: "/",
  LOGIN: "/login",
  DASHBOARD: "/dashboard",
  PORTFOLIO: "/:username",
  RESUME: "/:username/resume",
  NOT_FOUND: "*",
};

export const AUTH_PROVIDERS = {
  GOOGLE: "google",
  GITHUB: "github",
  PASSWORD: "password",
};

export const PORTFOLIO_STATUS = {
  DRAFT: "draft",
  GENERATED: "generated",
  PUBLISHED: "published",
  REGENERATED: "regenerated",
};

export const SECTION_TYPES = {
  HERO: "hero",
  ABOUT: "about",
  SKILLS: "skills",
  PROJECTS: "projects",
  EXPERIENCE: "experience",
  EDUCATION: "education",
  ACHIEVEMENTS: "achievements",
  CONTACT: "contact",
  CUSTOM: "custom",
};

export const THEMES = {
  DARK: "dark",
  LIGHT: "light",
};

export const GITHUB_API = {
  GRAPHQL_URL: "https://api.github.com/graphql",
  REST_BASE_URL: "https://api.github.com",
};

export const GROQ_API = {
  BASE_URL: "https://api.groq.com/openai/v1",
  CHAT_COMPLETIONS: "/chat/completions",
  DEFAULT_MODEL: "llama-3.3-70b-versatile",
};

export const FIRESTORE_COLLECTIONS = {
  USERS: "users",
  PORTFOLIOS: "portfolios",
  PORTFOLIO_SECTIONS: "portfolio_sections",
  RESUME_CONFIGS: "resume_configs",
  GENERATED_ASSETS: "generated_assets",
  GENERATION_HISTORY: "generation_history",
  LINKED_ACCOUNTS: "linked_accounts",
};

export const CLOUDINARY = {
  UPLOAD_URL: `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`,
  UPLOAD_PRESET: import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET,
};
