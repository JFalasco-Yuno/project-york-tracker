const TABS = [
  { id: 'day1', label: 'Day 1 — Mar 9', subtitle: 'Payment Acceptance, Methods, Processing & Embedded Pages' },
  { id: 'day2', label: 'Day 2 — Mar 10', subtitle: 'Provisioning, Disputes & Enablement' },
  { id: 'prework', label: 'Pre-work / Follow-ups', subtitle: 'Due by end of week Mar 14' },
];

export default function TabBar({ tab, setTab }) {
  return (
    <div className="bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-5xl mx-auto flex gap-0 overflow-x-auto">
        {TABS.map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`px-5 py-3 text-sm font-semibold border-b-2 transition-colors whitespace-nowrap ${
              tab === t.id
                ? 'border-blue-600 text-blue-700 bg-blue-50'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <div>{t.label}</div>
            <div className={`text-xs font-normal mt-0.5 ${tab === t.id ? 'text-blue-500' : 'text-gray-400'}`}>
              {t.subtitle}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
