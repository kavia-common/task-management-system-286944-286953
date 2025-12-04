const STORAGE_KEY = 'todo.tasks.v1';

// PUBLIC_INTERFACE
export function loadTasks() {
  /** Load tasks from localStorage */
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed;
  } catch {
    return [];
  }
}

// PUBLIC_INTERFACE
export function saveTasks(tasks) {
  /** Save tasks array to localStorage */
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  } catch {
    // ignore
  }
}

// PUBLIC_INTERFACE
export function genId() {
  /** Generate a simple unique id */
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}
