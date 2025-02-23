import { useState } from "react";

const Sidebar = () => {
  const [isActive, setIsActive] = useState(false);

  return (
    <div className={`sidebar ${isActive ? "active" : ""}`}>
      <div className="top">
        <div className="logo">
          <i className="bx bx-task"></i>
          <span>Task Management</span>
        </div>
        <i className="bx bx-menu" id="btn" onClick={() => setIsActive(!isActive)}></i>
      </div>

      <div className="user">
        <img src="https://cdn-icons-png.freepik.com/256/15203/15203193.png?semt=ais_hybrid" alt="" className="user-img"/>
      </div>

      <ul>
        <li><a href="#"><i className="bx bxs-grid-alt"></i> <span className="nav-item">Dashboard</span></a></li>
   

        <li><a href="#"><i className="bx bx-phone"></i> <span className="nav-item">Contact</span></a></li>
        <li><a href="#"><i className="bx bx-info-circle"></i> <span className="nav-item">About</span></a></li>
        <li><a href="#"><i className="bx bx-log-out"></i> <span className="nav-item">Logout</span></a></li>
      </ul>
    </div>
  );
};

export default Sidebar;



