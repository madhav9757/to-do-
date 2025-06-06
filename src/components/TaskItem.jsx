import { marked } from "marked";

export default function TaskItem({ task, index, toggleTask, editTask, deleteTask }) {
  const handleDeleteClick = () => {
    // Show a confirmation dialog
    const isConfirmed = window.confirm("Are you sure you want to delete this task?");
    if (isConfirmed) {
      deleteTask(index); // Proceed with deletion only if confirmed
    }
  };

  return (
    <li key={index} className={task.completed ? "completed" : ""}>
      <div className="task-main" onClick={() => toggleTask(index)}>
        <span className="task-text">{task.text}</span>
        {task.description && (
          <div
            className="task-description"
            dangerouslySetInnerHTML={{ __html: marked.parse(task.description) }}
          />
        )}
        <div className="task-meta">
          {task.tag && <span className="tag">#{task.tag}</span>}
          {task.date && <span className="date">🗓️ {task.date}</span>}
          <span className={`priority ${task.priority.toLowerCase()}`}>
            ⚡ {task.priority}
          </span>
        </div>
      </div>
      <div className="task-actions">
        <button onClick={() => editTask(index)}>✏️</button>
        {/* Call the new handleDeleteClick function */}
        <button onClick={handleDeleteClick}>🗑️</button>
      </div>
    </li>
  );
}