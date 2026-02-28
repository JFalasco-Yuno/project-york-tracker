import { CATEGORY_COLORS } from '../data/constants';

export default function CategoryBadge({ category }) {
  const colorClass = CATEGORY_COLORS[category] || 'bg-gray-100 text-gray-700';
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${colorClass}`}>
      {category}
    </span>
  );
}
