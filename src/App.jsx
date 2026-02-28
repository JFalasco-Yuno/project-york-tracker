import { useState, useEffect, useCallback } from 'react';
import { useAuth } from './hooks/useAuth';
import { useSheets } from './hooks/useSheets';
import { DAY1 } from './data/day1';
import { DAY2 } from './data/day2';
import { PREWORK_INITIAL } from './data/prework';
import AuthGate from './components/AuthGate';
import Header from './components/Header';
import TabBar from './components/TabBar';
import CategoryFilter from './components/CategoryFilter';
import AgendaCard from './components/AgendaCard';
import PreworkRow from './components/PreworkRow';
import ProgressBar from './components/ProgressBar';
import TaskModal from './components/TaskModal';
import ConfirmDialog from './components/ConfirmDialog';

// Merge hardcoded structural item with mutable sheet data
function mergeWithSheet(item, sheetRow) {
  if (!sheetRow) return { ...item, categories: [], jiraTickets: [] };
  return {
    ...item,
    status: sheetRow.status || item.status,
    priority: sheetRow.priority || item.priority,
    categories: sheetRow.categories || [],
    jiraTickets: sheetRow.jiraTickets || [],
    _rowIndex: sheetRow._rowIndex,
  };
}

// Generate next prework ID from existing items
function nextPreworkId(preworkItems) {
  const nums = preworkItems
    .map(i => parseInt(i.id.replace('P-', ''), 10))
    .filter(n => !isNaN(n));
  const max = nums.length > 0 ? Math.max(...nums) : 0;
  return `P-${String(max + 1).padStart(2, '0')}`;
}

export default function App() {
  const { isAuthenticated, user, login, logout, tokenRef, authError } = useAuth();
  const { loadTasks, updateTask, updateMutableFields, addTask, deleteTask } = useSheets(tokenRef);

  const [sheetData, setSheetData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sheetError, setSheetError] = useState(null);

  const [tab, setTab] = useState('day1');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [modal, setModal] = useState(null);         // { mode, item, section }
  const [confirmDelete, setConfirmDelete] = useState(null); // item to delete
  const [saving, setSaving] = useState(false);

  // Load all tasks from sheet on auth
  const reload = useCallback(async () => {
    setSheetError(null);
    try {
      const rows = await loadTasks();
      setSheetData(rows);
    } catch (e) {
      setSheetError(e.message);
    }
  }, [loadTasks]);

  useEffect(() => {
    if (!isAuthenticated) return;
    setLoading(true);
    reload().finally(() => setLoading(false));
  }, [isAuthenticated, reload]);

  // ── Derived data ──────────────────────────────────────────────────────────

  const sheetById = Object.fromEntries(sheetData.map(r => [r.id, r]));

  const day1Items = DAY1.map(item => mergeWithSheet(item, sheetById[item.id]));
  const day2Items = DAY2.map(item => mergeWithSheet(item, sheetById[item.id]));

  // Prework: prefer sheet data; fall back to PREWORK_INITIAL if sheet is empty
  const sheetPrework = sheetData.filter(r => r.section === 'prework');
  const preworkItems = sheetPrework.length > 0 ? sheetPrework : PREWORK_INITIAL;

  const filterByCat = (items) =>
    categoryFilter === 'all' ? items : items.filter(i => (i.categories || []).includes(categoryFilter));

  const allItems = [...day1Items, ...day2Items, ...preworkItems];
  const counts = {
    open: allItems.filter(i => i.status === 'open').length,
    'in-progress': allItems.filter(i => i.status === 'in-progress').length,
    blocked: allItems.filter(i => i.status === 'blocked').length,
    done: allItems.filter(i => i.status === 'done').length,
  };

  const preworkDone = preworkItems.filter(i => i.status === 'done').length;

  // ── Handlers ──────────────────────────────────────────────────────────────

  const handleStatusChange = async (item, newStatus) => {
    // Optimistic UI update
    setSheetData(prev =>
      prev.map(r => r.id === item.id ? { ...r, status: newStatus } : r)
    );
    try {
      const updated = { ...item, status: newStatus };
      if (item._rowIndex) {
        // Row exists in sheet — update mutable fields only for structural items,
        // or full row for prework
        if (item.section === 'prework') {
          await updateTask(updated);
        } else {
          await updateMutableFields(updated);
        }
      } else {
        // Row not yet in sheet — append it
        const section = item.id.startsWith('D1') ? 'day1' : item.id.startsWith('D2') ? 'day2' : 'prework';
        await addTask({ ...updated, section });
        await reload();
      }
    } catch (e) {
      setSheetError(`Failed to save: ${e.message}`);
      await reload(); // revert optimistic update
    }
  };

  const handleSaveModal = async (formData) => {
    setSaving(true);
    try {
      if (modal.mode === 'add') {
        const id = nextPreworkId(preworkItems);
        await addTask({ ...formData, id, section: 'prework' });
      } else {
        const isStructural = modal.section === 'day1' || modal.section === 'day2';
        if (isStructural) {
          if (formData._rowIndex) {
            await updateMutableFields(formData);
          } else {
            await addTask({ ...formData, section: modal.section });
          }
        } else {
          await updateTask(formData);
        }
      }
      await reload();
      setModal(null);
    } catch (e) {
      setSheetError(`Failed to save: ${e.message}`);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!confirmDelete) return;
    setSaving(true);
    try {
      await deleteTask(confirmDelete);
      await reload();
      setConfirmDelete(null);
    } catch (e) {
      setSheetError(`Failed to delete: ${e.message}`);
    } finally {
      setSaving(false);
    }
  };

  // ── Render ────────────────────────────────────────────────────────────────

  if (!isAuthenticated) {
    return <AuthGate login={login} authError={authError} />;
  }

  return (
    <div className="min-h-screen bg-gray-100 font-sans">
      <Header
        counts={counts}
        user={user}
        logout={logout}
        preworkDone={preworkDone}
        preworkTotal={15}
      />
      <TabBar tab={tab} setTab={setTab} />

      <div className="max-w-5xl mx-auto px-4 py-6">
        {/* Loading / error banners */}
        {loading && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg px-4 py-2 mb-4 text-sm text-blue-700">
            Loading tasks from Google Sheets…
          </div>
        )}
        {sheetError && (
          <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3 mb-4 text-sm text-red-700 flex items-start justify-between gap-3">
            <span>{sheetError}</span>
            <button onClick={() => setSheetError(null)} className="shrink-0 text-red-400 hover:text-red-600">&times;</button>
          </div>
        )}

        {/* Day 1 */}
        {tab === 'day1' && (
          <div>
            <div className="bg-blue-50 border border-blue-200 rounded-lg px-4 py-2 mb-4 text-sm text-blue-800">
              <strong>Day 1 Focus:</strong> Align on integration architecture, migration strategy, payment method coverage, processing & status mapping, and the embedded page implementation. Click any row to expand.
            </div>
            <CategoryFilter value={categoryFilter} onChange={setCategoryFilter} />
            {filterByCat(day1Items).map(item => (
              <AgendaCard
                key={item.id}
                item={item}
                onStatusChange={handleStatusChange}
                onEdit={it => setModal({ mode: 'edit', item: it, section: 'day1' })}
              />
            ))}
          </div>
        )}

        {/* Day 2 */}
        {tab === 'day2' && (
          <div>
            <div className="bg-purple-50 border border-purple-200 rounded-lg px-4 py-2 mb-4 text-sm text-purple-800">
              <strong>Day 2 Focus:</strong> Provisioning hierarchy design, dispute management & chargeback lifecycle, and enablement / support model. Click any row to expand.
            </div>
            <CategoryFilter value={categoryFilter} onChange={setCategoryFilter} />
            {filterByCat(day2Items).map(item => (
              <AgendaCard
                key={item.id}
                item={item}
                onStatusChange={handleStatusChange}
                onEdit={it => setModal({ mode: 'edit', item: it, section: 'day2' })}
              />
            ))}
          </div>
        )}

        {/* Pre-work */}
        {tab === 'prework' && (
          <div>
            <div className="bg-orange-50 border border-orange-200 rounded-lg px-4 py-2 mb-4 text-sm text-orange-800">
              <strong>Pre-work & Follow-ups:</strong> Items needed before the workshop or resolved by end of week March 14. Items marked BLOCKING must ship before March 9.
            </div>

            <ProgressBar done={preworkDone} total={preworkItems.length} />

            <CategoryFilter value={categoryFilter} onChange={setCategoryFilter} />

            <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-3 py-2 text-xs font-bold text-gray-500 uppercase">ID</th>
                      <th className="px-3 py-2 text-xs font-bold text-gray-500 uppercase">Task</th>
                      <th className="px-3 py-2 text-xs font-bold text-gray-500 uppercase">Owner</th>
                      <th className="px-3 py-2 text-xs font-bold text-gray-500 uppercase">Due</th>
                      <th className="px-3 py-2 text-xs font-bold text-gray-500 uppercase">Status</th>
                      <th className="px-3 py-2 text-xs font-bold text-gray-500 uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filterByCat(preworkItems).map(item => (
                      <PreworkRow
                        key={item.id}
                        item={item}
                        onStatusChange={handleStatusChange}
                        onEdit={it => setModal({ mode: 'edit', item: it, section: 'prework' })}
                        onDelete={it => setConfirmDelete(it)}
                      />
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <button
              onClick={() => setModal({ mode: 'add', item: null, section: 'prework' })}
              className="mt-4 flex items-center gap-2 px-4 py-2 text-sm font-semibold text-blue-600 border-2 border-dashed border-blue-300 rounded-lg hover:bg-blue-50 hover:border-blue-400 transition-colors w-full justify-center"
            >
              + Add Pre-work Item
            </button>
          </div>
        )}
      </div>

      {/* Modals */}
      {modal && (
        <TaskModal
          mode={modal.mode}
          item={modal.item}
          section={modal.section}
          onSave={handleSaveModal}
          onClose={() => setModal(null)}
          saving={saving}
        />
      )}

      {confirmDelete && (
        <ConfirmDialog
          item={confirmDelete}
          onConfirm={handleDeleteConfirm}
          onCancel={() => setConfirmDelete(null)}
        />
      )}
    </div>
  );
}
