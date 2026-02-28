import { useState } from 'react';
import { statusColors, priorityDot, autoLinkJiraTickets } from '../data/constants';
import CategoryBadge from './CategoryBadge';
import JiraLink from './JiraLink';

export default function AgendaCard({ item, onStatusChange, onEdit }) {
  const [open, setOpen] = useState(false);

  const renderOpenItem = (text, idx) => {
    const parts = autoLinkJiraTickets(text);
    return (
      <li key={idx} className="text-sm text-red-700">
        {parts.map((part, j) =>
          part.type === 'jira'
            ? <JiraLink key={j} id={part.id} />
            : <span key={j}>{part.content}</span>
        )}
      </li>
    );
  };

  return (
    <div className={`border rounded-lg mb-3 overflow-hidden shadow-sm ${item.status === 'blocked' ? 'border-red-300' : 'border-gray-200'}`}>
      {/* Header row */}
      <div
        className="flex items-center justify-between px-4 py-3 cursor-pointer bg-white hover:bg-gray-50"
        onClick={() => setOpen(o => !o)}
      >
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <span className="text-xs font-mono text-gray-400 w-12 shrink-0">{item.id}</span>
          <span className="text-xs text-gray-500 w-24 shrink-0">{item.time}</span>
          <div className="min-w-0">
            <span className="font-semibold text-sm text-gray-800 truncate block">
              {priorityDot[item.priority]} {item.topic}
            </span>
            {item.categories?.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-1">
                {item.categories.map(c => <CategoryBadge key={c} category={c} />)}
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 ml-2 shrink-0">
          {/* Jira ticket badges */}
          {item.jiraTickets?.length > 0 && (
            <div className="hidden sm:flex gap-1">
              {item.jiraTickets.map(t => <JiraLink key={t} id={t} />)}
            </div>
          )}

          {/* Edit button */}
          <button
            onClick={e => { e.stopPropagation(); onEdit(item); }}
            className="text-xs text-gray-400 hover:text-blue-600 px-2 py-1 rounded hover:bg-blue-50 transition-colors"
          >
            Edit
          </button>

          {/* Status select */}
          <select
            className={`text-xs border rounded px-1.5 py-0.5 font-semibold ${statusColors[item.status]}`}
            value={item.status}
            onClick={e => e.stopPropagation()}
            onChange={e => { e.stopPropagation(); onStatusChange(item, e.target.value); }}
          >
            <option value="open">Open</option>
            <option value="in-progress">In Progress</option>
            <option value="blocked">Blocked</option>
            <option value="done">Done</option>
          </select>

          <span className="text-gray-400 text-sm">{open ? '▲' : '▼'}</span>
        </div>
      </div>

      {/* Expanded detail */}
      {open && (
        <div className="bg-gray-50 border-t border-gray-200 px-4 py-3 space-y-3">
          <div>
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">Context</p>
            <p className="text-sm text-gray-700">{item.context}</p>
          </div>
          <div>
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">Sub-topics</p>
            <ul className="list-disc list-inside space-y-0.5">
              {item.subtopics.map((s, i) => <li key={i} className="text-sm text-gray-700">{s}</li>)}
            </ul>
          </div>
          <div>
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">Key Questions to Resolve</p>
            <ul className="list-disc list-inside space-y-0.5">
              {item.keyQuestions.map((q, i) => <li key={i} className="text-sm text-gray-700">{q}</li>)}
            </ul>
          </div>
          <div>
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">Open Items / Blockers</p>
            <ul className="list-disc list-inside space-y-0.5">
              {item.openItems.map(renderOpenItem)}
            </ul>
          </div>
          <div className="flex items-start gap-2 flex-wrap">
            <div className="flex items-center gap-1">
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wide">Owner:</p>
              <p className="text-sm text-gray-700">{item.owner}</p>
            </div>
            {item.jiraTickets?.length > 0 && (
              <div className="flex items-center gap-1 flex-wrap sm:hidden">
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wide">Jira:</p>
                {item.jiraTickets.map(t => <JiraLink key={t} id={t} />)}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
