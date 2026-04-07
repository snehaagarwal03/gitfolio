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
          <div className="mb-8">
            <label className="cursor-pointer inline-block group">
              <div className="relative">
                <img
                  src={image || "https://via.placeholder.com/150"}
                  alt="Profile"
                  className={`w-32 h-32 rounded-full object-cover mx-auto border-4 transition-all group-hover:border-emerald-500/50 ${
                    isDark ? "border-slate-700" : "border-gray-200"
                  }`}
                />
                <div className="absolute inset-0 rounded-full bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center mx-auto w-32 h-32">
                  <span className="text-white text-xs font-medium">Change</span>
                </div>
              </div>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files[0]) onImageUpload(e.target.files[0]);
                }}
              />
            </label>
          </div>
        )}
        {editing ? (
          <div className="max-w-lg mx-auto space-y-4">
            <input
              value={title || ""}
              onChange={(e) => setLocalContent({ ...localContent, title: e.target.value })}
              className={`w-full text-4xl font-bold bg-transparent border-b-2 focus:border-emerald-500 outline-none text-center pb-2 transition-colors ${
                isDark ? "border-slate-700" : "border-gray-300"
              }`}
              placeholder="Title"
            />
            <input
              value={subtitle || ""}
              onChange={(e) => setLocalContent({ ...localContent, subtitle: e.target.value })}
              className={`w-full text-lg bg-transparent border-b-2 focus:border-emerald-500 outline-none text-center pb-2 transition-colors ${
                isDark ? "border-slate-700" : "border-gray-300"
              }`}
              placeholder="Subtitle"
            />
          </div>
        ) : (
          <>
            <h1 className="text-4xl sm:text-5xl font-bold mb-3 tracking-tight">{title || "Developer"}</h1>
            <p className="text-lg opacity-60 max-w-xl mx-auto">{subtitle || ""}</p>
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
            rows={5}
            className={`w-full bg-transparent border-2 rounded-xl p-4 focus:border-emerald-500 outline-none transition-colors text-sm leading-relaxed ${
              isDark ? "border-slate-700" : "border-gray-300"
            }`}
          />
        ) : (
          <p className="opacity-70 leading-relaxed text-sm max-w-2xl">{text || ""}</p>
        )}
      </div>
    );
  }

  function renderSkills() {
    const { items } = localContent;
    const skills = items || [];
    return (
      <div>
        <h2 className="text-2xl font-bold mb-5">{section.title || "Skills"}</h2>
        {editing ? (
          <input
            value={Array.isArray(skills) ? skills.join(", ") : ""}
            onChange={(e) =>
              setLocalContent({
                ...localContent,
                items: e.target.value.split(",").map((s) => s.trim()).filter(Boolean),
              })
            }
            className={`w-full bg-transparent border-2 rounded-xl p-3 focus:border-emerald-500 outline-none text-sm transition-colors ${
              isDark ? "border-slate-700" : "border-gray-300"
            }`}
            placeholder="Skill1, Skill2, Skill3"
          />
        ) : (
          <div className="flex flex-wrap gap-2">
            {skills.map((skill, i) => (
              <span
                key={i}
                className={`px-3.5 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  isDark
                    ? "bg-emerald-500/[0.08] text-emerald-400 border border-emerald-500/20"
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
              className={`p-5 rounded-xl border transition-colors ${
                isDark ? "border-white/[0.06] bg-slate-900/40 hover:bg-slate-900/60" : "border-gray-200 bg-white hover:bg-gray-50"
              }`}
            >
              <div className="flex items-start justify-between gap-2 mb-2">
                <h3 className="font-semibold text-sm">{project.name}</h3>
                {project.stars > 0 && (
                  <span className="text-xs opacity-50 shrink-0">{project.stars}</span>
                )}
              </div>
              <p className="text-xs opacity-60 leading-relaxed mb-3">{project.description}</p>
              {project.tech && (
                <div className="flex flex-wrap gap-1.5">
                  {(Array.isArray(project.tech) ? project.tech : []).map((t, j) => (
                    <span
                      key={j}
                      className={`text-xs px-2 py-0.5 rounded-md ${
                        isDark ? "bg-slate-800 text-slate-400" : "bg-gray-100 text-gray-600"
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
        <h2 className="text-2xl font-bold mb-5">{section.title}</h2>
        <div className="space-y-3">
          {listItems.map((item, i) => (
            <div
              key={i}
              className={`p-4 rounded-xl border ${
                isDark ? "bg-slate-900/30 border-white/[0.04]" : "bg-white border-gray-200"
              }`}
            >
              {typeof item === "string" ? (
                <p className="text-sm opacity-70">{item}</p>
              ) : (
                <div>
                  {(item.role || item.degree) && (
                    <h3 className="font-semibold text-sm mb-0.5">{item.role || item.degree}</h3>
                  )}
                  {(item.company || item.institution) && (
                    <p className="text-xs opacity-60">{item.company || item.institution}</p>
                  )}
                  {(item.duration || item.year) && (
                    <p className="text-xs opacity-40 mt-0.5">{item.duration || item.year}</p>
                  )}
                  {item.description && (
                    <p className="text-sm opacity-70 mt-2">{item.description}</p>
                  )}
                  {item.highlights && (
                    <ul className="text-sm opacity-70 mt-2 ml-4 list-disc space-y-1">
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
    <div className="relative">
      {editMode && (
        <div className="absolute -top-3 right-0 flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
          {!editing && section.type !== "hero" && (
            <button
              onClick={() => setEditing(true)}
              className="px-3 py-1.5 text-xs bg-slate-800 text-white rounded-lg hover:bg-slate-700 border border-white/[0.06] transition-colors"
            >
              Edit
            </button>
          )}
          {editing && (
            <>
              <button
                onClick={handleSave}
                className="px-3 py-1.5 text-xs bg-emerald-500 text-gray-900 font-bold rounded-lg hover:bg-emerald-400 transition-colors"
              >
                Save
              </button>
              <button
                onClick={handleCancel}
                className="px-3 py-1.5 text-xs bg-slate-800 text-white rounded-lg hover:bg-slate-700 border border-white/[0.06] transition-colors"
              >
                Cancel
              </button>
            </>
          )}
          <button
            onClick={onDelete}
            className="px-3 py-1.5 text-xs bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500/20 border border-red-500/20 transition-colors"
          >
            Delete
          </button>
        </div>
      )}
      {renderContent()}
    </div>
  );
}
