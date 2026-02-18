import { Bell, Search, KanbanSquare } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { setQuery } from "../features/SearchSlice";
import { useNavigate } from "react-router-dom";
import { auth } from "../lib/firebase";
import { useMemo, useState } from "react";

const Navbar = () => {
  const dispatch = useDispatch();
  const query = useSelector((s) => s.SearchReducer.query);
  const navigate = useNavigate();
  const user = auth?.currentUser;
  const tasks = useSelector((s)=>s.TaskReducer.tasks || []);
  const [open, setOpen] = useState(false);
  const todayKey = new Date().toISOString().slice(0,10);
  const dueToday = useMemo(()=>tasks.filter(t => (t.dueDate||"") === todayKey), [tasks, todayKey]);
  return (
    <div className="topbar">
      <div className="topbar-left">
        <div className="logo-mark">
          <KanbanSquare size={18} />
        </div>
        <span className="logo-text">Task Manager</span>
      </div>
      <div className="topbar-center">
        <div className="search">
          <Search size={16} />
          <input
            placeholder="Search tasks"
            value={query}
            onChange={(e) => dispatch(setQuery(e.target.value))}
          />
        </div>
      </div>
      <div className="topbar-right">
        <button className="icon-btn" onClick={()=>setOpen(v=>!v)} title="Notifications">
          <Bell size={18} />
          {dueToday.length > 0 && (
            <span className="notif-badge">{dueToday.length > 99 ? "99+" : dueToday.length}</span>
          )}
        </button>
       
        <img
          className="avatar"
          src={user?.photoURL || "https://i.pravatar.cc/40?img=13"}
          alt=""
          style={{cursor:"pointer"}}
          referrerPolicy="no-referrer"
          onClick={()=>navigate("/settings")}
          title="Open settings"
        />
        {open && (
          <div className="notif-panel">
            <div className="notif-header">Today’s Tasks</div>
            <div className="notif-list">
              {dueToday.length === 0 ? (
                <div className="notif-empty">No tasks due today</div>
              ) : (
                dueToday.slice(0,8).map(t => (
                  <div key={t.id} className="notif-item">
                    <div className="notif-title">{t.title}</div>
                    <div className="notif-meta">{t.priority || "N/A"}</div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
