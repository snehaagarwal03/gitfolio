import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiStar, FiGitBranch, FiCode, FiSearch, FiCheckCircle } from "react-icons/fi";

export default function RepoSelector({ repos, selectedRepos, onToggle }) {
  const [search, setSearch] = useState("");

  const filteredRepos = repos.filter((r) =>
    r.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="relative max-w-md">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <FiSearch className="text-gray-500" />
        </div>
        <input
          type="text"
          placeholder="Search repositories..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-11 pr-4 py-3 bg-gray-900/60 border border-gray-800 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 backdrop-blur-sm transition-all"
        />
      </div>

      {repos.length === 0 ? (
        <div className="text-center py-12 px-4 border border-gray-800 border-dashed rounded-2xl bg-gray-900/30">
          <p className="text-gray-400 font-medium">No repositories found.</p>
          <p className="text-sm text-gray-500 mt-2">Make sure your GitHub account has public repositories.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar pb-4">
          <AnimatePresence>
            {filteredRepos.map((repo) => {
              const isSelected = selectedRepos.some((r) => r.name === repo.name);
              
              return (
                <motion.div
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  key={repo.name}
                  onClick={() => onToggle(repo)}
                  className={`cursor-pointer group relative p-5 rounded-2xl border transition-all duration-300 backdrop-blur-sm
                    ${
                      isSelected
                        ? "bg-emerald-900/20 border-emerald-500/50 shadow-[0_0_15px_rgba(16,185,129,0.15)]"
                        : "bg-gray-900/40 border-gray-800 hover:border-gray-600 hover:bg-gray-900/80"
                    }
                  `}
                >
                  {/* Selection Indicator */}
                  <div className="absolute top-4 right-4">
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center border transition-colors ${
                      isSelected ? "border-emerald-500 bg-emerald-500 text-gray-900" : "border-gray-600 group-hover:border-emerald-500/50"
                    }`}>
                      {isSelected && <FiCheckCircle size={14} />}
                    </div>
                  </div>

                  <div className="pr-8">
                    <h3 className={`text-base font-bold truncate mb-2 transition-colors ${
                      isSelected ? "text-emerald-400" : "text-white group-hover:text-emerald-300"
                    }`}>
                      {repo.name}
                    </h3>
                    <p className="text-sm text-gray-400 line-clamp-2 min-h-[40px] mb-4">
                      {repo.description || "No description provided."}
                    </p>
                    
                    <div className="flex items-center gap-4 text-xs font-medium text-gray-500">
                      {repo.primaryLanguage?.name && (
                        <div className="flex items-center gap-1.5">
                          <span 
                            className="w-2.5 h-2.5 rounded-full" 
                            style={{ backgroundColor: repo.primaryLanguage.color || "#10b981" }} 
                          />
                          {repo.primaryLanguage.name}
                        </div>
                      )}
                      {repo.stargazerCount > 0 && (
                        <div className="flex items-center gap-1.5 hover:text-yellow-500 transition-colors">
                          <FiStar /> {repo.stargazerCount}
                        </div>
                      )}
                      {repo.forkCount > 0 && (
                        <div className="flex items-center gap-1.5 hover:text-emerald-500 transition-colors">
                          <FiGitBranch /> {repo.forkCount}
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