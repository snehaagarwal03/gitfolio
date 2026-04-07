import { useState } from "react";
import { motion } from "framer-motion";
import { FiAward, FiBookOpen, FiBriefcase, FiLayers } from "react-icons/fi";
import { SECTION_TYPES } from "../../constants";
import Button from "../ui/Button";

const SECTION_OPTIONS = [
  { type: SECTION_TYPES.ACHIEVEMENTS, label: "Achievements", icon: <FiAward size={20} />, desc: "Awards, certifications, milestones" },
  { type: SECTION_TYPES.EDUCATION, label: "Education", icon: <FiBookOpen size={20} />, desc: "Degrees, courses, certifications" },
  { type: SECTION_TYPES.EXPERIENCE, label: "Experience", icon: <FiBriefcase size={20} />, desc: "Work history, internships" },
  { type: SECTION_TYPES.CUSTOM, label: "Custom Section", icon: <FiLayers size={20} />, desc: "Add any custom content" },
];

export default function AddSectionModal({ onAdd, onClose }) {
  const [selectedType, setSelectedType] = useState("");
  const [customTitle, setCustomTitle] = useState("");
  const [content, setContent] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    if (!selectedType) return;

    const title =
      selectedType === SECTION_TYPES.CUSTOM
        ? customTitle
        : SECTION_OPTIONS.find((o) => o.type === selectedType)?.label || "";

    onAdd({
      type: selectedType,
      title,
      content: { text: content, items: content.split("\n").filter(Boolean) },
      enabled: true,
    });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        className="bg-slate-900 rounded-2xl p-6 border border-white/[0.06] w-full max-w-lg mx-4 shadow-2xl"
      >
        <h2 className="text-lg font-bold text-white mb-5">Add New Section</h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Section Type Cards */}
          <div className="grid grid-cols-2 gap-3">
            {SECTION_OPTIONS.map((opt) => (
              <button
                key={opt.type}
                type="button"
                onClick={() => setSelectedType(opt.type)}
                className={`p-4 rounded-xl border text-left transition-all duration-200 ${
                  selectedType === opt.type
                    ? "bg-emerald-500/[0.08] border-emerald-500/30 text-emerald-400"
                    : "bg-slate-800/50 border-white/[0.06] text-slate-400 hover:border-white/[0.1] hover:text-slate-300"
                }`}
              >
                <div className="mb-2">{opt.icon}</div>
                <p className="text-sm font-semibold mb-0.5">{opt.label}</p>
                <p className="text-xs opacity-60">{opt.desc}</p>
              </button>
            ))}
          </div>

          {selectedType === SECTION_TYPES.CUSTOM && (
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">
                Section Title
              </label>
              <input
                value={customTitle}
                onChange={(e) => setCustomTitle(e.target.value)}
                placeholder="Enter section title"
                className="w-full px-3 py-2.5 bg-slate-800 border border-white/[0.06] rounded-xl text-white text-sm placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-shadow"
                required
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1.5">
              Content (one item per line)
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={4}
              className="w-full px-3 py-2.5 bg-slate-800 border border-white/[0.06] rounded-xl text-white text-sm placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-shadow resize-none"
              placeholder={"Item 1\nItem 2\nItem 3"}
            />
          </div>

          <div className="flex items-center gap-3 justify-end pt-2">
            <Button variant="ghost" type="button" onClick={onClose}>
              Cancel
            </Button>
            <Button variant="primary" type="submit" disabled={!selectedType}>
              Add Section
            </Button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
