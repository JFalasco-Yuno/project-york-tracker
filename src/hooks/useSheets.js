import { useRef } from 'react';

function taskToRow(task) {
  return [
    task.id || '',
    task.section || '',
    task.task || task.topic || '',
    task.owner || '',
    task.due || '',
    task.status || 'open',
    task.priority || 'medium',
    (task.categories || []).join(','),
    (task.jiraTickets || []).join(','),
    (task.subtopics || []).join('|'),
    (task.keyQuestions || []).join('|'),
    (task.openItems || []).join('|'),
  ];
}

function parseRow(row, idx) {
  return {
    _rowIndex: idx + 2, // 1-indexed; +1 for header row, +1 for 0-based offset
    id: row[0] || '',
    section: row[1] || '',
    task: row[2] || '',
    owner: row[3] || '',
    due: row[4] || '',
    status: row[5] || 'open',
    priority: row[6] || 'medium',
    categories: row[7] ? row[7].split(',').map(s => s.trim()).filter(Boolean) : [],
    jiraTickets: row[8] ? row[8].split(',').map(s => s.trim()).filter(Boolean) : [],
    subtopics: row[9] ? row[9].split('|').filter(Boolean) : [],
    keyQuestions: row[10] ? row[10].split('|').filter(Boolean) : [],
    openItems: row[11] ? row[11].split('|').filter(Boolean) : [],
  };
}

export function useSheets(tokenRef) {
  const SHEET_ID = import.meta.env.VITE_GOOGLE_SHEET_ID;
  const BASE = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}`;
  const sheetNumericIdRef = useRef(null);

  const getHeaders = () => ({
    Authorization: `Bearer ${tokenRef.current}`,
    'Content-Type': 'application/json',
  });

  const getSheetNumericId = async () => {
    if (sheetNumericIdRef.current !== null) return sheetNumericIdRef.current;
    const res = await fetch(`${BASE}?fields=sheets.properties`, { headers: getHeaders() });
    if (!res.ok) throw new Error('Failed to fetch spreadsheet metadata');
    const data = await res.json();
    const tasksSheet = data.sheets?.find(s => s.properties.title === 'Tasks');
    sheetNumericIdRef.current = tasksSheet?.properties?.sheetId ?? 0;
    return sheetNumericIdRef.current;
  };

  const loadTasks = async () => {
    const res = await fetch(`${BASE}/values/Tasks!A:L`, { headers: getHeaders() });
    if (!res.ok) throw new Error('Failed to load tasks from sheet');
    const data = await res.json();
    const rows = data.values || [];
    // Skip header row (index 0)
    return rows.slice(1).map((row, idx) => parseRow(row, idx));
  };

  // Update an existing row (requires _rowIndex)
  const updateTask = async (task) => {
    if (!task._rowIndex) throw new Error('Cannot update task without _rowIndex');
    const row = taskToRow(task);
    const range = encodeURIComponent(`Tasks!A${task._rowIndex}:L${task._rowIndex}`);
    const res = await fetch(`${BASE}/values/${range}?valueInputOption=RAW`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify({ values: [row] }),
    });
    if (!res.ok) throw new Error('Failed to update task');
  };

  // Update only the mutable fields (F=status, G=priority, H=categories, I=jiraTickets) of a day1/day2 row
  const updateMutableFields = async (task) => {
    if (!task._rowIndex) throw new Error('Cannot update task without _rowIndex');
    const range = encodeURIComponent(`Tasks!F${task._rowIndex}:I${task._rowIndex}`);
    const res = await fetch(`${BASE}/values/${range}?valueInputOption=RAW`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify({
        values: [[
          task.status || 'open',
          task.priority || 'medium',
          (task.categories || []).join(','),
          (task.jiraTickets || []).join(','),
        ]],
      }),
    });
    if (!res.ok) throw new Error('Failed to update mutable fields');
  };

  // Append a new row (for new tasks or first-time day1/day2 status write)
  const addTask = async (task) => {
    const row = taskToRow(task);
    const res = await fetch(
      `${BASE}/values/Tasks!A:L:append?valueInputOption=RAW&insertDataOption=INSERT_ROWS`,
      {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ values: [row] }),
      }
    );
    if (!res.ok) throw new Error('Failed to add task');
  };

  // Delete a row by its 1-indexed row number
  const deleteTask = async (task) => {
    if (!task._rowIndex) throw new Error('Cannot delete task without _rowIndex');
    const sheetNumericId = await getSheetNumericId();
    const res = await fetch(`${BASE}:batchUpdate`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({
        requests: [{
          deleteDimension: {
            range: {
              sheetId: sheetNumericId,
              dimension: 'ROWS',
              startIndex: task._rowIndex - 1, // 0-based
              endIndex: task._rowIndex,        // exclusive
            },
          },
        }],
      }),
    });
    if (!res.ok) throw new Error('Failed to delete task');
  };

  return { loadTasks, updateTask, updateMutableFields, addTask, deleteTask };
}
