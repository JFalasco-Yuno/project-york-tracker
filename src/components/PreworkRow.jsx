import { statusColors, priorityDot } from '../data/constants';
import CategoryBadge from './CategoryBadge';
import JiraLink from './JiraLink';

export default function PreworkRow({ item, onStatusChange, onEdit, onDelete }) {
  return (
    <tr className="border-b border-gray-100 hover:bg-gray-50">
      <td className="px-3 py-2 text-xs font-mono text-gray-400 whitespace-nowrap">{item.id}</td>

      <td className="px-3 py-2">
        <div className="text-sm text-gray-800">{priorityDot[item.priority]} {item.task}</div>
        {item.categories?.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-1">
            {item.categories.map(c => <CategoryBadge key={c} category={c} />)}
          </div>
        )}
        {item.jiraTickets?.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-1">
            {item.jiraTickets.map(t => <JiraLink key={t} id={t} />)}
          </div>
        )}
      </td>

      <td className="px-3 py-2 text-sm text-gray-600 whitespace-nowrap">{item.owner}</td>

      <td className={`px-3 py-2 text-xs font-semibold whitespace-nowrap ${item.due?.includes('BLOCKING') ? 'text-red-600' : 'text-gray-600'}`}>
        {item.due}
      </td>

      <td className="px-3 py-2 whitespace-nowrap">
        <select
          className={`text-xs border rounded px-1.5 py-0.5 font-semibold ${statusColors[item.status]}`}
          value={item.status}
          onChange={e => onStatusChange(item, e.target.value)}
        >
          <option value="open">Open</option>
          <option value="in-progress">In Progress</option>
          <option value="blocked">Blocked</option>
          <option value="done">Done</option>
        </select>
      </td>

      <td className="px-3 py-2 whitespace-nowrap">
        <div className="flex gap-1">
          <button
            onClick={() => onEdit(item)}
            className="text-xs text-blue-600 hover:text-blue-800 px-2 py-1 rounded hover:bg-blue-50 transition-colors"
          >
            Edit
          </button>
          <button
            onClick={() => onDelete(item)}
            className="text-xs text-red-500 hover:text-red-700 px-2 py-1 rounded hover:bg-red-50 transition-colors"
          >
            Del
          </button>
        </div>
      </td>
    </tr>
  );
}
