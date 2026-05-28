import { useState } from "react";
import { X } from "lucide-react";

const AssignTaskModal = ({ members, onClose, onSubmit }) => {
  const [form, setForm] = useState({
    title: "",
    description: "",
    assignedTo: "",
    priority: "medium",
    dueDate: "",
  });
  const [loading, setLoading] = useState(false);

  const inputClass =
    "w-full bg-background border border-border text-gray-900 rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary focus:border-transparent placeholder:text-gray-400 transition";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await onSubmit(form);
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center px-4">
      <div className="bg-surface border border-border rounded-2xl p-6 w-full max-w-md shadow-xl">

        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-heading font-bold text-gray-900 text-lg">Assign Task</h2>
          <button onClick={onClose} className="text-muted hover:text-gray-900 transition">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-gray-700 text-sm font-medium mb-1.5 block">Title</label>
            <input
              type="text"
              placeholder="Task title"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              required
              className={inputClass}
            />
          </div>

          <div>
            <label className="text-gray-700 text-sm font-medium mb-1.5 block">Description</label>
            <textarea
              placeholder="What needs to be done?"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              rows={3}
              className={`${inputClass} resize-none`}
            />
          </div>

          <div>
            <label className="text-gray-700 text-sm font-medium mb-1.5 block">Assign To</label>
            <select
              value={form.assignedTo}
              onChange={(e) => setForm({ ...form, assignedTo: e.target.value })}
              required
              className={inputClass}
            >
              <option value="">Select member</option>
              {members.map((m) => (
                <option key={m._id} value={m._id}>{m.name}</option>
              ))}
            </select>
          </div>

          <div className="flex gap-3">
            <div className="flex-1">
              <label className="text-gray-700 text-sm font-medium mb-1.5 block">Priority</label>
              <select
                value={form.priority}
                onChange={(e) => setForm({ ...form, priority: e.target.value })}
                className={inputClass}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
            <div className="flex-1">
              <label className="text-gray-700 text-sm font-medium mb-1.5 block">Due Date</label>
              <input
                type="date"
                value={form.dueDate}
                onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
                className={inputClass}
              />
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-primary hover:bg-primary-hover text-white font-heading font-semibold text-sm py-2.5 rounded-lg transition disabled:opacity-50"
            >
              {loading ? "Assigning..." : "Assign Task"}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 border border-border text-gray-600 font-heading font-medium text-sm py-2.5 rounded-lg hover:bg-background transition"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AssignTaskModal;