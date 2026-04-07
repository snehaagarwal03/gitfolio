import { useState } from "react";

export default function PortfolioSection({
  section,
  editMode,
  onUpdate,
  onDelete,
  onImageUpload,
  isDark = true,
}) {
  const [editing, setEditing] = useState(false);
  const [localContent, setLocalContent] = useState(section.content || {});

  function handleSave() {
    onUpdate({ content: localContent });
    setEditing(false);
  }

  function handleCancel() {
    setLocalContent(section.content || {});
    setEditing(false);
  }

  function renderHero() {
    const { title, subtitle, image } = localContent;
    return (
      <div className="text-center py-12">
        {onImageUpload && editMode && (
          <div className="mb-6">
            <label className="cursor-pointer inline-block">
              <img
                src={image || "https://via.placeholder.com/150"}
                alt="Profile"
                className={`w-32 h-32 rounded-full object-cover mx-auto border-4 ${
                  isDark ? "border-gray-700" : "border-gray-200"
                }`}
              />
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files[0]) onImageUpload(e.target.files[0]);
                }}
              />
              <p className="text-xs text-gray-400 mt-2">Click to change</p>
            </label>
          </div>
        )}
        {editing ? (
          <div className="max-w-lg mx-auto space-y-3">
            <input
              value={title || ""}
              onChange={(e) => setLocalContent({ ...localContent, title: e.target.value })}
              className="w-full text-3xl font-bold bg-transparent border-b border-gray-600 focus:border-emerald-500 outline-none text-center"
              placeholder="Title"
            />
            <input
              value={subtitle || ""}
              onChange={(e) => setLocalContent({ ...localContent, subtitle: e.target.value })}
              className="w-full text-lg bg-transparent border-b border-gray-600 focus:border-emerald-500 outline-none text-center"
              placeholder="Subtitle"
            />
          </div>
        ) : (
          <>
            <h1 className="text-4xl font-bold mb-3">{title || "Developer"}</h1>
            <p className="text-lg opacity-70">{subtitle || ""}</p>
          </>
        )}
      </div>
    );
  }

  function renderAbout() {
    const { text } = localContent;
    return (
      <div>
        <h2 className="text-2xl font-bold mb-4">{section.title || "About"}</h2>
        {editing ? (
          <textarea
            value={text || ""}
            onChange={(e) => setLocalContent({ ...localContent, text: e.target.value })}
            rows={4}
            className="w-full bg-transparent border border-gray-600 rounded-lg p-3 focus:border-emerald-500 outline-none"
          />
        ) : (
          <p className="opacity-80 leading-relaxed">{text || ""}</p>
        )}
      </div>
    );
  }

  function renderSkills() {
    const { items } = localContent;
    const skills = items || [];
    return (
      <div>
        <h2 className="text-2xl font-bold mb-4">{section.title || "Skills"}</h2>
        {editing ? (
          <input
            value={Array.isArray(skills) ? skills.join(", ") : ""}
            onChange={(e) =>
              setLocalContent({
                ...localContent,
                items: e.target.value.split(",").map((s) => s.trim()).filter(Boolean),
              })
            }
            className="w-full bg-transparent border border-gray-600 rounded-lg p-3 focus:border-emerald-500 outline-none"
            placeholder="Skill1, Skill2, Skill3"
          />
        ) : (
          <div className="flex flex-wrap gap-2">
            {skills.map((skill, i) => (
              <span
                key={i}
                className={`px-3 py-1 rounded-full text-sm ${
                  isDark
                    ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                    : "bg-emerald-50 text-emerald-700 border border-emerald-200"
                }`}
              >
                {skill}
              </span>
            ))}
          </div>
        )}
      </div>
    );
  }

  function renderProjects() {
    const { items } = localContent;
    const projects = items || [];
    return (
      <div>
        <h2 className="text-2xl font-bold mb-6">{section.title || "Projects"}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {projects.map((project, i) => (
            <div
              key={i}
              className={`p-4 rounded-lg border ${
                isDark ? "border-gray-800 bg-gray-900/50" : "border-gray-200 bg-gray-50"
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <h3 className="font-semibold">{project.name}</h3>
                <div className="flex gap-2 text-xs opacity-60">
                  {project.stars > 0 && <span>{project.stars}</span>}
                </div>
              </div>
              <p className="text-sm opacity-70 mt-1">{project.description}</p>
              {project.tech && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {(Array.isArray(project.tech) ? project.tech : []).map((t, j) => (
                    <span
                      key={j}
                      className={`text-xs px-2 py-0.5 rounded ${
                        isDark ? "bg-gray-800 text-gray-300" : "bg-gray-200 text-gray-600"
                      }`}
                    >
                      {t}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  }

  function renderGenericList() {
    const { items } = localContent;
    const listItems = items || [];
    return (
      <div>
        <h2 className="text-2xl font-bold mb-4">{section.title}</h2>
        <div className="space-y-3">
          {listItems.map((item, i) => (
            <div
              key={i}
              className={`p-3 rounded-lg ${
                isDark ? "bg-gray-900/50" : "bg-gray-50"
              }`}
            >
              {typeof item === "string" ? (
                <p className="text-sm opacity-80">{item}</p>
              ) : (
                <div>
                  {item.role && (
                    <h3 className="font-semibold text-sm">{item.role}</h3>
                  )}
                  {item.degree && (
                    <h3 className="font-semibold text-sm">{item.degree}</h3>
                  )}
                  {(item.company || item.institution) && (
                    <p className="text-sm opacity-60">{item.company || item.institution}</p>
                  )}
                  {(item.duration || item.year) && (
                    <p className="text-xs opacity-40">{item.duration || item.year}</p>
                  )}
                  {item.description && (
                    <p className="text-sm opacity-70 mt-1">{item.description}</p>
                  )}
                  {item.highlights && (
                    <ul className="text-sm opacity-70 mt-1 ml-4 list-disc">
                      {item.highlights.map((h, j) => (
                        <li key={j}>{h}</li>
                      ))}
                    </ul>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  }

  function renderContact() {
    const { email, github, website } = localContent;
    return (
      <div>
        <h2 className="text-2xl font-bold mb-4">{section.title || "Contact"}</h2>
        <div className="flex flex-wrap gap-6 text-sm">
          {email && <span className="opacity-70">{email}</span>}
          {github && <span className="opacity-70">{github}</span>}
          {website && <span className="opacity-70">{website}</span>}
        </div>
      </div>
    );
  }

  function renderContent() {
    switch (section.type) {
      case "hero":
        return renderHero();
      case "about":
        return renderAbout();
      case "skills":
        return renderSkills();
      case "projects":
        return renderProjects();
      case "contact":
        return renderContact();
      case "experience":
      case "education":
      case "achievements":
      case "custom":
      default:
        return renderGenericList();
    }
  }

  return (
    <div className="relative group">
      {editMode && (
        <div className="absolute -top-3 right-0 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          {!editing && section.type !== "hero" && (
            <button
              onClick={() => setEditing(true)}
              className="px-2 py-1 text-xs bg-gray-700 text-white rounded hover:bg-gray-600"
            >
              Edit
            </button>
          )}
          {editing && (
            <>
              <button
                onClick={handleSave}
                className="px-2 py-1 text-xs bg-emerald-500 text-white rounded hover:bg-emerald-600"
              >
                Save
              </button>
              <button
                onClick={handleCancel}
                className="px-2 py-1 text-xs bg-gray-700 text-white rounded hover:bg-gray-600"
              >
                Cancel
              </button>
            </>
          )}
          <button
            onClick={onDelete}
            className="px-2 py-1 text-xs bg-red-500/20 text-red-400 rounded hover:bg-red-500/30"
          >
            Delete
          </button>
        </div>
      )}
      {renderContent()}
    </div>
  );
}
