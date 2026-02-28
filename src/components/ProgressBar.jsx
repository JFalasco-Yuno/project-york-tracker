export default function ProgressBar({ done, total, compact = false }) {
  const pct = total > 0 ? Math.round((done / total) * 100) : 0;
  const barColor = pct >= 75 ? 'bg-green-500' : pct >= 40 ? 'bg-yellow-400' : 'bg-red-500';
  const textColor = pct >= 75 ? 'text-green-400' : pct >= 40 ? 'text-yellow-300' : 'text-red-400';

  if (compact) {
    return (
      <div className="min-w-[120px]">
        <div className="flex justify-between items-center text-xs mb-1">
          <span className="text-gray-400">Pre-work</span>
          <span className={`font-bold ${textColor}`}>{done}/{total}</span>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-1.5">
          <div
            className={`${barColor} h-1.5 rounded-full transition-all duration-300`}
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 px-4 py-3 mb-4">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-semibold text-gray-700">Pre-work Progress</span>
        <span className={`text-sm font-bold ${pct >= 75 ? 'text-green-600' : pct >= 40 ? 'text-yellow-600' : 'text-red-600'}`}>
          {done}/{total} done ({pct}%)
        </span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2.5">
        <div
          className={`${barColor} h-2.5 rounded-full transition-all duration-300`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
