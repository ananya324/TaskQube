import { useState } from "react";
import { X, Plus, Trash2, Save } from "lucide-react";

const NoteEditor = ({ note, onClose, onSave }) => {
  const [title, setTitle] = useState(note?.title || "");
  const [bullets, setBullets] = useState(note?.bullets || [""]);
  const [saving, setSaving] = useState(false);

  const handleBulletChange = (index, value) => {
    const updated = [...bullets];
    updated[index] = value;
    setBullets(updated);
  };

  const handleAddBullet = () => {
    setBullets([...bullets, ""]);
  };

  const handleDeleteBullet = (index) => {
    const updated = bullets.filter((_, i) => i !== index);
    setBullets(updated.length === 0 ? [""] : updated);
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const updated = [...bullets];
      updated.splice(index + 1, 0, "");
      setBullets(updated);
      setTimeout(() => {
        const inputs = document.querySelectorAll(".bullet-input");
        inputs[index + 1]?.focus();
      }, 0);
    }
    if (e.key === "Backspace" && bullets[index] === "" && bullets.length > 1) {
      e.preventDefault();
      const updated = bullets.filter((_, i) => i !== index);
      setBullets(updated);
      setTimeout(() => {
        const inputs = document.querySelectorAll(".bullet-input");
        inputs[Math.max(0, index - 1)]?.focus();
      }, 0);
    }
  };

  const handleSave = async () => {
    if (!title.trim()) return;
    setSaving(true);
    const cleanBullets = bullets.filter((b) => b.trim() !== "");
    await onSave({ title, bullets: cleanBullets });
    setSaving(false);
  };

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center px-4">
      <div className="bg-surface border border-border rounded-2xl w-full max-w-lg shadow-xl">

        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-border">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Note title..."
            className="font-heading font-bold text-gray-900 text-lg bg-transparent outline-none flex-1 placeholder:text-gray-300"
          />
          <button onClick={onClose} className="text-muted hover:text-gray-900 transition ml-3">
            <X size={18} />
          </button>
        </div>

        {/* Bullets */}
        <div className="p-5 max-h-[50vh] overflow-y-auto space-y-2">
          {bullets.map((bullet, index) => (
            <div key={index} className="flex items-center gap-3 group">
              <span className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
              <input
                type="text"
                value={bullet}
                onChange={(e) => handleBulletChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                placeholder="Add a bullet point..."
                className="bullet-input flex-1 bg-transparent text-sm text-gray-900 outline-none placeholder:text-gray-300"
              />
              <button
                onClick={() => handleDeleteBullet(index)}
                className="opacity-0 group-hover:opacity-100 text-muted hover:text-rose-500 transition"
              >
                <Trash2 size={12} />
              </button>
            </div>
          ))}

          {/* Add bullet */}
          <button
            onClick={handleAddBullet}
            className="flex items-center gap-2 text-xs text-muted hover:text-primary transition mt-2"
          >
            <Plus size={13} />
            Add bullet
          </button>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-5 border-t border-border">
          <p className="text-xs text-muted">{bullets.filter(b => b.trim()).length} bullets</p>
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="border border-border text-gray-600 font-heading font-medium text-sm px-4 py-2 rounded-lg hover:bg-background transition"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={saving || !title.trim()}
              className="flex items-center gap-2 bg-primary hover:bg-primary-hover text-white font-heading font-semibold text-sm px-4 py-2 rounded-lg transition disabled:opacity-50"
            >
              <Save size={13} />
              {saving ? "Saving..." : "Save Note"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NoteEditor;