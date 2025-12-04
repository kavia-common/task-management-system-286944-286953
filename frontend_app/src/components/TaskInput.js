import React, { useState } from 'react';

// PUBLIC_INTERFACE
export default function TaskInput({ onAdd }) {
  /** Input form to add a new task with title, notes, and due date */
  const [title, setTitle] = useState('');
  const [notes, setNotes] = useState('');
  const [dueDate, setDueDate] = useState('');

  const submit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    onAdd({ title, notes, dueDate });
    setTitle('');
    setNotes('');
    setDueDate('');
  };

  return (
    <form className="taskInput" onSubmit={submit} aria-label="Add task form">
      <div className="field">
        <label htmlFor="title">Task</label>
        <input
          id="title"
          type="text"
          placeholder="What needs to be done?"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>

      <div className="field">
        <label htmlFor="notes">Notes</label>
        <input
          id="notes"
          type="text"
          placeholder="Optional notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />
      </div>

      <div className="field">
        <label htmlFor="due">Due</label>
        <input
          id="due"
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
        />
      </div>

      <div className="actions">
        <button className="btn primary" type="submit" aria-label="Add task">
          Add
        </button>
      </div>
    </form>
  );
}
