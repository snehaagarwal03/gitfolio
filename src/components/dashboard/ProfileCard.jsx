export default function ProfileCard({ profileData, portfolio: _portfolio, username }) {
  const data = profileData;

  return (
    <div className="bg-gray-900 rounded-xl p-5 border border-gray-800 flex items-start gap-4">
      {data?.avatarUrl && (
        <img
          src={data.avatarUrl}
          alt={data.login}
          className="w-16 h-16 rounded-full object-cover"
        />
      )}
      <div className="flex-1 min-w-0">
        <h2 className="text-lg font-semibold text-white truncate">
          {data?.name || username}
        </h2>
        {data?.bio && (
          <p className="text-sm text-gray-400 mt-1">{data.bio}</p>
        )}
        <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
          {data?.location && <span>{data.location}</span>}
          {data?.company && <span>{data.company}</span>}
          {data?.publicRepos?.totalCount !== undefined && (
            <span>{data.publicRepos.totalCount} repos</span>
          )}
          {data?.followers !== undefined && (
            <span>{data.followers} followers</span>
          )}
        </div>
      </div>
    </div>
  );
}
