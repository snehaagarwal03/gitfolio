import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FiDownload, FiSave, FiZap, FiArrowLeft, FiType, FiFileText } from "react-icons/fi";
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
      <div className="min-h-screen flex items-center justify-center bg-[#030712]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#030712]">
        <div className="text-center p-10">
          <h1 className="text-5xl font-black gradient-text mb-3">Oops!</h1>
          <p className="text-slate-400 mb-6">{error}</p>
          <Link to="/dashboard" className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-gray-900 font-bold text-sm rounded-xl transition-all">
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
    <div className="min-h-screen bg-[#030712] flex flex-col lg:flex-row print:bg-white print:block">

      {/* Left Sidebar: Controls */}
      <div className="w-full lg:w-[360px] shrink-0 border-b lg:border-b-0 lg:border-r border-white/[0.04] bg-slate-950/80 backdrop-blur-xl print:hidden h-auto lg:h-screen lg:sticky lg:top-0 overflow-y-auto">
        <div className="p-6 space-y-6">
          {/* Header */}
          <div>
            <Link to={`/${username}`} className="flex items-center gap-2 text-xs text-slate-500 hover:text-white transition-colors mb-5">
              <FiArrowLeft size={13} /> Back to Portfolio
            </Link>
            <h1 className="text-xl font-bold text-white flex items-center gap-2.5 mb-1.5">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                <FiFileText className="text-emerald-500" size={16} />
              </div>
              Resume Builder
            </h1>
            <p className="text-xs text-slate-500">Generate, customize, and export your resume as PDF.</p>
          </div>

          {/* Actions */}
          <div className="space-y-3">
            <button
              onClick={handleGenerateResume}
              disabled={generating}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white text-sm font-bold rounded-xl transition-all disabled:opacity-50"
            >
              {generating ? <LoadingSpinner size="sm" /> : <FiZap size={15} />}
              {resumeData ? "Regenerate" : "Generate Resume"}
            </button>

            <button
              onClick={handleDownloadPDF}
              disabled={!resumeData}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-slate-800 hover:bg-slate-700 text-white text-sm font-bold rounded-xl border border-white/[0.06] transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <FiDownload size={15} /> Download PDF
            </button>
          </div>

          {/* Settings */}
          <div className="space-y-5 pt-2 border-t border-white/[0.04]">
            <h3 className="text-sm font-semibold text-white">Appearance</h3>

            {/* Font Family */}
            <div>
              <label className="flex items-center gap-1.5 text-xs font-medium text-slate-400 mb-1.5">
                <FiType size={12} /> Font Family
              </label>
              <select
                value={resumeConfig?.fontFamily || "Inter"}
                onChange={(e) => handleConfigChange("fontFamily", e.target.value)}
                className="w-full px-3 py-2.5 bg-slate-900 border border-white/[0.06] rounded-lg text-white text-sm focus:ring-2 focus:ring-emerald-500/50 transition-shadow"
              >
                <option value="Inter">Inter (Sans Serif)</option>
                <option value="Roboto">Roboto (Sans Serif)</option>
                <option value="Lora">Lora (Serif)</option>
                <option value="Playfair Display">Playfair Display (Serif)</option>
              </select>
            </div>

            {/* Font Size */}
            <div>
              <label className="flex items-center justify-between text-xs font-medium text-slate-400 mb-1.5">
                <span>Font Size</span>
                <span className="text-emerald-400 font-mono">{resumeConfig?.fontSize || 14}px</span>
              </label>
              <input
                type="range"
                min="12"
                max="18"
                step="1"
                value={resumeConfig?.fontSize || 14}
                onChange={(e) => handleConfigChange("fontSize", parseInt(e.target.value))}
                className="w-full accent-emerald-500 h-1.5"
              />
            </div>

            {/* Heading Color */}
            <div>
              <label className="flex items-center justify-between text-xs font-medium text-slate-400 mb-1.5">
                <span>Heading Color</span>
                <span className="text-xs font-mono text-slate-500">{resumeConfig?.headingColor || "#0f172a"}</span>
              </label>
              <div className="flex items-center gap-2.5">
                <input
                  type="color"
                  value={resumeConfig?.headingColor || "#0f172a"}
                  onChange={(e) => handleConfigChange("headingColor", e.target.value)}
                  className="w-9 h-9 rounded-lg cursor-pointer bg-slate-900 border border-white/[0.06] shrink-0"
                />
                <div className="flex gap-1.5">
                  {["#0f172a", "#1e40af", "#065f46", "#7f1d1d"].map(color => (
                    <button
                      key={color}
                      onClick={() => handleConfigChange("headingColor", color)}
                      className={`w-7 h-7 rounded-md border-2 transition-all ${
                        resumeConfig?.headingColor === color ? "border-white scale-110" : "border-transparent hover:border-slate-600"
                      }`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Text Weight */}
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">Text Weight</label>
              <div className="flex bg-slate-900 rounded-lg p-1 border border-white/[0.06]">
                {[
                  { val: "light", label: "Light", weight: "font-light" },
                  { val: "normal", label: "Normal", weight: "font-normal" },
                  { val: "bold", label: "Bold", weight: "font-bold" },
                ].map((opt) => (
                  <button
                    key={opt.val}
                    onClick={() => handleConfigChange("textStyle", opt.val)}
                    className={`flex-1 py-1.5 text-xs rounded-md transition-colors ${opt.weight} ${
                      resumeConfig?.textStyle === opt.val
                        ? "bg-slate-700 text-white"
                        : "text-slate-500 hover:text-white"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Hyperlinks Toggle */}
            <div className="pt-1">
              <label className="flex items-center gap-3 text-xs text-slate-400 cursor-pointer group">
                <div className="relative flex items-center justify-center">
                  <input
                    type="checkbox"
                    checked={resumeConfig?.showHyperlinks !== false}
                    onChange={(e) => handleConfigChange("showHyperlinks", e.target.checked)}
                    className="sr-only"
                  />
                  <div className={`w-9 h-5 rounded-full transition-colors duration-200 ${
                    resumeConfig?.showHyperlinks !== false ? "bg-emerald-500/20" : "bg-slate-800"
                  }`} />
                  <div className={`absolute left-0.5 w-4 h-4 rounded-full transition-transform duration-200 ${
                    resumeConfig?.showHyperlinks !== false ? "translate-x-4 bg-emerald-400" : "bg-slate-500"
                  }`} />
                </div>
                Show links &amp; icons
              </label>
            </div>

            {/* Save */}
            <button
              onClick={handleSaveConfig}
              disabled={saving}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-white text-sm font-medium rounded-xl border border-white/[0.06] transition-colors disabled:opacity-50"
            >
              {saving ? <LoadingSpinner size="sm" /> : <FiSave size={14} />} Save Settings
            </button>
          </div>
        </div>
      </div>

      {/* Right Side: Resume Preview */}
      <div className="flex-1 overflow-y-auto bg-slate-950 p-4 sm:p-8 lg:p-12 flex justify-center print:p-0 print:bg-white print:overflow-visible">
        {resumeData ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-[210mm] min-h-[297mm] bg-white text-gray-900 shadow-2xl rounded-lg print:shadow-none print:rounded-none print:w-full print:max-w-none"
            style={{
              fontFamily: `"${fontFamily}", sans-serif`,
              fontSize: `${fontSize}px`,
              fontWeight: textStyle === "bold" ? 600 : textStyle === "light" ? 300 : 400,
            }}
          >
            <div className="p-10 sm:p-12 print:p-0">
              {/* Header */}
              <div className="mb-8 border-b-2 pb-6" style={{ borderColor: headingColor }}>
                <h1 className="text-4xl font-black tracking-tight mb-2 uppercase" style={{ color: headingColor }}>
                  {resumeData.header?.name || "Your Name"}
                </h1>
                <p className="text-lg text-gray-600 font-medium mb-3">
                  {resumeData.header?.title || "Software Engineer"}
                </p>
                <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-gray-500">
                  {resumeData.header?.contact?.email && (
                    <span>{resumeData.header.contact.email}</span>
                  )}
                  {resumeData.header?.contact?.github && (
                    <span>{resumeData.header.contact.github}</span>
                  )}
                  {resumeData.header?.contact?.website && (
                    <span>{resumeData.header.contact.website}</span>
                  )}
                </div>
              </div>

              {/* Summary */}
              {resumeData.summary && (
                <div className="mb-6">
                  <h2 className="text-lg font-bold uppercase tracking-wider mb-2 pb-1 border-b" style={{ color: headingColor, borderColor: `${headingColor}30` }}>
                    Summary
                  </h2>
                  <p className="text-gray-700 leading-relaxed text-justify">{resumeData.summary}</p>
                </div>
              )}

              {/* Experience */}
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

              {/* Skills */}
              {resumeData.skills && (
                <div className="mb-6">
                  <h2 className="text-lg font-bold uppercase tracking-wider mb-3 pb-1 border-b" style={{ color: headingColor, borderColor: `${headingColor}30` }}>
                    Skills &amp; Technologies
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

              {/* Projects */}
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
                            <span className="font-medium not-italic text-gray-600">Tech:</span> {Array.isArray(proj.tech) ? proj.tech.join(" | ") : proj.tech}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Education */}
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
          <div className="flex flex-col items-center justify-center h-full max-w-sm text-center py-20 print:hidden">
            <div className="w-16 h-16 bg-emerald-500/10 rounded-2xl flex items-center justify-center text-emerald-500 mb-5">
              <FiFileText size={28} />
            </div>
            <h2 className="text-xl font-bold text-white mb-2">No Resume Yet</h2>
            <p className="text-slate-500 text-sm mb-6 leading-relaxed">
              Click &quot;Generate Resume&quot; to create a clean, professional resume from your portfolio data.
            </p>
            <button
              onClick={handleGenerateResume}
              disabled={generating}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-emerald-500 hover:bg-emerald-400 text-gray-900 text-sm font-bold rounded-xl transition-all"
            >
              {generating ? <LoadingSpinner size="sm" /> : <FiZap size={15} />} Generate Now
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
