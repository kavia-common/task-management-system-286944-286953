import React from 'react';
import TaskItem from './TaskItem';

// PUBLIC_INTERFACE
export default function TaskList({ tasks, onToggle, onUpdate, onDelete }) {
  /** Render list of TaskItem with empty state */
  if (!tasks.length) {
    return <p className="empty">No tasks to show</p>;
  }
  return (
    <ul className="taskList" role="list" aria-label="Tasks">
      {tasks.map((t) => (
        <TaskItem key={t.id} task={t} onToggle={onToggle} onUpdate={onUpdate} onDelete={onDelete} />
      ))}
    </ul>
  );
}
