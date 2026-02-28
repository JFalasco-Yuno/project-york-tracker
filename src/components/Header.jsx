import ProgressBar from './ProgressBar';

export default function Header({ counts, user, logout, preworkDone, preworkTotal }) {
  return (
    <div className="bg-gray-900 text-white px-6 py-4">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-start justify-between flex-wrap gap-3">
          {/* Title */}
          <div>
            <p className="text-xs text-gray-400 uppercase tracking-widest mb-0.5">Project York</p>
            <h1 className="text-xl font-bold">Integration Workshop Tracker</h1>
            <p className="text-sm text-gray-400 mt-0.5">
              March 9–10, 2026 · Zuora HQ, Foster City CA · 1001 E Hillsdale Blvd Ste 500
            </p>
          </div>

          {/* Right side: counts + progress + user */}
          <div className="flex items-center gap-4 flex-wrap">
            {/* Status counts */}
            <div className="flex gap-3 text-sm">
              <div className="text-center">
                <div className="text-lg font-bold text-red-400">{counts.blocked}</div>
                <div className="text-gray-400 text-xs">Blocked</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-blue-300">{counts.open}</div>
                <div className="text-gray-400 text-xs">Open</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-yellow-300">{counts['in-progress']}</div>
                <div className="text-gray-400 text-xs">In Progress</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-green-400">{counts.done}</div>
                <div className="text-gray-400 text-xs">Done</div>
              </div>
            </div>

            {/* Pre-work progress bar */}
            <ProgressBar done={preworkDone} total={preworkTotal} compact />

            {/* User avatar + logout */}
            {user && (
              <div className="flex items-center gap-2">
                {user.picture ? (
                  <img
                    src={user.picture}
                    alt={user.name}
                    className="w-8 h-8 rounded-full border-2 border-gray-600"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center text-xs font-bold">
                    {(user.name || user.email || '?')[0].toUpperCase()}
                  </div>
                )}
                <div className="hidden sm:block">
                  <p className="text-xs font-semibold text-gray-200 leading-tight">
                    {user.given_name || user.name}
                  </p>
                  <button
                    onClick={logout}
                    className="text-xs text-gray-400 hover:text-gray-200 transition-colors"
                  >
                    Sign out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3 mt-2 text-xs text-gray-400 flex-wrap">
          <span>Rooms: US FC-Presidio (6) · US FC-Pulgas Ridge (8)</span>
          <span>·</span>
          <span>🔴 Critical · 🟠 High · 🟡 Medium</span>
        </div>
      </div>
    </div>
  );
}
