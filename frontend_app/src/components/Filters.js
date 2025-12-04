import React from 'react';

// PUBLIC_INTERFACE
export default function Filters({ filter, setFilter, search, setSearch, activeCount, completedCount, onClearCompleted }) {
  /** Render filter tabs and search input */
  return (
    <div className="filters" role="region" aria-label="Task filters">
      <div className="tabs" role="tablist" aria-label="Filters">
        <button
          role="tab"
          aria-selected={filter === 'all'}
          className={`tab ${filter === 'all' ? 'active' : ''}`}
          onClick={() => setFilter('all')}
        >
          All
        </button>
        <button
          role="tab"
          aria-selected={filter === 'active'}
          className={`tab ${filter === 'active' ? 'active' : ''}`}
          onClick={() => setFilter('active')}
        >
          Active ({activeCount})
        </button>
        <button
          role="tab"
          aria-selected={filter === 'completed'}
          className={`tab ${filter === 'completed' ? 'active' : ''}`}
          onClick={() => setFilter('completed')}
        >
          Completed ({completedCount})
        </button>
      </div>

      <div className="searchRow">
        <label htmlFor="search" className="visually-hidden">Search tasks</label>
        <input
          id="search"
          type="search"
          placeholder="Search tasks…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          aria-label="Search tasks"
        />
        <button
          type="button"
          className="btn subtle"
          onClick={onClearCompleted}
          aria-label="Clear completed tasks"
          disabled={completedCount === 0}
          title={completedCount === 0 ? 'No completed tasks' : 'Clear completed'}
        >
          Clear Completed
        </button>
      </div>
    </div>
  );
}
