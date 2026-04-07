import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FiEdit3, FiCheck, FiPlus, FiArrowLeft, FiFileText, FiTrash2 } from "react-icons/fi";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import {
  getPortfolioByUsername,
  getPortfolioSections,
  updatePortfolioSection,
  addPortfolioSection,
  deletePortfolioSection,
} from "../../services/firestore";
import { uploadImage } from "../../services/cloudinary";
import ThemeToggle from "../../components/ui/ThemeToggle";
import LoadingSpinner from "../../components/ui/LoadingSpinner";
import PortfolioSection from "../../components/portfolio/PortfolioSection";
import AddSectionModal from "../../components/portfolio/AddSectionModal";

export default function PortfolioPage() {
  const { username } = useParams();
  const { user } = useAuth();
  const { portfolioTheme } = useTheme();

  const [portfolio, setPortfolio] = useState(null);
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [showAddSection, setShowAddSection] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadPortfolio() {
      try {
        const data = await getPortfolioByUsername(username);
        if (!data || !user || data.userId !== user.uid) {
          setError("Portfolio not found or unauthorized");
          return;
        }
        setPortfolio(data);
        const sectionData = await getPortfolioSections(data.id);
        const sorted = sectionData.sort((a, b) => (a.order || 0) - (b.order || 0));
        setSections(sorted);
      } catch {
        setError("Failed to load portfolio");
      } finally {
        setLoading(false);
      }
    }
    loadPortfolio();
  }, [username, user]);

  async function handleSectionUpdate(sectionId, newContent) {
    try {
      await updatePortfolioSection(sectionId, newContent);
      setSections((prev) =>
        prev.map((s) => (s.id === sectionId ? { ...s, ...newContent } : s))
      );
    } catch (err) {
      console.error("Failed to update section:", err);
    }
  }

  async function handleAddSection(sectionData) {
    try {
      const newSection = await addPortfolioSection(portfolio.id, {
        ...sectionData,
        order: sections.length + 1,
        source: "manual",
      });
      setSections((prev) => [...prev, newSection]);
      setShowAddSection(false);
    } catch (err) {
      console.error("Failed to add section:", err);
    }
  }

  async function handleDeleteSection(sectionId) {
    try {
      await deletePortfolioSection(sectionId);
      setSections((prev) => prev.filter((s) => s.id !== sectionId));
    } catch (err) {
      console.error("Failed to delete section:", err);
    }
  }

  async function handleImageUpload(file) {
    try {
      const url = await uploadImage(file);
      await updatePortfolioSection(sections[0]?.id, {
        content: { ...sections[0]?.content, image: url },
      });
      setSections((prev) =>
        prev.map((s, i) =>
          i === 0 ? { ...s, content: { ...s.content, image: url } } : s
        )
      );
    } catch (err) {
      console.error("Image upload failed:", err);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#030712]">
        <div className="text-center flex flex-col items-center">
          <LoadingSpinner size="xl" />
          <p className="mt-6 text-slate-500 text-sm font-medium animate-pulse">Loading portfolio...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#030712]">
        <div className="text-center p-10">
          <h1 className="text-5xl font-black gradient-text mb-3">404</h1>
          <p className="text-slate-400 mb-6">{error}</p>
          <Link to="/dashboard" className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-gray-900 font-bold text-sm rounded-xl transition-all">
            <FiArrowLeft size={16} /> Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  const isDark = portfolioTheme === "dark";

  return (
    <div className={`min-h-screen transition-colors duration-500 relative ${isDark ? "bg-[#030712] text-white" : "bg-gray-50 text-gray-900"}`}>
      {/* Floating Editor Toolbar */}
      <motion.div
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 260, damping: 30 }}
        className="fixed top-4 inset-x-0 z-50 pointer-events-none flex justify-center px-4"
      >
        <div className="pointer-events-auto glass-strong rounded-2xl px-3 py-2 flex items-center gap-2 sm:gap-4 w-full max-w-2xl shadow-2xl">
          <Link
            to="/dashboard"
            className="flex items-center justify-center w-9 h-9 rounded-lg hover:bg-white/[0.06] text-slate-400 hover:text-white transition-colors shrink-0"
            title="Back to Dashboard"
          >
            <FiArrowLeft size={16} />
          </Link>

          <div className="h-5 w-px bg-white/[0.06] hidden sm:block" />

          <div className="flex-1 flex items-center min-w-0">
            <span className="text-sm font-semibold text-white truncate hidden sm:block">
              {username}&apos;s <span className="text-emerald-400">Portfolio</span>
            </span>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            <ThemeToggle />

            <Link to={`/${username}/resume`}>
              <button className="flex items-center gap-1.5 px-3 py-2 bg-white/[0.04] hover:bg-white/[0.08] text-slate-300 text-xs font-medium rounded-lg border border-white/[0.06] transition-colors">
                <FiFileText size={13} className="hidden sm:block" /> Resume
              </button>
            </Link>

            <button
              onClick={() => setEditMode(!editMode)}
              className={`flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-lg transition-all ${
                editMode
                  ? "bg-emerald-500 hover:bg-emerald-400 text-gray-900"
                  : "bg-white/[0.06] hover:bg-white/[0.1] text-white border border-white/[0.06]"
              }`}
            >
              {editMode ? <><FiCheck size={14} /> Done</> : <><FiEdit3 size={14} /> Edit</>}
            </button>
          </div>
        </div>
      </motion.div>

      {/* Main Portfolio Content */}
      <div className="pt-28 pb-24 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto relative z-10">
        <div className="space-y-20">
          <AnimatePresence>
            {sections.map((section, index) => (
              <motion.div
                key={section.id}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.08 }}
                className="relative group"
              >
                <PortfolioSection
                  section={section}
                  editMode={editMode}
                  onUpdate={(content) => handleSectionUpdate(section.id, content)}
                  onDelete={() => handleDeleteSection(section.id)}
                  onImageUpload={section.type === "hero" ? handleImageUpload : null}
                  isDark={isDark}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        <AnimatePresence>
          {editMode && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-16 pt-8 border-t border-white/[0.04] flex justify-center"
            >
              <button
                onClick={() => setShowAddSection(true)}
                className="flex items-center gap-2 px-6 py-3 bg-slate-900/50 hover:bg-slate-800 text-emerald-400 hover:text-emerald-300 font-semibold text-sm rounded-xl border-2 border-dashed border-white/[0.08] hover:border-emerald-500/30 transition-all"
              >
                <FiPlus size={18} /> Add New Section
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {showAddSection && (
        <AddSectionModal
          onAdd={handleAddSection}
          onClose={() => setShowAddSection(false)}
        />
      )}
    </div>
  );
}
