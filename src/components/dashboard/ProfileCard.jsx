import { motion } from "framer-motion";
import { FiMapPin, FiBriefcase, FiUsers, FiBook } from "react-icons/fi";

export default function ProfileCard({ profileData, portfolio: _portfolio, username }) {
  const data = profileData;

  if (!data) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="relative rounded-2xl bg-slate-900/40 border border-white/[0.06] p-6 overflow-hidden"
    >
      <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/[0.04] blur-[80px] rounded-full pointer-events-none" />
      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 relative z-10">
        <div className="relative group shrink-0">
          <div className="absolute -inset-1 bg-gradient-to-br from-emerald-400 to-teal-600 rounded-full opacity-30 blur-sm group-hover:opacity-50 transition-opacity" />
          {data?.avatarUrl ? (
            <img
              src={data.avatarUrl}
              alt={data.login}
              className="w-20 h-20 rounded-full object-cover border-2 border-slate-800 relative z-10"
            />
          ) : (
            <div className="w-20 h-20 rounded-full bg-slate-800 border-2 border-slate-700 flex items-center justify-center text-2xl font-bold text-slate-400 relative z-10">
              {username?.charAt(0).toUpperCase()}
            </div>
          )}
        </div>

        <div className="flex-1 text-center sm:text-left min-w-0">
          <h2 className="text-xl font-bold text-white truncate">
            {data?.name || username}
          </h2>
          <p className="text-emerald-400 text-sm font-medium mb-2">@{data?.login || username}</p>
          {data?.bio && (
            <p className="text-sm text-slate-400 max-w-lg leading-relaxed mb-3">{data.bio}</p>
          )}

          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 text-xs font-medium text-slate-500">
            {data?.location && (
              <span className="flex items-center gap-1.5 bg-slate-800/50 px-2.5 py-1 rounded-lg border border-white/[0.04]">
                <FiMapPin className="text-emerald-500" size={12} /> {data.location}
              </span>
            )}
            {data?.company && (
              <span className="flex items-center gap-1.5 bg-slate-800/50 px-2.5 py-1 rounded-lg border border-white/[0.04]">
                <FiBriefcase className="text-emerald-500" size={12} /> {data.company}
              </span>
            )}
            {data?.publicRepos?.totalCount !== undefined && (
              <span className="flex items-center gap-1.5 bg-slate-800/50 px-2.5 py-1 rounded-lg border border-white/[0.04]">
                <FiBook className="text-emerald-500" size={12} /> {data.publicRepos.totalCount} repos
              </span>
            )}
            {data?.followers !== undefined && (
              <span className="flex items-center gap-1.5 bg-slate-800/50 px-2.5 py-1 rounded-lg border border-white/[0.04]">
                <FiUsers className="text-emerald-500" size={12} /> {data.followers} followers
              </span>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
