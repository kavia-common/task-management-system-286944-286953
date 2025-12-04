import { getEnv } from '../env';

const { apiBase } = getEnv();
const BASE = apiBase?.replace(/\/+$/, '') || '';

async function handle(res) {
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(text || `Request failed with ${res.status}`);
  }
  const ct = res.headers.get('content-type') || '';
  if (ct.includes('application/json')) return res.json();
  return null;
}

// PUBLIC_INTERFACE
export async function apiListTasks() {
  /** List tasks from backend API: GET /tasks */
  if (!BASE) throw new Error('API base not configured');
  const res = await fetch(`${BASE}/tasks`, { credentials: 'include' });
  return handle(res);
}

// PUBLIC_INTERFACE
export async function apiCreateTask(task) {
  /** Create a task: POST /tasks */
  if (!BASE) throw new Error('API base not configured');
  const res = await fetch(`${BASE}/tasks`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(task),
  });
  return handle(res);
}

// PUBLIC_INTERFACE
export async function apiUpdateTask(id, updates) {
  /** Update a task: PATCH /tasks/:id */
  if (!BASE) throw new Error('API base not configured');
  const res = await fetch(`${BASE}/tasks/${encodeURIComponent(id)}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(updates),
  });
  return handle(res);
}

// PUBLIC_INTERFACE
export async function apiDeleteTask(id) {
  /** Delete a task: DELETE /tasks/:id */
  if (!BASE) throw new Error('API base not configured');
  const res = await fetch(`${BASE}/tasks/${encodeURIComponent(id)}`, {
    method: 'DELETE',
    credentials: 'include',
  });
  return handle(res);
}
