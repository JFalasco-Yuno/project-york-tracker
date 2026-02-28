import { useState } from 'react';
import { CATEGORIES, CATEGORY_COLORS, statusColors } from '../data/constants';

export default function TaskModal({ mode, item, section, onSave, onClose }) {
  const isStructural = section === 'day1' || section === 'day2';

  const [form, setForm] = useState({
    id: item?.id || '',
    section: item?.section || section,
    task: item?.task || '',
    owner: item?.owner || '',
    due: item?.due || '',
    status: item?.status || 'open',
    priority: item?.priority || 'medium',
    categories: item?.categories || [],
    jiraTickets: item?.jiraTickets || [],
    _rowIndex: item?._rowIndex,
  });

  const [jiraInput, setJiraInput] = useState((item?.jiraTickets || []).join(', '));

  const toggleCategory = (cat) => {
    setForm(f => ({
      ...f,
      categories: f.categories.includes(cat)
        ? f.categories.filter(c => c !== cat)
        : [...f.categories, cat],
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const tickets = jiraInput.split(',').map(s => s.trim()).filter(Boolean);
    onSave({ ...form, jiraTickets: tickets });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-900">
            {mode === 'add' ? 'Add Pre-work Item' : 'Edit Item'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl leading-none">&times;</button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
          {/* Topic / Task field */}
          {isStructural ? (
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">Topic</label>
              <p className="text-sm text-gray-800 bg-gray-50 rounded-lg px-3 py-2 border border-gray-200">{item?.topic}</p>
            </div>
          ) : (
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">Task</label>
              <input
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={form.task}
                onChange={e => setForm(f => ({ ...f, task: e.target.value }))}
                placeholder="Task description…"
                required
              />
            </div>
          )}

          {/* Owner + Due — prework only */}
          {!isStructural && (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">Owner</label>
                <input
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={form.owner}
                  onChange={e => setForm(f => ({ ...f, owner: e.target.value }))}
                  placeholder="Name / Team"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">Due</label>
                <input
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={form.due}
                  onChange={e => setForm(f => ({ ...f, due: e.target.value }))}
                  placeholder="e.g. Before Mar 9"
                />
              </div>
            </div>
          )}

          {/* Status + Priority */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">Status</label>
              <select
                className={`w-full border rounded-lg px-3 py-2 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 ${statusColors[form.status]}`}
                value={form.status}
                onChange={e => setForm(f => ({ ...f, status: e.target.value }))}
              >
                <option value="open">Open</option>
                <option value="in-progress">In Progress</option>
                <option value="blocked">Blocked</option>
                <option value="done">Done</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">Priority</label>
              <select
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={form.priority}
                onChange={e => setForm(f => ({ ...f, priority: e.target.value }))}
              >
                <option value="critical">🔴 Critical</option>
                <option value="high">🟠 High</option>
                <option value="medium">🟡 Medium</option>
                <option value="low">⚪ Low</option>
              </select>
            </div>
          </div>

          {/* Categories */}
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Categories</label>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map(cat => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => toggleCategory(cat)}
                  className={`px-3 py-1 rounded-full text-xs font-semibold border-2 transition-colors ${
                    form.categories.includes(cat)
                      ? `${CATEGORY_COLORS[cat]} border-current`
                      : 'bg-gray-50 text-gray-500 border-gray-200 hover:border-gray-400'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Jira Tickets */}
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">
              Jira Tickets <span className="font-normal normal-case text-gray-400">(comma-separated)</span>
            </label>
            <input
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="OR-123, G-04, …"
              value={jiraInput}
              onChange={e => setJiraInput(e.target.value)}
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-2 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-semibold text-gray-600 hover:text-gray-800 rounded-lg hover:bg-gray-100 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-sm font-semibold bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              {mode === 'add' ? 'Add Item' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
