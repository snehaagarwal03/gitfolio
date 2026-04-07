import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import {
  FaDownload,
  FaBold,
  FaItalic,
  FaUnderline,
  FaAlignLeft,
  FaAlignCenter,
  FaAlignRight,
  FaLink,
  FaExternalLinkAlt,
  FaCircle,
  FaRocket,
} from "react-icons/fa";
import Navbar from "../components/common/Navbar";
import Loader from "../components/common/Loader";
import { Button } from "../components/ui/button";
import { useAuth } from "../contexts/AuthContext";
import { getPortfolio } from "../services/firestore";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../components/ui/dialog";
import { Input } from "../components/ui/input";

export default function Resume() {
  const { user } = useAuth();
  const [portfolio, setPortfolio] = useState(null);
  const [loading, setLoading] = useState(true);
  const resumeRef = useRef(null);
  const [linkModalOpen, setLinkModalOpen] = useState(false);
  const [linkUrl, setLinkUrl] = useState("");
  const [savedSelection, setSavedSelection] = useState(null);
  
  // Track font size without triggering React re-renders which wipe the contentEditable
  const currentFontSize = useRef(13);

  useEffect(() => {
    async function loadData() {
      if (!user) return;
      try {
        setLoading(true);
        const data = await getPortfolio(user.uid);
        setPortfolio(data);
      } catch (err) {
        console.error("Failed to load portfolio for resume:", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [user]);

  function handleExecCommand(command, value = null) {
    document.execCommand(command, false, value);
  }

  function handleDownloadPDF() {
    window.print();
  }

  function increaseFontSize() {
    if (!resumeRef.current) return;
    currentFontSize.current = Math.min(currentFontSize.current + 1, 18);
    resumeRef.current.style.fontSize = `${currentFontSize.current}px`;
  }

  function decreaseFontSize() {
    if (!resumeRef.current) return;
    currentFontSize.current = Math.max(currentFontSize.current - 1, 9);
    resumeRef.current.style.fontSize = `${currentFontSize.current}px`;
  }


  function openLinkModal() {
    const selection = window.getSelection();
    if (selection.rangeCount > 0) {
      setSavedSelection(selection.getRangeAt(0));
    } else {
      setSavedSelection(null);
    }
    setLinkUrl("");
    setLinkModalOpen(true);
  }

  function handleInsertLink() {
    if (savedSelection) {
      const selection = window.getSelection();
      selection.removeAllRanges();
      selection.addRange(savedSelection);
    }
    document.execCommand("createLink", false, linkUrl);
    setLinkModalOpen(false);
  }

  if (loading) {
    return <Loader />;
  }

  // Extract data from portfolio
  const name = portfolio?.name || "Your Name";
  const email = portfolio?.email || user?.email || "";
  const profileUrl = portfolio?.profileUrl || "";
  const location = portfolio?.location || "";
  const bio = portfolio?.bio || "";
  const skills = portfolio?.skills || [];
  const projects = portfolio?.projects || [];
  const languages = portfolio?.languages || [];
  const readmeSections = portfolio?.readmeSections || {};
  const username = portfolio?.username || "";

  // Categorize skills
  const programmingLanguages = skills.filter((s) =>
    ["C", "C++", "Java", "JavaScript", "TypeScript", "Python", "SQL", "Go", "Rust", "Ruby", "PHP", "Swift", "Kotlin", "Dart", "Scala", "R"].includes(s)
  );
  const frameworks = skills.filter((s) =>
    ["React", "ReactJS", "Next.js", "Vue", "Angular", "Tailwind CSS", "TailwindCSS", "Framer Motion", "Express", "Express.js", "Flask", "Django", "Spring", "Node.js", "HTML5", "HTML", "CSS", "CSS3", "SCSS", "Bootstrap"].includes(s)
  );
  const tools = skills.filter(
    (s) => !programmingLanguages.includes(s) && !frameworks.includes(s)
  );

  return (
    <>
      {/* Screen styles */}
      <style>{`
        @media print {
          body * { visibility: hidden; }
          .resume-paper, .resume-paper * { visibility: visible; }
          .resume-paper { position: absolute; left: 0; top: 0; width: 100%; margin: 0; padding: 40px; box-shadow: none; border: none; }
          .no-print { display: none !important; }
        }
      `}</style>

      <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
        <div className="no-print">
          <Navbar />
        </div>

        <main className="px-4 pt-24 pb-32">
          <div className="mx-auto max-w-[860px]">
            {/* Generate prompt if no portfolio */}
            {!portfolio && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8 rounded-xl border border-border bg-card p-8 text-center"
              >
                <FaRocket className="mx-auto mb-4 text-3xl text-primary" />
                <h2 className="text-xl font-bold mb-2">No Portfolio Data Found</h2>
                <p className="text-muted-foreground mb-4">
                  Generate your portfolio first from the Dashboard to auto-populate your resume.
                </p>
                <a href="/dashboard">
                  <Button>Go to Dashboard</Button>
                </a>
              </motion.div>
            )}

            {/* Resume Paper */}
            <motion.div
              ref={resumeRef}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="resume-paper mx-auto bg-white rounded-lg shadow-2xl relative overflow-hidden ring-1 ring-border"
              style={{ minHeight: "1056px", padding: "48px 56px", fontSize: `${currentFontSize.current}px` }}
              contentEditable
              suppressContentEditableWarning
            >
              <div className="text-gray-900 font-[Inter,sans-serif]">
                {/* Header - Name & Contact */}
                <div className="mb-1">
                  <h2 className="text-2xl font-bold text-gray-900 leading-tight">{name}</h2>
                  <div className="flex flex-wrap gap-x-4 gap-y-0.5 text-xs text-gray-600 mt-1">
                    {email && (
                      <span>
                        Email:{" "}
                        <a href={`mailto:${email}`} className="text-[#0ea5e9] hover:underline">
                          {email}
                        </a>
                      </span>
                    )}
                    {username && (
                      <span>
                        Github:{" "}
                        <a
                          href={`https://github.com/${username}`}
                          className="text-[#0ea5e9] hover:underline"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          github.com/{username}
                        </a>
                      </span>
                    )}
                    {location && <span>{location}</span>}
                  </div>
                </div>

                {/* SKILLS */}
                <div className="mt-3">
                  <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide border-b border-gray-800 pb-0.5 mb-2">
                    Skills
                  </h3>
                  <ul className="list-disc ml-5 space-y-1 text-xs text-gray-700">
                    {programmingLanguages.length > 0 && (
                      <li>
                        <span className="font-semibold">Languages:</span>{" "}
                        {programmingLanguages.join(", ")}
                      </li>
                    )}
                    {frameworks.length > 0 && (
                      <li>
                        <span className="font-semibold">Frontend & Frameworks:</span>{" "}
                        {frameworks.join(", ")}
                      </li>
                    )}
                    {tools.length > 0 && (
                      <li>
                        <span className="font-semibold">Backend, Databases & Tools:</span>{" "}
                        {tools.join(", ")}
                      </li>
                    )}
                  </ul>
                </div>

                {/* EXPERIENCE (from readmeSections if available) */}
                {readmeSections?.experience && readmeSections.experience.length > 0 && (
                  <div className="mt-4">
                    <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide border-b border-gray-800 pb-0.5 mb-2">
                      Experience
                    </h3>
                    <div className="space-y-3">
                      {readmeSections.experience.map((exp, i) => (
                        <div key={i} className="text-xs text-gray-700">
                          <div className="flex justify-between items-baseline">
                            <h4 className="font-bold text-[#0ea5e9]">{typeof exp === "string" ? exp : exp.title || exp.role || exp}</h4>
                            {exp.date && <span className="text-gray-500">{exp.date}</span>}
                          </div>
                          {exp.company && <p className="italic text-gray-600">{exp.company}</p>}
                          {exp.description && (
                            <ul className="list-[circle] ml-5 mt-1 space-y-0.5">
                              {(Array.isArray(exp.description) ? exp.description : [exp.description]).map((d, j) => (
                                <li key={j}>{d}</li>
                              ))}
                            </ul>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* PROJECTS */}
                {projects.length > 0 && (
                  <div className="mt-4">
                    <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide border-b border-gray-800 pb-0.5 mb-2">
                      Projects
                    </h3>
                    <div className="space-y-3">
                      {projects.slice(0, 5).map((project) => (
                        <div key={project.name} className="text-xs text-gray-700">
                          <div className="flex items-baseline gap-2">
                            <h4 className="font-bold text-[#0ea5e9]">{project.name}</h4>
                            <span className="text-gray-500 italic">
                              — {[project.language, ...(project.topics?.slice(0, 3) || [])].filter(Boolean).join(", ")}
                            </span>
                          </div>
                          <ul className="list-[circle] ml-5 mt-1 space-y-0.5">
                            <li>{project.description || "A GitHub project."}</li>
                            {project.stars > 0 && (
                              <li>⭐ {project.stars} stars on GitHub</li>
                            )}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* EDUCATION */}
                {readmeSections?.education && readmeSections.education.length > 0 && (
                  <div className="mt-4">
                    <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide border-b border-gray-800 pb-0.5 mb-2">
                      Education
                    </h3>
                    <div className="space-y-2">
                      {readmeSections.education.map((edu, i) => (
                        <div key={i} className="text-xs text-gray-700">
                          {typeof edu === "string" ? (
                            <p>{edu}</p>
                          ) : (
                            <>
                              <div className="flex justify-between items-baseline">
                                <h4 className="font-bold">{edu.institution || edu.school || edu}</h4>
                                {edu.date && <span className="text-gray-500">{edu.date}</span>}
                              </div>
                              {edu.degree && <p className="italic text-gray-600">{edu.degree}</p>}
                              {edu.gpa && <p>CGPA: {edu.gpa}</p>}
                            </>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* ACHIEVEMENTS */}
                {readmeSections?.achievements && readmeSections.achievements.length > 0 && (
                  <div className="mt-4">
                    <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide border-b border-gray-800 pb-0.5 mb-2">
                      Achievements
                    </h3>
                    <ul className="list-disc ml-5 space-y-1 text-xs text-gray-700">
                      {readmeSections.achievements.map((ach, i) => (
                        <li key={i}>{typeof ach === "string" ? ach : ach.title || JSON.stringify(ach)}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* CERTIFICATIONS */}
                {readmeSections?.certifications && readmeSections.certifications.length > 0 && (
                  <div className="mt-4">
                    <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide border-b border-gray-800 pb-0.5 mb-2">
                      Certifications
                    </h3>
                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs">
                      {readmeSections.certifications.map((cert, i) => (
                        <span key={i} className="text-[#0ea5e9] underline">
                          {typeof cert === "string" ? cert : cert.name || cert.title || JSON.stringify(cert)}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* GitHub Stats Summary */}
                {portfolio && (
                  <div className="mt-4">
                    <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide border-b border-gray-800 pb-0.5 mb-2">
                      GitHub Activity
                    </h3>
                    <div className="flex flex-wrap gap-x-6 text-xs text-gray-700">
                      <span><strong>{portfolio.stats?.repos || 0}</strong> Public Repositories</span>
                      <span><strong>{portfolio.stats?.stars || 0}</strong> Total Stars</span>
                      <span><strong>{portfolio.stats?.followers || 0}</strong> Followers</span>
                      {languages.slice(0, 5).length > 0 && (
                        <span>
                          Top Languages: {languages.slice(0, 5).map((l) => l.language).join(", ")}
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </main>

        {/* Floating Bottom Toolbar */}
        <div className="no-print fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex items-center gap-1 rounded-2xl border border-border bg-card/95 backdrop-blur-xl px-4 py-2.5 shadow-2xl"
          >
            {/* Text Formatting */}
            <button
              onClick={() => handleExecCommand("bold")}
              className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
              title="Bold"
            >
              <FaBold size={14} />
            </button>
            <button
              onClick={() => handleExecCommand("italic")}
              className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
              title="Italic"
            >
              <FaItalic size={14} />
            </button>
            <button
              onClick={() => handleExecCommand("underline")}
              className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
              title="Underline"
            >
              <FaUnderline size={14} />
            </button>

            {/* Color Picker */}
            <div className="relative p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent transition-colors">
              <FaCircle size={14} />
              <input
                type="color"
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                onChange={(e) => handleExecCommand("foreColor", e.target.value)}
                title="Text Color"
              />
            </div>

            <div className="mx-1 h-5 w-px bg-border" />

            {/* Alignment */}
            <button
              onClick={() => handleExecCommand("justifyLeft")}
              className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
              title="Align Left"
            >
              <FaAlignLeft size={14} />
            </button>
            <button
              onClick={() => handleExecCommand("justifyCenter")}
              className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
              title="Align Center"
            >
              <FaAlignCenter size={14} />
            </button>
            <button
              onClick={() => handleExecCommand("justifyRight")}
              className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
              title="Align Right"
            >
              <FaAlignRight size={14} />
            </button>

            <div className="mx-1 h-5 w-px bg-border" />

            {/* Font Size */}
            <button
              onClick={increaseFontSize}
              className="px-2 py-1.5 rounded-lg text-sm font-semibold text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
              title="Increase Font Size"
            >
              A+
            </button>
            <button
              onClick={decreaseFontSize}
              className="px-2 py-1.5 rounded-lg text-sm font-semibold text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
              title="Decrease Font Size"
            >
              A−
            </button>

            <div className="mx-1 h-5 w-px bg-border" />

            {/* Actions */}

            <button
              onClick={handleDownloadPDF}
              className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
              title="Export PDF"
            >
              <FaExternalLinkAlt size={13} />
            </button>
            <button
              onClick={openLinkModal}
              className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
              title="Insert Link"
            >
              <FaLink size={13} />
            </button>
          </motion.div>
        </div>
      </div>

      <Dialog open={linkModalOpen} onOpenChange={setLinkModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Insert Link</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <Input
              type="url"
              placeholder="https://example.com"
              value={linkUrl}
              onChange={(e) => setLinkUrl(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleInsertLink();
              }}
              autoFocus
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setLinkModalOpen(false)}>Cancel</Button>
            <Button onClick={handleInsertLink}>Insert</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
