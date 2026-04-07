import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FiDownload, FiSave, FiZap, FiSettings, FiArrowLeft, FiSliders, FiType, FiEye } from "react-icons/fi";
import { useAuth } from "../../context/AuthContext";
import {
  getPortfolioByUsername,
  getPortfolioSections,
  getResumeConfig,
  saveResumeConfig,
} from "../../services/firestore";
import { generateResumeContent } from "../../services/groq";
import LoadingSpinner from "../../components/ui/LoadingSpinner";

export default function ResumePage() {
  const { username } = useParams();
  const { user } = useAuth();

  const [sections, setSections] = useState([]);
  const [resumeConfig, setResumeConfig] = useState(null);
  const [resumeData, setResumeData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function loadResume() {
      try {
        const portfolio = await getPortfolioByUsername(username);
        if (!portfolio || !user || portfolio.userId !== user.uid) {
          setError("Not found or unauthorized");
          setLoading(false);
          return;
        }

        const sectionData = await getPortfolioSections(portfolio.id);
        setSections(sectionData);

        const config = await getResumeConfig(portfolio.id);
        setResumeConfig(
          config || {
            fontFamily: "Inter",
            fontSize: 14,
            headingColor: "#0f172a",
            textStyle: "normal",
            showHyperlinks: true,
          }
        );
      } catch {
        setError("Failed to load resume data");
      } finally {
        setLoading(false);
      }
    }

    loadResume();
  }, [username, user]);

  async function handleGenerateResume() {
    setGenerating(true);
    setError("");

    try {
      const portfolioData = sections.reduce((acc, section) => {
        acc[section.type] = section.content;
        return acc;
      }, {});

      const data = await generateResumeContent(portfolioData);
      setResumeData(data);
    } catch (err) {
      setError(err.message || "Failed to generate resume");
    } finally {
      setGenerating(false);
    }
  }

  function handleConfigChange(key, value) {
    setResumeConfig((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSaveConfig() {
    try {
      setSaving(true);
      const portfolio = await getPortfolioByUsername(username);
      if (portfolio) {
        await saveResumeConfig(portfolio.id, resumeConfig);
      }
    } catch (err) {
      console.error("Failed to save config:", err);
    } finally {
      setSaving(false);
    }
  }

  function handleDownloadPDF() {
    window.print();
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#02040a]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#02040a]">
        <div className="text-center bg-gray-900/50 p-12 rounded-3xl border border-gray-800">
          <h1 className="text-4xl font-bold text-white mb-4">Oops!</h1>
          <p className="text-gray-400 mb-8">{error}</p>
          <Link to="/dashboard" className="px-6 py-3 bg-emerald-500 hover:bg-emerald-400 text-gray-900 font-bold rounded-xl transition-all">
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  const fontFamily = resumeConfig?.fontFamily || "Inter";
  const fontSize = resumeConfig?.fontSize || 14;
  const headingColor = resumeConfig?.headingColor || "#0f172a";
  const textStyle = resumeConfig?.textStyle || "normal";

  return (
    <div className="min-h-screen bg-[#02040a] flex flex-col lg:flex-row print:bg-white print:block">
      
      {/* Left Sidebar: Controls (Hidden in Print) */}
      <div className="w-full lg:w-[400px] shrink-0 border-b lg:border-b-0 lg:border-r border-gray-800 bg-gray-950/80 backdrop-blur-xl relative z-20 print:hidden h-auto lg:h-screen lg:sticky lg:top-0 overflow-y-auto custom-scrollbar">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-8 text-gray-400 hover:text-white transition-colors w-fit">
            <Link to={`/${username}`} className="flex items-center gap-2 text-sm font-medium">
              <FiArrowLeft /> Back to Portfolio
            </Link>
          </div>

          <div className="mb-8">
            <h1 className="text-2xl font-bold text-white flex items-center gap-2 mb-2">
              <FiFileText className="text-emerald-500" /> Resume Builder
            </h1>
            <p className="text-sm text-gray-400">Generate, customize, and export your resume as a clean PDF.</p>
          </div>

          <div className="space-y-4 mb-8">
            <button
              onClick={handleGenerateResume}
              disabled={generating}
              className="w-full flex items-center justify-center gap-2 px-4 py-3.5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-bold rounded-xl shadow-[0_0_20px_rgba(16,185,129,0.2)] transition-all disabled:opacity-50"
            >
              {generating ? <LoadingSpinner size="sm" /> : <FiZap />}
              {resumeData ? "Regenerate Content" : "Generate Resume"}
            </button>

            <button
              onClick={handleDownloadPDF}
              disabled={!resumeData}
              className="w-full flex items-center justify-center gap-2 px-4 py-3.5 bg-gray-800 hover:bg-gray-700 text-white font-bold rounded-xl border border-gray-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FiDownload /> Download PDF
            </button>
          </div>

          {/* Settings Panel */}
          <div className="space-y-6">
            <div className="flex items-center gap-2 text-white font-semibold pb-2 border-b border-gray-800">
              <FiSliders className="text-emerald-500" /> Appearance
            </div>

            <div className="space-y-5">
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2">
                  <FiType /> Font Family
                </label>
                <select
                  value={resumeConfig?.fontFamily || "Inter"}
                  onChange={(e) => handleConfigChange("fontFamily", e.target.value)}
                  className="w-full px-3 py-2.5 bg-gray-900 border border-gray-700 rounded-lg text-white text-sm focus:ring-2 focus:ring-emerald-500 transition-shadow"
                >
                  <option value="Inter">Inter (Sans Serif)</option>
                  <option value="Roboto">Roboto (Sans Serif)</option>
                  <option value="Merriweather">Merriweather (Sans Serif)</option>
                  <option value="Lora">Lora (Serif)</option>
                  <option value="Playfair Display">Playfair Display (Serif)</option>
                </select>
              </div>

              <div>
                <label className="flex items-center justify-between text-sm font-medium text-gray-300 mb-2">
                  <span>Base Font Size</span>
                  <span className="text-emerald-500">{resumeConfig?.fontSize || 14}px</span>
                </label>
                <input
                  type="range"
                  min="12"
                  max="18"
                  step="1"
                  value={resumeConfig?.fontSize || 14}
                  onChange={(e) => handleConfigChange("fontSize", parseInt(e.target.value))}
                  className="w-full accent-emerald-500"
                />
              </div>

              <div>
                <label className="flex items-center justify-between text-sm font-medium text-gray-300 mb-2">
                  <span>Heading Color</span>
                  <span className="text-xs uppercase bg-gray-800 px-2 py-1 rounded">{resumeConfig?.headingColor || "#0f172a"}</span>
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={resumeConfig?.headingColor || "#0f172a"}
                    onChange={(e) => handleConfigChange("headingColor", e.target.value)}
                    className="w-10 h-10 rounded cursor-pointer bg-gray-900 border-0"
                  />
                  <div className="flex gap-2">
                    {["#0f172a", "#1e40af", "#065f46", "#7f1d1d"].map(color => (
                      <button
                        key={color}
                        onClick={() => handleConfigChange("headingColor", color)}
                        className={`w-8 h-8 rounded-full border-2 ${resumeConfig?.headingColor === color ? 'border-white' : 'border-transparent'}`}
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Text Weight</label>
                <div className="flex bg-gray-900 rounded-lg p-1 border border-gray-800">
                  <button
                    onClick={() => handleConfigChange("textStyle", "normal")}
                    className={`flex-1 py-1.5 text-sm rounded-md transition-colors ${resumeConfig?.textStyle === "normal" ? "bg-gray-700 text-white font-medium" : "text-gray-400 hover:text-white"}`}
                  >
                    Normal
                  </button>
                  <button
                    onClick={() => handleConfigChange("textStyle", "bold")}
                    className={`flex-1 py-1.5 text-sm rounded-md transition-colors ${resumeConfig?.textStyle === "bold" ? "bg-gray-700 text-white font-medium" : "text-gray-400 hover:text-white"}`}
                  >
                    <span className="font-bold">Bold</span>
                  </button>
                  <button
                    onClick={() => handleConfigChange("textStyle", "light")}
                    className={`flex-1 py-1.5 text-sm rounded-md transition-colors ${resumeConfig?.textStyle === "light" ? "bg-gray-700 text-white font-medium" : "text-gray-400 hover:text-white"}`}
                  >
                    <span className="font-light">Light</span>
                  </button>
                </div>
              </div>

              <div className="pt-2">
                <label className="flex items-center gap-3 text-sm text-gray-300 cursor-pointer group">
                  <div className="relative flex items-center justify-center">
                    <input
                      type="checkbox"
                      checked={resumeConfig?.showHyperlinks !== false}
                      onChange={(e) => handleConfigChange("showHyperlinks", e.target.checked)}
                      className="sr-only"
                    />
                    <div className={`w-10 h-5 bg-gray-800 rounded-full border border-gray-700 transition-colors ${resumeConfig?.showHyperlinks !== false ? 'bg-emerald-500/20 border-emerald-500/50' : ''}`} />
                    <div className={`absolute left-1 w-3.5 h-3.5 bg-gray-400 rounded-full transition-transform ${resumeConfig?.showHyperlinks !== false ? 'translate-x-4 bg-emerald-400' : ''}`} />
                  </div>
                  Show links & icons
                </label>
              </div>

              <button
                onClick={handleSaveConfig}
                disabled={saving}
                className="w-full mt-4 flex items-center justify-center gap-2 px-4 py-2.5 bg-gray-800 hover:bg-gray-700 text-white font-medium rounded-xl border border-gray-700 transition-colors disabled:opacity-50"
              >
                {saving ? <LoadingSpinner size="sm" /> : <FiSave />} Save Settings
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side: Resume Preview (White Paper) */}
      <div className="flex-1 overflow-y-auto bg-gray-950 p-4 sm:p-8 flex justify-center print:p-0 print:bg-white print:overflow-visible">
        {resumeData ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-[210mm] min-h-[297mm] bg-white text-gray-900 shadow-2xl print:shadow-none print:w-full print:max-w-none"
            style={{ 
              fontFamily: `"${fontFamily}", sans-serif`, 
              fontSize: `${fontSize}px`,
              fontWeight: textStyle === "bold" ? 600 : textStyle === "light" ? 300 : 400
            }}
          >
            <div className="p-10 sm:p-12 print:p-0">
              {/* HEADER */}
              <div className="mb-8 border-b-2 pb-6" style={{ borderColor: headingColor }}>
                <h1 className="text-4xl font-black tracking-tight mb-2 uppercase" style={{ color: headingColor }}>
                  {resumeData.header?.name || "Your Name"}
                </h1>
                <p className="text-lg text-gray-600 font-medium mb-3">
                  {resumeData.header?.title || "Software Engineer"}
                </p>
                <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-gray-500">
                  {resumeData.header?.contact?.email && (
                    <span className="flex items-center gap-1.5">
                      {resumeConfig?.showHyperlinks !== false && <FiMail className="opacity-70" />}
                      {resumeData.header.contact.email}
                    </span>
                  )}
                  {resumeData.header?.contact?.github && (
                    <span className="flex items-center gap-1.5">
                      {resumeConfig?.showHyperlinks !== false && <FiGithub className="opacity-70" />}
                      {resumeData.header.contact.github}
                    </span>
                  )}
                  {resumeData.header?.contact?.website && (
                    <span className="flex items-center gap-1.5">
                      {resumeConfig?.showHyperlinks !== false && <FiLayout className="opacity-70" />}
                      {resumeData.header.contact.website}
                    </span>
                  )}
                </div>
              </div>

              {/* SUMMARY */}
              {resumeData.summary && (
                <div className="mb-6">
                  <h2 className="text-lg font-bold uppercase tracking-wider mb-2 pb-1 border-b" style={{ color: headingColor, borderColor: `${headingColor}30` }}>
                    Summary
                  </h2>
                  <p className="text-gray-700 leading-relaxed text-justify">
                    {resumeData.summary}
                  </p>
                </div>
              )}

              {/* EXPERIENCE */}
              {resumeData.experience?.length > 0 && (
                <div className="mb-6">
                  <h2 className="text-lg font-bold uppercase tracking-wider mb-3 pb-1 border-b" style={{ color: headingColor, borderColor: `${headingColor}30` }}>
                    Experience
                  </h2>
                  <div className="space-y-4">
                    {resumeData.experience.map((exp, i) => (
                      <div key={i}>
                        <div className="flex justify-between items-baseline mb-1">
                          <h3 className="font-bold text-gray-900" style={{ fontSize: `${fontSize + 1}px` }}>{exp.role}</h3>
                          <span className="text-gray-500 font-medium text-sm whitespace-nowrap ml-4">{exp.duration}</span>
                        </div>
                        <p className="text-gray-600 font-medium mb-2 italic" style={{ fontSize: `${fontSize - 1}px` }}>{exp.company}</p>
                        <ul className="list-disc pl-5 text-gray-700 space-y-1">
                          {exp.highlights?.map((h, j) => (
                            <li key={j} className="leading-snug text-justify pl-1">{h}</li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* SKILLS */}
              {resumeData.skills && (
                <div className="mb-6">
                  <h2 className="text-lg font-bold uppercase tracking-wider mb-3 pb-1 border-b" style={{ color: headingColor, borderColor: `${headingColor}30` }}>
                    Skills & Technologies
                  </h2>
                  <div className="grid grid-cols-1 gap-2 text-gray-700">
                    {Object.entries(resumeData.skills).map(([category, items]) => (
                      <div key={category} className="flex">
                        <span className="font-bold capitalize w-32 shrink-0">{category}:</span>
                        <span className="flex-1 text-gray-600">{Array.isArray(items) ? items.join(", ") : items}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* PROJECTS */}
              {resumeData.projects?.length > 0 && (
                <div className="mb-6">
                  <h2 className="text-lg font-bold uppercase tracking-wider mb-3 pb-1 border-b" style={{ color: headingColor, borderColor: `${headingColor}30` }}>
                    Selected Projects
                  </h2>
                  <div className="space-y-3">
                    {resumeData.projects.map((proj, i) => (
                      <div key={i}>
                        <h3 className="font-bold text-gray-900 mb-1" style={{ fontSize: `${fontSize + 1}px` }}>{proj.name}</h3>
                        <p className="text-gray-700 leading-snug mb-1 text-justify">{proj.description}</p>
                        {proj.tech && (
                          <p className="text-gray-500 italic" style={{ fontSize: `${fontSize - 2}px` }}>
                            <span className="font-medium not-italic text-gray-600">Tech:</span> {Array.isArray(proj.tech) ? proj.tech.join(" • ") : proj.tech}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* EDUCATION */}
              {resumeData.education?.length > 0 && (
                <div className="mb-2">
                  <h2 className="text-lg font-bold uppercase tracking-wider mb-3 pb-1 border-b" style={{ color: headingColor, borderColor: `${headingColor}30` }}>
                    Education
                  </h2>
                  <div className="space-y-3">
                    {resumeData.education.map((edu, i) => (
                      <div key={i}>
                        <div className="flex justify-between items-baseline mb-0.5">
                          <h3 className="font-bold text-gray-900" style={{ fontSize: `${fontSize + 1}px` }}>{edu.degree}</h3>
                          <span className="text-gray-500 font-medium text-sm whitespace-nowrap ml-4">{edu.year}</span>
                        </div>
                        <p className="text-gray-600">{edu.institution}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full max-w-md text-center py-20 print:hidden">
            <div className="w-20 h-20 bg-gray-900 rounded-full flex items-center justify-center text-emerald-500 mb-6 shadow-[0_0_30px_rgba(16,185,129,0.15)]">
              <FiFileText size={32} />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Resume Not Generated</h2>
            <p className="text-gray-400 mb-8">
              Click the "Generate Resume" button in the sidebar to create your beautiful resume layout based on your portfolio data.
            </p>
            <button
              onClick={handleGenerateResume}
              disabled={generating}
              className="flex items-center justify-center gap-2 px-8 py-3 bg-emerald-500 hover:bg-emerald-400 text-gray-900 font-bold rounded-xl transition-all"
            >
              {generating ? <LoadingSpinner size="sm" /> : <FiZap />} Generate Now
            </button>
          </div>
        )}
      </div>
    </div>
  );
}