const HISTORY_KEY = 'sicura_analysis_history';
const MAX_ITEMS = 50;

export function loadHistory() {
  try {
    return JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]');
  } catch {
    return [];
  }
}

export function saveToHistory(entry) {
  const existing = loadHistory();
  const record = {
    ...entry,
    savedAt: new Date().toISOString(),
    id: entry.id || `local-${Date.now()}`,
  };
  const updated = [record, ...existing.filter((r) => r.id !== record.id)].slice(0, MAX_ITEMS);
  localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
  return updated;
}

export function clearHistory() {
  localStorage.removeItem(HISTORY_KEY);
}
