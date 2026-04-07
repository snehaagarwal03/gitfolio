import { useState } from "react";
import { SECTION_TYPES } from "../../constants";
import Button from "../ui/Button";
import Input from "../ui/Input";

const SECTION_OPTIONS = [
  { type: SECTION_TYPES.ACHIEVEMENTS, label: "Achievements" },
  { type: SECTION_TYPES.EDUCATION, label: "Education" },
  { type: SECTION_TYPES.EXPERIENCE, label: "Experience" },
  { type: SECTION_TYPES.CUSTOM, label: "Custom Section" },
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
      <div className="bg-gray-900 rounded-xl p-6 border border-gray-700 w-full max-w-md mx-4">
        <h2 className="text-lg font-semibold text-white mb-4">Add Section</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">
              Section Type
            </label>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm"
              required
            >
              <option value="">Select a section type</option>
              {SECTION_OPTIONS.map((opt) => (
                <option key={opt.type} value={opt.type}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {selectedType === SECTION_TYPES.CUSTOM && (
            <Input
              label="Section Title"
              value={customTitle}
              onChange={(e) => setCustomTitle(e.target.value)}
              placeholder="Enter section title"
              required
            />
          )}

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">
              Content (one item per line)
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={4}
              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              placeholder={"Item 1\nItem 2\nItem 3"}
            />
          </div>

          <div className="flex items-center gap-3 justify-end">
            <Button variant="ghost" type="button" onClick={onClose}>
              Cancel
            </Button>
            <Button variant="primary" type="submit" disabled={!selectedType}>
              Add Section
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
