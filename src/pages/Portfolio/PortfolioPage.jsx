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
      <div className="min-h-screen flex items-center justify-center bg-[#02040a]">
        <div className="text-center flex flex-col items-center">
          <LoadingSpinner size="xl" />
          <p className="mt-6 text-gray-400 font-medium animate-pulse">Initializing Portfolio Engine...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#02040a]">
        <div className="text-center bg-gray-900/50 p-12 rounded-3xl border border-gray-800">
          <h1 className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-500 mb-4">404</h1>
          <p className="text-gray-400 mb-8 text-lg">{error}</p>
          <Link to="/dashboard" className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-500 hover:bg-emerald-400 text-gray-900 font-bold rounded-xl transition-all">
            <FiArrowLeft /> Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  const isDark = portfolioTheme === "dark";

  return (
    <div className={`min-h-screen transition-colors duration-500 relative ${isDark ? "bg-[#02040a] text-white" : "bg-gray-50 text-gray-900"}`}>
      {/* Floating Editor Controls */}
      <motion.div 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="fixed top-6 inset-x-0 z-50 pointer-events-none flex justify-center px-4"
      >
        <div className="pointer-events-auto bg-gray-900/80 backdrop-blur-xl border border-gray-700/50 shadow-[0_10px_40px_rgba(0,0,0,0.5)] rounded-2xl px-4 py-3 flex items-center gap-3 sm:gap-6 w-full max-w-3xl">
          <Link
            to="/dashboard"
            className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white transition-colors"
            title="Back to Dashboard"
          >
            <FiArrowLeft size={18} />
          </Link>
          
          <div className="h-6 w-px bg-gray-700 hidden sm:block" />
          
          <div className="flex-1 flex items-center gap-3">
            <span className="text-sm font-semibold text-white truncate hidden sm:block">
              {username}'s <span className="text-emerald-400">Portfolio</span>
            </span>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <ThemeToggle />
            
            <Link to={`/${username}/resume`}>
              <button className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-200 text-sm font-medium rounded-xl border border-gray-700 transition-colors">
                <FiFileText className="hidden sm:block" /> Resume
              </button>
            </Link>

            <button
              onClick={() => setEditMode(!editMode)}
              className={`flex items-center gap-2 px-5 py-2 text-sm font-bold rounded-xl transition-all shadow-lg ${
                editMode 
                  ? "bg-emerald-500 hover:bg-emerald-400 text-gray-900 shadow-[0_0_15px_rgba(16,185,129,0.3)]" 
                  : "bg-indigo-500 hover:bg-indigo-400 text-white shadow-[0_0_15px_rgba(99,102,241,0.3)]"
              }`}
            >
              {editMode ? <><FiCheck /> Done</> : <><FiEdit3 /> Edit</>}
            </button>
          </div>
        </div>
      </motion.div>

      {/* Main Portfolio Content */}
      <div className="pt-32 pb-24 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto relative z-10">
        <div className="space-y-24">
          <AnimatePresence>
            {sections.map((section, index) => (
              <motion.div 
                key={section.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
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
              className="mt-20 pt-10 border-t border-gray-800/50 flex justify-center"
            >
              <button 
                onClick={() => setShowAddSection(true)}
                className="flex items-center gap-2 px-8 py-4 bg-gray-900/50 hover:bg-gray-800 text-emerald-400 hover:text-emerald-300 font-bold rounded-2xl border-2 border-dashed border-gray-700 hover:border-emerald-500/50 transition-all"
              >
                <FiPlus size={20} /> Add New Section
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