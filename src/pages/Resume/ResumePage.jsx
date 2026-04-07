import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  getPortfolioByUsername,
  getPortfolioSections,
  getResumeConfig,
  saveResumeConfig,
} from "../../services/firestore";
import { generateResumeContent } from "../../services/groq";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
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

  useEffect(() => {
    async function loadResume() {
      try {
        const portfolio = await getPortfolioByUsername(username);
        if (!portfolio || !user || portfolio.userId !== user.uid) {
          setError("Not found");
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
            headingColor: "#1a1a1a",
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
      const portfolio = await getPortfolioByUsername(username);
      if (portfolio) {
        await saveResumeConfig(portfolio.id, resumeConfig);
      }
    } catch (err) {
      console.error("Failed to save config:", err);
    }
  }

  function handleDownloadPDF() {
    window.print();
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-950">
        <LoadingSpinner size="lg" />
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

  const fontFamily = resumeConfig?.fontFamily || "Inter";
  const fontSize = resumeConfig?.fontSize || 14;
  const headingColor = resumeConfig?.headingColor || "#1a1a1a";

  return (
    <div className="min-h-screen bg-gray-950">
      <div className="sticky top-0 z-40 bg-gray-950/80 backdrop-blur-md border-b border-gray-800 px-4 py-3 print:hidden">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              to={`/${username}`}
              className="text-sm text-gray-400 hover:text-white transition-colors"
            >
              Portfolio
            </Link>
            <span className="text-gray-600">/</span>
            <span className="text-sm text-gray-300">Resume</span>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="primary" size="sm" onClick={handleGenerateResume} loading={generating}>
              Generate Resume
            </Button>
            <Button variant="secondary" size="sm" onClick={handleSaveConfig}>
              Save Settings
            </Button>
            <Button variant="outline" size="sm" onClick={handleDownloadPDF}>
              Download PDF
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8 print:p-0">
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="w-full lg:w-64 shrink-0 print:hidden">
            <div className="bg-gray-900 rounded-xl p-5 border border-gray-800 space-y-4">
              <h3 className="text-sm font-semibold text-white">Resume Settings</h3>

              <Input
                label="Font Family"
                value={resumeConfig?.fontFamily || ""}
                onChange={(e) => handleConfigChange("fontFamily", e.target.value)}
              />
              <Input
                label="Font Size"
                type="number"
                value={resumeConfig?.fontSize || ""}
                onChange={(e) => handleConfigChange("fontSize", parseInt(e.target.value))}
              />
              <Input
                label="Heading Color"
                type="color"
                value={resumeConfig?.headingColor || "#1a1a1a"}
                onChange={(e) => handleConfigChange("headingColor", e.target.value)}
              />

              <div className="space-y-2">
                <label className="text-sm text-gray-300">Text Style</label>
                <select
                  value={resumeConfig?.textStyle || "normal"}
                  onChange={(e) => handleConfigChange("textStyle", e.target.value)}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm"
                >
                  <option value="normal">Normal</option>
                  <option value="bold">Bold</option>
                  <option value="italic">Italic</option>
                </select>
              </div>

              <label className="flex items-center gap-2 text-sm text-gray-300">
                <input
                  type="checkbox"
                  checked={resumeConfig?.showHyperlinks !== false}
                  onChange={(e) => handleConfigChange("showHyperlinks", e.target.checked)}
                  className="rounded border-gray-600"
                />
                Show Hyperlinks
              </label>
            </div>
          </div>

          <div className="flex-1 flex justify-center print:block">
            <div
              className="bg-white text-gray-900 w-full max-w-[210mm] shadow-2xl rounded-lg print:shadow-none print:rounded-none"
              style={{ fontFamily, fontSize: `${fontSize}px` }}
            >
              <div className="p-10 print:p-8">
                {resumeData ? (
                  <>
                    <div className="mb-8">
                      <h1
                        className="text-2xl font-bold mb-1"
                        style={{ color: headingColor }}
                      >
                        {resumeData.header?.name || "Your Name"}
                      </h1>
                      <p className="text-gray-500 text-sm">
                        {resumeData.header?.title || "Professional Title"}
                      </p>
                      <div className="flex gap-4 mt-2 text-xs text-gray-400">
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

                    {resumeData.summary && (
                      <div className="mb-6">
                        <h2
                          className="text-sm font-semibold uppercase tracking-wider mb-2 pb-1 border-b"
                          style={{ color: headingColor, borderColor: headingColor }}
                        >
                          Summary
                        </h2>
                        <p className="text-sm text-gray-600 leading-relaxed">
                          {resumeData.summary}
                        </p>
                      </div>
                    )}

                    {resumeData.experience?.length > 0 && (
                      <div className="mb-6">
                        <h2
                          className="text-sm font-semibold uppercase tracking-wider mb-2 pb-1 border-b"
                          style={{ color: headingColor, borderColor: headingColor }}
                        >
                          Experience
                        </h2>
                        {resumeData.experience.map((exp, i) => (
                          <div key={i} className="mb-3">
                            <div className="flex justify-between items-baseline">
                              <h3 className="text-sm font-semibold">{exp.role}</h3>
                              <span className="text-xs text-gray-400">{exp.duration}</span>
                            </div>
                            <p className="text-xs text-gray-500">{exp.company}</p>
                            {exp.highlights?.map((h, j) => (
                              <p key={j} className="text-xs text-gray-600 mt-1 ml-3">
                                - {h}
                              </p>
                            ))}
                          </div>
                        ))}
                      </div>
                    )}

                    {resumeData.skills && (
                      <div className="mb-6">
                        <h2
                          className="text-sm font-semibold uppercase tracking-wider mb-2 pb-1 border-b"
                          style={{ color: headingColor, borderColor: headingColor }}
                        >
                          Skills
                        </h2>
                        <div className="text-sm text-gray-600">
                          {Object.entries(resumeData.skills).map(([category, items]) => (
                            <p key={category} className="mb-1">
                              <span className="font-medium capitalize">{category}:</span>{" "}
                              {Array.isArray(items) ? items.join(", ") : items}
                            </p>
                          ))}
                        </div>
                      </div>
                    )}

                    {resumeData.projects?.length > 0 && (
                      <div className="mb-6">
                        <h2
                          className="text-sm font-semibold uppercase tracking-wider mb-2 pb-1 border-b"
                          style={{ color: headingColor, borderColor: headingColor }}
                        >
                          Projects
                        </h2>
                        {resumeData.projects.map((proj, i) => (
                          <div key={i} className="mb-2">
                            <h3 className="text-sm font-semibold">{proj.name}</h3>
                            <p className="text-xs text-gray-600">{proj.description}</p>
                            {proj.tech && (
                              <p className="text-xs text-gray-400 mt-0.5">
                                {Array.isArray(proj.tech) ? proj.tech.join(", ") : proj.tech}
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                    )}

                    {resumeData.education?.length > 0 && (
                      <div>
                        <h2
                          className="text-sm font-semibold uppercase tracking-wider mb-2 pb-1 border-b"
                          style={{ color: headingColor, borderColor: headingColor }}
                        >
                          Education
                        </h2>
                        {resumeData.education.map((edu, i) => (
                          <div key={i} className="mb-2">
                            <div className="flex justify-between items-baseline">
                              <h3 className="text-sm font-semibold">{edu.degree}</h3>
                              <span className="text-xs text-gray-400">{edu.year}</span>
                            </div>
                            <p className="text-xs text-gray-500">{edu.institution}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  <div className="text-center py-20">
                    <p className="text-gray-400">
                      Click "Generate Resume" to create your resume from portfolio data.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
