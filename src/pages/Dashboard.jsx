import { useState } from "react"; 
import TaskList from "../components/TaskList";
import TaskForm from "../components/TaskForm";
import { useDispatch } from "react-redux";
import { clearAlltasks } from "../features/TaskSlice";
import { Plus, Trash2, X } from "lucide-react";

const Dashboard = () => {
  const [showForm, setShowForm] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showStatusForm, setShowStatusForm] = useState(false);
  const [statusName, setStatusName] = useState("");
  const [columns, setColumns] = useState([
    { id: "To-Do", title: "To Do" },
    { id: "In Progress", title: "In Progress" },
    { id: "Done", title: "Done" },
  ]);
  const Dispatch = useDispatch()
  return (
    <div className="dashboard">
      <div className="dashboard-actions">
        <button className="btn btn-primary" onClick={() => setShowForm(true)}>
          <Plus size={16}/> Add Task
        </button>
        <button className="btn btn-primary" onClick={() => setShowStatusForm(true)}>
          <Plus size={16}/> Add Status
        </button>
        <button className="btn btn-danger" onClick={() => setShowConfirm(true)}>
          <Trash2 size={16}/> Clear All
        </button>     
      </div>


      {showForm && (
        <div className="task-form-container">
          <div className="task-form modal-card">
            <TaskForm onClose={() => setShowForm(false)} />
          </div>
        </div>
      )}
      {showConfirm && (
        <div className="confirm-modal">
          <div className="confirm-card">
            <h3>Clear all tasks?</h3>
            <p>This action cannot be undone.</p>
            <div className="confirm-actions">
              <button className="btn btn-ghost" onClick={() => setShowConfirm(false)}>Cancel</button>
              <button className="btn btn-danger" onClick={() => { Dispatch(clearAlltasks()); setShowConfirm(false); }}>Clear</button>
            </div>
          </div>
        </div>
      )}
      {showStatusForm && (
        <div className="task-form-container">
          <div className="task-form modal-card">
            <div className="modal">
              <div className="modal-header">
                <div className="modal-title">Add Status</div>
                <button className="icon-btn" onClick={() => setShowStatusForm(false)}>
                  <X size={18}/>
                </button>
              </div>
              <div className="modal-body">
                <div className="form-field">
                  <label className="field-label">Status Name</label>
                  <input
                    type="text"
                    placeholder="e.g., In Review"
                    className="input-field"
                    value={statusName}
                    onChange={(e)=>setStatusName(e.target.value)}
                  />
                </div>
              </div>
              <div className="modal-actions">
                <button className="btn btn-ghost" onClick={() => setShowStatusForm(false)}>Cancel</button>
                <button
                  className="btn btn-primary"
                  onClick={() => {
                    const name = (statusName || "").trim();
                    if (!name) return;
                    const exists = columns.some(c => c.id.toLowerCase() === name.toLowerCase());
                    if (exists) { setStatusName(""); setShowStatusForm(false); return; }
                    setColumns([...columns, { id: name, title: name }]);
                    setStatusName("");
                    setShowStatusForm(false);
                  }}
                >
                  Add Status
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      <TaskList columns={columns} />
    </div>
  );
};

export default Dashboard; 
