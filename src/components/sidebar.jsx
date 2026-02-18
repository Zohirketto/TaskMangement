import { useEffect, useState } from "react";
import {
  LayoutDashboard,
  ListTodo,
  Calendar,
  Settings,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import { NavLink } from "react-router-dom";

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const items = [
    { id: "dashboard", label: "Dashboard", icon: <LayoutDashboard size={18} />, to: "/dashboard" },
    { id: "tasks", label: "Tasks", icon: <ListTodo size={18} />, to: "/dashboard" },
    { id: "calendar", label: "Calendar", icon: <Calendar size={18} />, to: "/calendar" },
    { id: "settings", label: "Settings", icon: <Settings size={18} />, to: "/settings" },
  ];

  useEffect(() => {
    const apply = () => {
      const w = window.innerWidth;
      setCollapsed(w < 1024);
    };
    apply();
    window.addEventListener("resize", apply);
    return () => window.removeEventListener("resize", apply);
  }, []);

  useEffect(() => {
    const w = collapsed ? "80px" : "260px";
    document.documentElement.style.setProperty("--sidebar-w", w);
  }, [collapsed]);

  return (
    <aside className={`app-sidebar ${collapsed ? "collapsed" : ""}`}>
      <div className="nav-group">
        <button
          className="nav-link sidebar-toggle"
          onClick={() => setCollapsed((v) => !v)}
        >
          <span className="nav-icon">
            {collapsed ? <ChevronsRight size={18} /> : <ChevronsLeft size={18} />}
          </span>
          <span className="nav-text">Collapse</span>
        </button>
        {items.map((it) => (
          <NavLink
            to={it.to}
            key={it.id}
            className={({ isActive }) =>
              `nav-link ${isActive ? "active" : ""}`
            }
          >
            <span className="nav-icon">{it.icon}</span>
            <span className="nav-text">{it.label}</span>
          </NavLink>
        ))}
      </div>

      
    </aside>
  );
};

export default Sidebar;
