import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiStar, FiGitBranch, FiSearch, FiCheck } from "react-icons/fi";

export default function RepoSelector({ repos, selectedRepos, onToggle }) {
  const [search, setSearch] = useState("");

  const filteredRepos = repos.filter((r) =>
    r.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <div className="relative max-w-sm">
        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
          <FiSearch className="text-slate-500" size={15} />
        </div>
        <input
          type="text"
          placeholder="Search repositories..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 bg-slate-950/50 border border-white/[0.06] rounded-xl text-white text-sm placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all"
        />
      </div>

      {repos.length === 0 ? (
        <div className="text-center py-10 px-4 border border-dashed border-white/[0.08] rounded-xl bg-slate-900/20">
          <p className="text-slate-500 text-sm font-medium">No repositories found.</p>
          <p className="text-xs text-slate-600 mt-1">Make sure your GitHub account has public repositories.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[420px] overflow-y-auto pr-1 pb-2">
          <AnimatePresence>
            {filteredRepos.map((repo) => {
              const isSelected = selectedRepos.some((r) => r.name === repo.name);

              return (
                <motion.div
                  layout
                  initial={{ opacity: 0, scale: 0.97 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.97 }}
                  key={repo.name}
                  onClick={() => onToggle(repo)}
                  className={`cursor-pointer group relative p-4 rounded-xl border transition-all duration-200
                    ${
                      isSelected
                        ? "bg-emerald-500/[0.08] border-emerald-500/30"
                        : "bg-slate-900/30 border-white/[0.04] hover:border-white/[0.1] hover:bg-slate-900/60"
                    }
                  `}
                >
                  {/* Selection Indicator */}
                  <div className="absolute top-3.5 right-3.5">
                    <div className={`w-5 h-5 rounded-md flex items-center justify-center border transition-all duration-200 ${
                      isSelected
                        ? "border-emerald-500 bg-emerald-500 text-gray-900"
                        : "border-slate-700 group-hover:border-emerald-500/40"
                    }`}>
                      {isSelected && <FiCheck size={12} strokeWidth={3} />}
                    </div>
                  </div>

                  <div className="pr-8">
                    <h3 className={`text-sm font-semibold truncate mb-1.5 transition-colors ${
                      isSelected ? "text-emerald-400" : "text-white group-hover:text-slate-200"
                    }`}>
                      {repo.name}
                    </h3>
                    <p className="text-xs text-slate-500 line-clamp-2 min-h-[32px] mb-3">
                      {repo.description || "No description provided."}
                    </p>

                    <div className="flex items-center gap-3 text-xs text-slate-600">
                      {repo.primaryLanguage?.name && (
                        <div className="flex items-center gap-1.5">
                          <span
                            className="w-2 h-2 rounded-full"
                            style={{ backgroundColor: repo.primaryLanguage.color || "#10b981" }}
                          />
                          <span>{repo.primaryLanguage.name}</span>
                        </div>
                      )}
                      {repo.stargazerCount > 0 && (
                        <div className="flex items-center gap-1">
                          <FiStar size={11} /> {repo.stargazerCount}
                        </div>
                      )}
                      {repo.forkCount > 0 && (
                        <div className="flex items-center gap-1">
                          <FiGitBranch size={11} /> {repo.forkCount}
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
