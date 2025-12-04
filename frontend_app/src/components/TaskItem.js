import React, { useEffect, useRef, useState } from 'react';

// PUBLIC_INTERFACE
export default function TaskItem({ task, onToggle, onUpdate, onDelete }) {
  /** Single task row with toggle, inline edit, due, notes, and delete */
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(task.title);
  const [notes, setNotes] = useState(task.notes || '');
  const [dueDate, setDueDate] = useState(task.dueDate || '');
  const inputRef = useRef(null);

  useEffect(() => {
    if (editing && inputRef.current) inputRef.current.focus();
  }, [editing]);

  const submitEdit = () => {
    const trimmed = title.trim();
    if (!trimmed) return;
    onUpdate(task.id, { title: trimmed, notes, dueDate });
    setEditing(false);
  };

  const onKeyDownRow = (e) => {
    if (e.key === 'Enter' && editing) {
      submitEdit();
    } else if (e.key === 'Escape' && editing) {
      setTitle(task.title);
      setNotes(task.notes || '');
      setDueDate(task.dueDate || '');
      setEditing(false);
    }
  };

  const confirmDelete = () => {
    // Simple confirm dialog. Could be enhanced to custom modal.
    // eslint-disable-next-line no-alert
    if (window.confirm('Delete this task?')) {
      onDelete(task.id);
    }
  };

  return (
    <li className={`taskItem ${task.completed ? 'done' : ''}`} onKeyDown={onKeyDownRow}>
      <div className="left">
        <input
          id={`cb-${task.id}`}
          type="checkbox"
          checked={task.completed}
          onChange={() => onToggle(task.id)}
          aria-label={task.completed ? 'Mark as active' : 'Mark as completed'}
        />
      </div>

      {!editing ? (
        <div className="content" tabIndex={0}>
          <label htmlFor={`cb-${task.id}`} className="title">
            {task.title}
          </label>
          <div className="meta">
            {task.notes ? <span className="notes">{task.notes}</span> : null}
            {task.dueDate ? <span className="due">Due: {task.dueDate}</span> : null}
          </div>
        </div>
      ) : (
        <div className="editArea">
          <label className="visually-hidden" htmlFor={`edit-title-${task.id}`}>Edit title</label>
          <input
            id={`edit-title-${task.id}`}
            ref={inputRef}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <label className="visually-hidden" htmlFor={`edit-notes-${task.id}`}>Edit notes</label>
          <input
            id={`edit-notes-${task.id}`}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Notes"
          />
          <label className="visually-hidden" htmlFor={`edit-due-${task.id}`}>Edit due date</label>
          <input
            id={`edit-due-${task.id}`}
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
          />
        </div>
      )}

      <div className="actions">
        {!editing ? (
          <>
            <button className="btn subtle" onClick={() => setEditing(true)} aria-label="Edit task">Edit</button>
            <button className="btn danger" onClick={confirmDelete} aria-label="Delete task">Delete</button>
          </>
        ) : (
          <>
            <button className="btn primary" onClick={submitEdit} aria-label="Save edits">Save</button>
            <button className="btn subtle" onClick={() => { setEditing(false); setTitle(task.title); setNotes(task.notes || ''); setDueDate(task.dueDate || ''); }} aria-label="Cancel edits">Cancel</button>
          </>
        )}
      </div>
    </li>
  );
}
