import React, { useEffect, useState } from 'react';
import './theme.css';
import './App.css';
import Header from './components/Header';
import TaskInput from './components/TaskInput';
import Filters from './components/Filters';
import TaskList from './components/TaskList';
import { useTasks } from './hooks/useTasks';
import { getEnv } from './env';

// PUBLIC_INTERFACE
export default function App() {
  /** Single-page To-Do app with storage default and optional API mode */
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const {
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
  } = useTasks();

  const { useApi } = getEnv();

  return (
    <div className="App appGradient">
      <div className="themeToggle">
        <button
          className="btn subtle"
          onClick={() => setTheme((t) => (t === 'light' ? 'dark' : 'light'))}
          aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
        >
          {theme === 'light' ? '🌙 Dark' : '☀️ Light'}
        </button>
      </div>

      <div className="container">
        <Header />
        <section className="panel" aria-live="polite" aria-atomic="true">
          <div className="visually-hidden" aria-live="polite" ref={liveRef} />
          <p className="tagline" role="status">
            Mode: {useApi ? 'API' : 'Local Storage'}
          </p>
          <TaskInput onAdd={addTask} />
          <Filters
            filter={filter}
            setFilter={setFilter}
            search={search}
            setSearch={setSearch}
            activeCount={activeCount}
            completedCount={completedCount}
            onClearCompleted={clearCompleted}
          />
          {loading ? <p>Loading…</p> : <TaskList tasks={filtered} onToggle={toggleTask} onUpdate={updateTask} onDelete={removeTask} />}
        </section>
      </div>
    </div>
  );
}
