export default function ConfirmDialog({ item, onConfirm, onCancel }) {
  const label = item.task || item.topic || item.id;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-2">Delete Task</h2>
        <p className="text-sm text-gray-600 mb-1">Are you sure you want to delete:</p>
        <p className="text-sm font-semibold text-gray-800 bg-gray-50 rounded-lg px-3 py-2 mb-6 border border-gray-200">
          {item.id} — {label}
        </p>
        <p className="text-xs text-red-600 mb-6">This will permanently remove the row from the Google Sheet.</p>
        <div className="flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-sm font-semibold text-gray-600 hover:text-gray-800 rounded-lg hover:bg-gray-100 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 text-sm font-semibold bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
