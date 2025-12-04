import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { getEnv } from '../env';
import { loadTasks, saveTasks, genId } from '../services/storage';
import { apiListTasks, apiCreateTask, apiUpdateTask, apiDeleteTask } from '../services/api';

const { useApi } = getEnv();

function normalizeTask(t) {
  return {
    id: t.id,
    title: t.title?.trim() || '',
    notes: t.notes || '',
    dueDate: t.dueDate || '',
    completed: !!t.completed,
    createdAt: t.createdAt || new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

// PUBLIC_INTERFACE
export function useTasks() {
  /** Manage tasks with persistence (localStorage by default, optional API) and UI helpers */
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all | active | completed
  const [search, setSearch] = useState('');
  const liveRef = useRef(null);

  // load initial
  useEffect(() => {
    let isMounted = true;

    async function init() {
      setLoading(true);
      try {
        if (useApi) {
          const data = await apiListTasks();
          if (isMounted) setTasks(Array.isArray(data) ? data : []);
        } else {
          if (isMounted) setTasks(loadTasks());
        }
      } catch {
        // In case API fails, fall back to storage
        if (isMounted) setTasks(loadTasks());
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    init();
    return () => {
      isMounted = false;
    };
  }, []);

  // persist to storage in storage mode
  useEffect(() => {
    if (!useApi) saveTasks(tasks);
  }, [tasks]);

  const announce = useCallback((msg) => {
    if (liveRef.current) {
      liveRef.current.textContent = '';
      // small delay to ensure SR announces updates
      setTimeout(() => {
        if (liveRef.current) liveRef.current.textContent = msg;
      }, 10);
    }
  }, []);

  const addTask = useCallback(
    async ({ title, notes = '', dueDate = '' }) => {
      const trimmed = (title || '').trim();
      if (!trimmed) return;
      const newTask = normalizeTask({
        id: genId(),
        title: trimmed,
        notes,
        dueDate,
        completed: false,
        createdAt: new Date().toISOString(),
      });

      if (useApi) {
        try {
          const created = await apiCreateTask(newTask);
          setTasks((cur) => [created || newTask, ...cur]);
          announce('Task added');
        } catch {
          // fallback local update
          setTasks((cur) => [newTask, ...cur]);
          announce('Task added (offline)');
        }
      } else {
        setTasks((cur) => [newTask, ...cur]);
        announce('Task added');
      }
    },
    [announce]
  );

  const updateTask = useCallback(
    async (id, updates) => {
      if (useApi) {
        try {
          const updated = await apiUpdateTask(id, updates);
          setTasks((cur) => cur.map((t) => (t.id === id ? { ...t, ...(updated || updates), updatedAt: new Date().toISOString() } : t)));
          announce('Task updated');
          return;
        } catch {
          // continue to local update
        }
      }
      setTasks((cur) => cur.map((t) => (t.id === id ? { ...t, ...updates, updatedAt: new Date().toISOString() } : t)));
      announce('Task updated');
    },
    [announce]
  );

  const removeTask = useCallback(
    async (id) => {
      if (useApi) {
        try {
          await apiDeleteTask(id);
          setTasks((cur) => cur.filter((t) => t.id !== id));
          announce('Task deleted');
          return;
        } catch {
          // fallback
        }
      }
      setTasks((cur) => cur.filter((t) => t.id !== id));
      announce('Task deleted');
    },
    [announce]
  );

  const toggleTask = useCallback(
    async (id) => {
      const t = tasks.find((x) => x.id === id);
      if (!t) return;
      const next = !t.completed;
      await updateTask(id, { completed: next });
      announce(next ? 'Task completed' : 'Task marked active');
    },
    [tasks, updateTask, announce]
  );

  const clearCompleted = useCallback(async () => {
    const completedIds = tasks.filter((t) => t.completed).map((t) => t.id);
    for (const id of completedIds) {
      // Sequential deletes to keep simple
      // eslint-disable-next-line no-await-in-loop
      await removeTask(id);
    }
    announce('Cleared completed tasks');
  }, [tasks, removeTask, announce]);

  const filtered = useMemo(() => {
    let list = tasks;
    if (filter === 'active') list = list.filter((t) => !t.completed);
    if (filter === 'completed') list = list.filter((t) => t.completed);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (t) => t.title.toLowerCase().includes(q) || (t.notes || '').toLowerCase().includes(q)
      );
    }
    return list;
  }, [tasks, filter, search]);

  const activeCount = useMemo(() => tasks.filter((t) => !t.completed).length, [tasks]);
  const completedCount = useMemo(() => tasks.filter((t) => t.completed).length, [tasks]);

  return {
    tasks,
    filtered,
    loading,
    filter,
    setFilter,
    search,
    setSearch,
    activeCount,
    completedCount,
    addTask,
    updateTask,
    removeTask,
    toggleTask,
    clearCompleted,
    liveRef,
  };
}
