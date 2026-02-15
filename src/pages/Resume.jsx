import { motion } from "framer-motion";
import { useTheme } from "../contexts/ThemeContext";
import { FaSun, FaMoon, FaDownload, FaBold, FaItalic, FaLink } from "react-icons/fa";
import Navbar from "../components/common/Navbar";

export default function Resume() {
  const { toggleTheme, isDark } = useTheme();

  // TODO: Implement full resume editor with state management
  // This is the page shell with layout structure

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${
        isDark ? "bg-surface-900" : "bg-gray-100"
      }`}
    >
      <Navbar />

      <main className="px-6 pt-24 pb-16">
        <div className="mx-auto max-w-6xl">
          {/* Toolbar */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className={`mb-6 flex flex-wrap items-center justify-between gap-4 rounded-xl border p-4 ${
              isDark
                ? "border-surface-600 bg-surface-800"
                : "border-gray-200 bg-white"
            }`}
          >
            <div className="flex items-center gap-2">
              <h1
                className={`text-lg font-bold ${isDark ? "text-text-primary" : "text-gray-900"}`}
              >
                Resume Editor
              </h1>
            </div>

            <div className="flex items-center gap-2">
              {/* Text formatting controls */}
              <button
                className={`rounded-lg p-2 transition-colors ${
                  isDark
                    ? "text-text-secondary hover:bg-surface-700 hover:text-text-primary"
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                }`}
                title="Bold"
              >
                <FaBold />
              </button>
              <button
                className={`rounded-lg p-2 transition-colors ${
                  isDark
                    ? "text-text-secondary hover:bg-surface-700 hover:text-text-primary"
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                }`}
                title="Italic"
              >
                <FaItalic />
              </button>
              <button
                className={`rounded-lg p-2 transition-colors ${
                  isDark
                    ? "text-text-secondary hover:bg-surface-700 hover:text-text-primary"
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                }`}
                title="Add Link"
              >
                <FaLink />
              </button>

              <div
                className={`mx-2 h-6 w-px ${isDark ? "bg-surface-600" : "bg-gray-200"}`}
              />

              {/* Theme toggle */}
              <button
                onClick={toggleTheme}
                className={`rounded-lg p-2 transition-colors ${
                  isDark
                    ? "text-yellow-400 hover:bg-surface-700"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
                title={`Switch to ${isDark ? "light" : "dark"} mode`}
              >
                {isDark ? <FaSun /> : <FaMoon />}
              </button>

              {/* Download PDF */}
              <button className="ml-2 inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-dark">
                <FaDownload />
                Download PDF
              </button>
            </div>
          </motion.div>

          {/* Resume Paper -- always white */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mx-auto max-w-[816px] rounded-lg bg-white p-12 shadow-xl"
            style={{
              minHeight: "1056px", // Standard letter paper ratio
            }}
          >
            {/* Resume Content - always white background, dark text */}
            <div className="text-gray-900">
              {/* Header */}
              <div className="mb-6 border-b-2 border-gray-800 pb-4 text-center">
                <h2 className="text-3xl font-bold">
                  {/* TODO: Populate with user name */}
                  Your Name
                </h2>
                <p className="mt-1 text-sm text-gray-600">
                  {/* TODO: Populate with contact info */}
                  email@example.com | github.com/username | Location
                </p>
              </div>

              {/* Summary */}
              <div className="mb-6">
                <h3 className="mb-2 text-lg font-bold text-gray-800">
                  Summary
                </h3>
                <p className="text-sm leading-relaxed text-gray-700">
                  {/* TODO: AI-generated summary */}
                  Your professional summary will be generated from your GitHub
                  profile and projects using AI.
                </p>
              </div>

              {/* Skills */}
              <div className="mb-6">
                <h3 className="mb-2 text-lg font-bold text-gray-800">
                  Technical Skills
                </h3>
                <p className="text-sm text-gray-700">
                  {/* TODO: Populate from extracted skills */}
                  Skills will be auto-populated from your GitHub repositories.
                </p>
              </div>

              {/* Projects */}
              <div className="mb-6">
                <h3 className="mb-2 text-lg font-bold text-gray-800">
                  Projects
                </h3>
                {/* TODO: Populate from GitHub repos */}
                <div className="space-y-3">
                  <div>
                    <h4 className="text-sm font-semibold">Project Name</h4>
                    <p className="text-sm text-gray-600">
                      Project description generated by AI.
                    </p>
                  </div>
                </div>
              </div>

              {/* Education placeholder */}
              <div className="mb-6">
                <h3 className="mb-2 text-lg font-bold text-gray-800">
                  Education
                </h3>
                <p className="text-sm text-gray-600">
                  Add your education details to populate this section.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
