export default function RepoSelector({ repos, selectedRepos, onToggle }) {
  if (!repos || repos.length === 0) {
    return (
      <p className="text-gray-500 text-sm py-4">No repositories found.</p>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-96 overflow-y-auto pr-1">
      {repos.map((repo) => {
        const isSelected = selectedRepos.some((s) => s.name === repo.name);
        return (
          <button
            key={repo.name}
            onClick={() => onToggle(repo)}
            className={`text-left p-4 rounded-lg border transition-colors ${
              isSelected
                ? "border-emerald-500 bg-emerald-500/5"
                : "border-gray-700 bg-gray-900 hover:border-gray-600"
            }`}
          >
            <div className="flex items-start justify-between gap-2">
              <h3 className="text-sm font-medium text-white truncate">
                {repo.name}
              </h3>
              {isSelected && (
                <span className="shrink-0 text-emerald-500 text-xs">Selected</span>
              )}
            </div>
            {repo.description && (
              <p className="text-xs text-gray-400 mt-1 line-clamp-2">
                {repo.description}
              </p>
            )}
            <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
              {repo.primaryLanguage?.name && (
                <span className="flex items-center gap-1">
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: repo.primaryLanguage.color || "#8b949e" }}
                  />
                  {repo.primaryLanguage.name}
                </span>
              )}
              {repo.stargazerCount > 0 && <span>{repo.stargazerCount} stars</span>}
              {repo.forkCount > 0 && <span>{repo.forkCount} forks</span>}
            </div>
          </button>
        );
      })}
    </div>
  );
}
