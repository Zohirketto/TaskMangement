import PropTypes from "prop-types";
import { useState } from "react";
import { db, firebaseAvailable } from "../lib/firebase";
import { doc, serverTimestamp, updateDoc, deleteField } from "firebase/firestore";
import { X, CalendarDays, Flag, Paperclip } from "lucide-react";

const priorities = ["Low", "Medieum", "High", "Very High"];

const TaskModal = ({ task, onClose }) => {
  const [form, setForm] = useState({
    title: task.title || "",
    description: task.description || "",
    priority: task.priority || "",
    dueDate: task.dueDate || "",
    attachment: task.attachment || null,
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const onSave = async () => {
    if (!firebaseAvailable || !db) return;
    setSaving(true);
    setError("");
    try {
      const ref = doc(db, "tasks", String(task.id));
      await updateDoc(ref, {
        title: form.title,
        description: form.description || "",
        priority: form.priority || null,
        // status intentionally not editable here
        dueDate: form.dueDate || null,
        attachment: form.attachment || deleteField(),
        updatedAt: serverTimestamp(),
      });
      if (onClose) onClose();
    } catch (e) {
      setError(e?.message || "Failed to save task");
    } finally {
      setSaving(false);
    }
  };

  const loadFile = (file) => {
    if (!file) return;
    const MAX_BYTES = 500 * 1024;
    if (!file.type.startsWith("image/")) {
      setError("Attachment must be an image.");
      return;
    }
    if (file.size > MAX_BYTES) {
      setError("Image too large. Max 500KB.");
      return;
    }
    if (file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = () => setForm((f) => ({ ...f, attachment: { name: file.name, type: file.type, dataUrl: reader.result } }));
      reader.readAsDataURL(file);
    } else {
      setForm((f) => ({ ...f, attachment: { name: file.name, type: file.type, dataUrl: null } }));
    }
  };

  return (
    <div className="task-form-container">
      <div className="task-form modal-card">
        <div className="modal">
          <div className="modal-header">
            <div className="modal-title">Task</div>
            <button className="icon-btn" onClick={onClose}>
              <X size={18}/>
            </button>
          </div>
          <div className="modal-body">
            <div className="form-field">
              <label className="field-label">Title</label>
              <input
                className="input-field"
                value={form.title}
                onChange={(e)=>setForm({...form, title: e.target.value})}
              />
            </div>
            <div className="form-field">
              <label className="field-label">Description</label>
              <textarea
                className="input-field"
                value={form.description}
                onChange={(e)=>setForm({...form, description: e.target.value})}
              />
            </div>
            <div className="form-row">
              <div className="form-field">
                <label className="field-label">Priority</label>
                <div className="segmented">
                  {priorities.map((p)=>(
                    <button
                      key={p}
                      className={`segment ${form.priority===p ? "active" : ""}`}
                      onClick={()=>setForm({...form, priority: p})}
                      type="button"
                      title={p}
                    >
                      <Flag size={14}/><span>{p}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div className="form-row">
              <div className="form-field">
                <label className="field-label">Due Date</label>
                <div className="input-with-icon">
                  <CalendarDays size={16}/>
                  <input
                    type="date"
                    className="input-field"
                    value={form.dueDate || ""}
                    onChange={(e)=>setForm({...form, dueDate: e.target.value})}
                  />
                </div>
              </div>
            </div>
            <div className="form-field">
              <label className="field-label">Attachment</label>
              <div className="input-with-icon">
                <Paperclip size={16}/>
                <input
                  type="file"
                  accept="image/*"
                  className="input-field"
                  onChange={(e)=>loadFile(e.target.files && e.target.files[0])}
                />
              </div>
              {form.attachment && (
                <div className="attachment-preview">
                  {form.attachment.dataUrl ? (
                    <img className="attachment-img" src={form.attachment.dataUrl} alt="Attachment" referrerPolicy="no-referrer"/>
                  ) : (
                    <div className="attachment-file">{form.attachment.name}</div>
                  )}
                  <div style={{display:"flex", gap:8}}>
                    <button className="btn btn-ghost" onClick={()=>setForm({...form, attachment: null})}>Remove</button>
                  </div>
                </div>
              )}
            </div>
          </div>
          {error && <div className="modal-body" style={{color:"#b91c1c"}}>{error}</div>}
          <div className="modal-actions">
            <button className="btn btn-ghost" onClick={onClose}>Close</button>
            <button className="btn btn-primary" onClick={onSave} disabled={saving}>{saving ? "Saving..." : "Save"}</button>
          </div>
        </div>
      </div>
    </div>
  );
};

TaskModal.propTypes = {
  task: PropTypes.object.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default TaskModal;
