import { motion } from "framer-motion";
import { FiMapPin, FiBriefcase, FiUsers, FiBook } from "react-icons/fi";

export default function ProfileCard({ profileData, portfolio: _portfolio, username }) {
  const data = profileData;

  if (!data) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative bg-gray-900/60 backdrop-blur-xl rounded-2xl p-6 border border-gray-800 overflow-hidden shadow-2xl"
    >
      <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 blur-[100px] rounded-full pointer-events-none" />
      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 relative z-10">
        <div className="relative group">
          <div className="absolute inset-0 bg-emerald-500 rounded-full blur-md opacity-30 group-hover:opacity-50 transition-opacity" />
          {data?.avatarUrl ? (
            <img
              src={data.avatarUrl}
              alt={data.login}
              className="w-24 h-24 sm:w-28 sm:h-28 rounded-full object-cover border-2 border-gray-800 relative z-10"
            />
          ) : (
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-gray-800 border-2 border-gray-700 flex items-center justify-center text-3xl font-bold text-gray-400 relative z-10">
              {username?.charAt(0).toUpperCase()}
            </div>
          )}
        </div>
        
        <div className="flex-1 text-center sm:text-left min-w-0">
          <h2 className="text-2xl font-bold text-white truncate mb-1">
            {data?.name || username}
          </h2>
          <p className="text-emerald-400 text-sm font-medium mb-3">@{data?.login || username}</p>
          
          {data?.bio && (
            <p className="text-sm text-gray-300 mb-4 max-w-xl leading-relaxed">{data.bio}</p>
          )}
          
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 text-xs font-medium text-gray-400">
            {data?.location && (
              <span className="flex items-center gap-1.5 bg-gray-800/50 px-2.5 py-1.5 rounded-lg border border-gray-700/50">
                <FiMapPin className="text-emerald-500" /> {data.location}
              </span>
            )}
            {data?.company && (
              <span className="flex items-center gap-1.5 bg-gray-800/50 px-2.5 py-1.5 rounded-lg border border-gray-700/50">
                <FiBriefcase className="text-emerald-500" /> {data.company}
              </span>
            )}
            {data?.publicRepos?.totalCount !== undefined && (
              <span className="flex items-center gap-1.5 bg-gray-800/50 px-2.5 py-1.5 rounded-lg border border-gray-700/50">
                <FiBook className="text-emerald-500" /> {data.publicRepos.totalCount} repos
              </span>
            )}
            {data?.followers !== undefined && (
              <span className="flex items-center gap-1.5 bg-gray-800/50 px-2.5 py-1.5 rounded-lg border border-gray-700/50">
                <FiUsers className="text-emerald-500" /> {data.followers} followers
              </span>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}