import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
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
import Button from "../../components/ui/Button";
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
        if (!data) {
          setError("Portfolio not found");
          setLoading(false);
          return;
        }

        if (!user || data.userId !== user.uid) {
          setError("Portfolio not found");
          setLoading(false);
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
      <div className="min-h-screen flex items-center justify-center bg-gray-950">
        <div className="text-center">
          <LoadingSpinner size="xl" />
          <p className="mt-4 text-gray-400">Loading portfolio...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-950">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white mb-4">404</h1>
          <p className="text-gray-400 mb-6">{error}</p>
          <Link to="/dashboard" className="text-emerald-500 hover:text-emerald-400">
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  const isDark = portfolioTheme === "dark";

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${
        isDark ? "bg-gray-950 text-white" : "bg-white text-gray-900"
      }`}
    >
      <div className="sticky top-0 z-40 bg-gray-950/80 backdrop-blur-md border-b border-gray-800 px-4 py-3">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              to="/dashboard"
              className="text-sm text-gray-400 hover:text-white transition-colors"
            >
              Dashboard
            </Link>
            <span className="text-gray-600">/</span>
            <span className="text-sm text-gray-300">{username}</span>
          </div>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Button
              variant={editMode ? "primary" : "secondary"}
              size="sm"
              onClick={() => setEditMode(!editMode)}
            >
              {editMode ? "Done Editing" : "Edit"}
            </Button>
            <Link to={`/${username}/resume`}>
              <Button variant="outline" size="sm">
                Resume
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-12">
        <div className="space-y-16">
          {sections.map((section) => (
            <PortfolioSection
              key={section.id}
              section={section}
              editMode={editMode}
              onUpdate={(content) => handleSectionUpdate(section.id, content)}
              onDelete={() => handleDeleteSection(section.id)}
              onImageUpload={section.type === "hero" ? handleImageUpload : null}
              isDark={isDark}
            />
          ))}
        </div>

        {editMode && (
          <div className="mt-12 text-center">
            <Button variant="outline" onClick={() => setShowAddSection(true)}>
              + Add Section
            </Button>
          </div>
        )}
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
