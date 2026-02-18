import { useState } from "react";
import PropTypes from "prop-types";
import { auth, db, firebaseAvailable } from "../lib/firebase";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { X, CalendarDays, Flag } from "lucide-react";

const priorities = ["Low", "Medieum", "High", "Very High"];

const TaskForm = ({ onClose }) => {
    const [form, setForm] = useState({
      title: "",
      description: "",
      priority: "",
      status: "To-Do",
      createAt: new Date().toISOString(),
      dueDate: "",
      attachment: null,
    
    });
    const [error, setError] = useState("");
    
 
    const handleSubmit = () => {
        setError("");
        if (
          form.title.trim() === "" ||
          form.description.trim() === "" ||
          form.priority === "" ||
          (form.dueDate || "").trim() === ""
        ) {
          setError("Please complete all required fields.");
          return;
        }
        if (!firebaseAvailable || !auth) return;
        const userId = auth.currentUser?.uid;
        if (!userId) return;
        const payload = {
          title: form.title,
          description: form.description || "",
          status: form.status,
          priority: form.priority || null,
          dueDate: form.dueDate || null,
          attachment: form.attachment || null,
          userId,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        };
        addDoc(collection(db, "tasks"), payload);
        setForm({
          title: "",
          description: "",
          priority: "",
          status: "To-Do",
          createAt: new Date().toISOString(),
          dueDate: "",
          attachment: null,
         
        });
        if (onClose) onClose();
    };

    return (
      <div className="modal">
        <div className="modal-header">
          <div className="modal-title">Add Task</div>
          <button className="icon-btn" onClick={onClose}>
            <X size={18}/>
          </button>
        </div>
        <div className="modal-body">
          <div className="form-field">
            <label className="field-label">Title</label>
            <input 
              type="text" 
              placeholder="Enter task title" 
              className="input-field"
              value={form.title}
              required
              onChange={(e) => setForm({ ...form, title: e.target.value })}
            />
          </div>
          <div className="form-field">
            <label className="field-label">Description</label>
            <textarea 
              placeholder="Short description" 
              className="input-field"
              value={form.description}
              required
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            ></textarea>
          </div>
          <div className="form-field">
            <label className="field-label">Attachment</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files && e.target.files[0];
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
                  reader.onload = () => {
                    setForm({ ...form, attachment: { name: file.name, type: file.type, dataUrl: reader.result } });
                  };
                  reader.readAsDataURL(file);
                } else {
                  setForm({ ...form, attachment: { name: file.name, type: file.type, dataUrl: null } });
                }
              }}
            />
            {form.attachment && form.attachment.dataUrl && (
              <div className="attachment-preview">
                <img className="attachment-img" src={form.attachment.dataUrl} alt="Attachment Preview"/>
                <button
                  type="button"
                  className="btn btn-ghost"
                  onClick={() => setForm({ ...form, attachment: null })}
                >
                  Remove
                </button>
              </div>
            )}
          </div>
          <div className="form-row">
            <div className="form-field">
              <label className="field-label">Priority</label>
              <div className="segmented">
                {priorities.map((p) => (
                  <button
                    key={p}
                    className={`segment ${form.priority === p ? "active" : ""}`}
                    onClick={() => setForm({ ...form, priority: p })}
                    type="button"
                    title={p}
                  >
                    <Flag size={14}/><span>{p}</span>
                  </button>
                ))}
              </div>
              {error && form.priority === "" && (
                <div className="error-text">Priority is required.</div>
              )}
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
                  value={form.dueDate}
                  required
                  onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
                />
              </div>
            </div>
            <div className="form-field">
        
            </div>
          </div>
        </div>
        {error && <div className="modal-body" style={{color:"#b91c1c"}}>{error}</div>}
        <div className="modal-actions">
          <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" onClick={handleSubmit}>Add Task</button>
        </div>
      </div>
    );
};

export default TaskForm
TaskForm.propTypes = {
  onClose: PropTypes.func,
}
