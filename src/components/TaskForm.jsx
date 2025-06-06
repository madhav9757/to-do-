import { marked } from "marked";

export default function TaskForm({
  input, tag, date, priority, description,
  setInput, setTag, setDate, setPriority, setDescription,
  addTask, editingIndex, showPreview, setShowPreview
}) {
  return (
    <div className="input-row">
      <div className="top-row">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Task title"
        />
        <input
          type="text"
          value={tag}
          onChange={(e) => setTag(e.target.value)}
          placeholder="Category"
        />
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
        <select value={priority} onChange={(e) => setPriority(e.target.value)}>
          <option>Low</option>
          <option>Medium</option>
          <option>High</option>
        </select>
      </div>

      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="(Optional) Task description..."
        rows={3}
        className="description-box"
      />

      <div className="description-tools">
        <label>
          <input
            type="checkbox"
            checked={showPreview}
            onChange={() => setShowPreview(!showPreview)}
          />
          Preview Markdown
        </label>
      </div>

      {showPreview && description && (
        <div
          className="description-preview"
          dangerouslySetInnerHTML={{ __html: marked.parse(description) }}
        />
      )}

      <div className="form-footer">
        <span className="char-count">{description.length} characters</span>
        <button onClick={addTask}>
          {editingIndex !== null ? "Update" : "Add"}
        </button>
      </div>
    </div>
  );
}
