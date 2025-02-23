import { useState } from "react";
import TaskList from "../components/TaskList";
import TaskForm from "../components/TaskForm";
import { useDispatch } from "react-redux";
import { clearAlltasks } from "../features/TaskSlice";

const Dashboard = () => {
  const [showForm, setShowForm] = useState(false);
  const Dispatch = useDispatch()
  return (
    <div className="dashboard">
      <button className="add-task-btn" onClick={() => setShowForm(!showForm)}>
        Add Task
      </button>
      <button className="add-task-btn" onClick={() => Dispatch(clearAlltasks())}>
        Clear All Tasks
      </button>


      {showForm && (
        <div className="task-form-container">
          <div className="task-form">
            <button className="close-btn" onClick={() => setShowForm(false)}>
              Close
            </button>
            <TaskForm />
          </div>
        </div>
      )}
      <TaskList />
    </div>
  );
};

export default Dashboard;
