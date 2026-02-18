import { useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import TaskForm from "../components/TaskForm";
import CalendarBoard from "../components/calendar/CalendarBoard";
import { db, firebaseAvailable, auth } from "../lib/firebase";
import { doc, serverTimestamp, updateDoc } from "firebase/firestore";
import TaskModal from "../components/TaskModal";

const views = ["Month"];

const addDays = (d, n) => new Date(d.getFullYear(), d.getMonth(), d.getDate() + n);

const Calendar = () => {
  const tasks = useSelector((s) => s.TaskReducer.tasks);
  const query = useSelector((s) => s.SearchReducer.query);
  const uid = auth?.currentUser?.uid || null;

  const [view, setView] = useState("Month");
  const [current, setCurrent] = useState(new Date());
  const [showForm, setShowForm] = useState(false);
  const [activeTask, setActiveTask] = useState(null);

  const [fStatus, setFStatus] = useState(["To-Do", "In Progress", "Done"]);
  const [fPriority, setFPriority] = useState(["Low", "Medieum", "High", "Very High"]);

  const filteredTasks = useMemo(() => {
    return tasks.filter((t) => {
      if (uid && t.userId && t.userId !== uid) return false;
      if (!fStatus.includes(t.status)) return false;
      if (t.priority && !fPriority.includes(t.priority)) return false;
      if (query) {
        const q = query.toLowerCase();
        const hit =
          (t.title || "").toLowerCase().includes(q) ||
          (t.description || "").toLowerCase().includes(q);
        if (!hit) return false;
      }
      return true;
    });
  }, [tasks, fStatus, fPriority, uid, query]);

  const handleReschedule = (id, dateKey) => {
    if (!firebaseAvailable || !db) return;
    const ref = doc(db, "tasks", String(id));
    updateDoc(ref, { dueDate: dateKey || null, updatedAt: serverTimestamp() });
  };

  const goPrev = () => {
    if (view === "Month") setCurrent(new Date(current.getFullYear(), current.getMonth() - 1, 1));
    if (view === "Week") setCurrent(addDays(current, -7));
    if (view === "Day") setCurrent(addDays(current, -1));
  };
  const goNext = () => {
    if (view === "Month") setCurrent(new Date(current.getFullYear(), current.getMonth() + 1, 1));
    if (view === "Week") setCurrent(addDays(current, 7));
    if (view === "Day") setCurrent(addDays(current, 1));
  };
  const goToday = () => setCurrent(new Date());

  

  return (
    <div className="calendar-page p-0 mt-0">
      <div className="calendar-sidebar">
        <div className="calendar-filters">
          <div className="filters-title">Filters</div>
          <div className="filter-group">
            <div className="filter-label">Status</div>
            {["To-Do","In Progress","Done"].map(s=>(
              <label key={s} className="filter-item">
                <input
                  type="checkbox"
                  checked={fStatus.includes(s)}
                  onChange={(e)=>{
                    if(e.target.checked) setFStatus([...fStatus, s])
                    else setFStatus(fStatus.filter(x=>x!==s))
                  }}
                />
                <span>{s.replace("-"," ")}</span>
              </label>
            ))}
          </div>
          <div className="filter-group">
            <div className="filter-label">Priority</div>
            {["Low","Medieum","High","Very High"].map(p=>(
              <label key={p} className="filter-item">
                <input
                  type="checkbox"
                  checked={fPriority.includes(p)}
                  onChange={(e)=>{
                    if(e.target.checked) setFPriority([...fPriority, p])
                    else setFPriority(fPriority.filter(x=>x!==p))
                  }}
                />
                <span>{p}</span>
              </label>
            ))}
          </div>
          
        </div>
      </div>
      <div className="calendar-main mt-0">
        <div className="calendar-header">
          <div className="calendar-title">
            <button className="icon-btn" onClick={goPrev}><ChevronLeft size={18}/></button>
            <div className="title-text">{current.toLocaleString(undefined, { month: "long", year: "numeric" })}</div>
            <button className="icon-btn" onClick={goNext}><ChevronRight size={18}/></button>
            <button className="btn btn-ghost" onClick={goToday}>Today</button>
          </div>
          <div className="calendar-controls">
            <div className="view-toggle">
              {views.map(v=>(
                <button
                  key={v}
                  className={`view-chip ${view===v ? "active" : ""}`}
                  onClick={()=>setView(v)}
                >
                  {v}
                </button>
              ))}
            </div>
          </div>
        </div>

        {view === "Month" ? (
          <CalendarBoard
            view={view}
            current={current}
            tasks={filteredTasks}
            onReschedule={handleReschedule}
            onTaskClick={setActiveTask}
          />
        ) : (
          <div className="page-placeholder">
            <div className="placeholder-card">
              <div className="placeholder-title">{view} view coming soon</div>
              <div className="placeholder-desc">The {view.toLowerCase()} view will include scheduling with drag-and-drop.</div>
            </div>
          </div>
        )}
      </div>

      <button className="fab" onClick={()=>setShowForm(true)}>
        <Plus size={20}/>
      </button>

      {showForm && (
        <div className="task-form-container">
          <div className="task-form modal-card">
            <TaskForm onClose={()=>setShowForm(false)}/>
          </div>
        </div>
      )}

      {activeTask && <TaskModal task={activeTask} onClose={()=>setActiveTask(null)} />}
    </div>
  );
};

export default Calendar;
