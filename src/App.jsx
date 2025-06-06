import { useEffect, useState } from "react";
import TaskForm from "./components/TaskForm";
import TaskItem from "./components/TaskItem";
import "./App.css";

export default function App() {
  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem("tasks");
    return saved ? JSON.parse(saved) : [];
  });

  const [input, setInput] = useState("");
  const [tag, setTag] = useState("");
  const [date, setDate] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [description, setDescription] = useState("");
  const [editingIndex, setEditingIndex] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState("none");
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("theme") === "dark";
  });
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    document.body.className = darkMode ? "dark" : "light";
    localStorage.setItem("theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  const addTask = () => {
    if (input.trim() === "") return;

    const newTask = { text: input, completed: false, tag, date, priority, description: description.trim() };

    if (editingIndex !== null) {
      const updated = [...tasks];
      updated[editingIndex] = { ...updated[editingIndex], ...newTask };
      setTasks(updated);
      setEditingIndex(null);
    } else {
      setTasks([...tasks, newTask]);
    }

    setInput(""); setTag(""); setDate(""); setPriority("Medium"); setDescription(""); setShowPreview(false);
  };

  const toggleTask = (index) => {
    const updated = tasks.map((task, i) =>
      i === index ? { ...task, completed: !task.completed } : task
    );
    setTasks(updated);
  };

  const deleteTask = (index) => {
    const filtered = tasks.filter((_, i) => i !== index);
    setTasks(filtered);
  };

  const editTask = (index) => {
    const t = tasks[index];
    setInput(t.text); setTag(t.tag || ""); setDate(t.date || ""); setPriority(t.priority || "Medium");
    setDescription(t.description || ""); setEditingIndex(index); setShowPreview(false);
  };

  // New function to clear all completed tasks
  const clearCompletedTasks = () => {
    const incompleteTasks = tasks.filter(task => !task.completed);
    setTasks(incompleteTasks);
  };

  const filteredAndSortedTasks = tasks
    .filter(task =>
      task.text.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (task.tag || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (task.priority || "").toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (sortOption === "date") return new Date(a.date) - new Date(b.date);
      if (sortOption === "priority") return ({ High: 3, Medium: 2, Low: 1 }[b.priority] - { High: 3, Medium: 2, Low: 1 }[a.priority]);
      if (sortOption === "tag") return (a.tag || "").localeCompare(b.tag || "");
      return 0;
    });

  return (
    <div className="todo-container">
      <div className="header">
        <h1>To-Do List</h1>
        <button onClick={() => setDarkMode(!darkMode)} className="theme-toggle">
          {darkMode ? "🌞 Light" : "🌙 Dark"}
        </button>
      </div>

      <div className="search-sort-row">
        <input
          type="text"
          placeholder="Search tasks..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-box"
        />
        <select
          value={sortOption}
          onChange={(e) => setSortOption(e.target.value)}
          className="sort-dropdown"
        >
          <option value="none">🔃 Sort By</option>
          <option value="date">📅 Date</option>
          <option value="priority">⚡ Priority</option>
          <option value="tag">🏷️ Category</option>
        </select>
        {/* Add the "Clear All Completed Tasks" button */}
        {tasks.some(task => task.completed) && ( // Only show if there's at least one completed task
          <button onClick={clearCompletedTasks} className="clear-completed-button">
            Clear Completed
          </button>
        )}
      </div>

      <TaskForm
        input={input} tag={tag} date={date} priority={priority} description={description}
        setInput={setInput} setTag={setTag} setDate={setDate}
        setPriority={setPriority} setDescription={setDescription}
        addTask={addTask} editingIndex={editingIndex}
        showPreview={showPreview} setShowPreview={setShowPreview}
      />

      {filteredAndSortedTasks.length === 0 ? (
        <p className="empty-task-list-message">No tasks found. Add a new task above!</p>
      ) : (
        <ul className="task-list">
          {filteredAndSortedTasks.map((task, index) => (
            <TaskItem
              key={index}
              task={task}
              index={index}
              toggleTask={toggleTask}
              editTask={editTask}
              deleteTask={deleteTask}
            />
          ))}
        </ul>
      )}
    </div>
  );
}