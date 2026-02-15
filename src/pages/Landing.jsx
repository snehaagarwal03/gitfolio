import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FaGithub, FaArrowRight } from "react-icons/fa";
import { APP_NAME, APP_TAGLINE } from "../utils/constants";

export default function Landing() {
  return (
    <div className="min-h-screen bg-surface-900 text-text-primary">
      {/* Hero Section */}
      <section className="relative flex min-h-screen flex-col items-center justify-center px-6 text-center">
        {/* Background gradient */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute left-1/2 top-1/4 h-96 w-96 -translate-x-1/2 rounded-full bg-primary/10 blur-3xl" />
          <div className="absolute right-1/4 top-1/2 h-64 w-64 rounded-full bg-secondary/10 blur-3xl" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative z-10 max-w-3xl"
        >
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-surface-500 bg-surface-800 px-4 py-2 text-sm text-text-secondary">
            <FaGithub className="text-lg" />
            <span>Connect your GitHub. Get your portfolio.</span>
          </div>

          <h1 className="mb-6 text-5xl font-bold leading-tight tracking-tight md:text-7xl">
            <span className="text-text-primary">{APP_NAME}</span>
          </h1>

          <p className="mb-4 text-xl text-text-secondary md:text-2xl">
            {APP_TAGLINE}
          </p>

          <p className="mx-auto mb-10 max-w-xl text-base text-text-muted">
            Turn your GitHub profile into a stunning portfolio website and
            professional resume in seconds. Powered by AI.
          </p>

          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              to="/login"
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-8 py-3 text-base font-semibold text-white transition-colors hover:bg-primary-dark"
            >
              Get Started
              <FaArrowRight />
            </Link>
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-lg border border-surface-500 bg-surface-800 px-8 py-3 text-base font-semibold text-text-primary transition-colors hover:bg-surface-700"
            >
              <FaGithub />
              View on GitHub
            </a>
          </div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="px-6 py-24">
        <div className="mx-auto max-w-5xl">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-16 text-center text-3xl font-bold md:text-4xl"
          >
            Everything you need to showcase your work
          </motion.h2>

          <div className="grid gap-8 md:grid-cols-3">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="rounded-xl border border-surface-600 bg-surface-800 p-6"
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-xl text-primary">
                  {feature.icon}
                </div>
                <h3 className="mb-2 text-lg font-semibold">{feature.title}</h3>
                <p className="text-sm text-text-secondary">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

const features = [
  {
    icon: "🚀",
    title: "Instant Portfolio",
    description:
      "Connect your GitHub and get a live portfolio website generated automatically with your projects, skills, and stats.",
  },
  {
    icon: "🤖",
    title: "AI-Enhanced",
    description:
      "Gemini AI polishes your project descriptions, extracts skills, and generates a professional summary from your GitHub data.",
  },
  {
    icon: "📄",
    title: "Resume Builder",
    description:
      "Generate a professional resume from your portfolio data with full customization -- fonts, colors, formatting, and PDF export.",
  },
  {
    icon: "🎨",
    title: "Themes & Modes",
    description:
      "Switch between light and dark mode. Choose from multiple themes to match your personal style.",
  },
  {
    icon: "✏️",
    title: "Custom Sections",
    description:
      "Add education, achievements, experience, and custom sections that aren't on your GitHub profile.",
  },
  {
    icon: "🔗",
    title: "Shareable URL",
    description:
      "Get a clean public URL at gitfolio.in/username that you can share anywhere.",
  },
];
