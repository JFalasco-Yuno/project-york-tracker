import { CATEGORIES, CATEGORY_COLORS } from '../data/constants';

export default function CategoryFilter({ value, onChange }) {
  return (
    <div className="flex flex-wrap gap-2 mb-4">
      <button
        onClick={() => onChange('all')}
        className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors ${
          value === 'all'
            ? 'bg-gray-800 text-white border-gray-800'
            : 'bg-white text-gray-600 border-gray-300 hover:border-gray-400'
        }`}
      >
        All
      </button>
      {CATEGORIES.map(cat => (
        <button
          key={cat}
          onClick={() => onChange(value === cat ? 'all' : cat)}
          className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors ${
            value === cat
              ? `${CATEGORY_COLORS[cat]} border-current`
              : 'bg-white text-gray-500 border-gray-200 hover:border-gray-400'
          }`}
        >
          {cat}
        </button>
      ))}
    </div>
  );
}
