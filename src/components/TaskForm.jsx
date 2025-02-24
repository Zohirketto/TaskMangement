import { useState } from "react";
import { useDispatch } from "react-redux";
import { addTask } from "../features/TaskSlice";

const TaskForm = () => {
    const [form, setForm] = useState({ title: "", description: "",priority:"",status:"To-Do",createAt:new Date().toISOString()});
    const dispatch = useDispatch();
 
    const handleSubmit = () => {
        if (form.title.trim() === ""||form.priority ==="") return;
        dispatch(addTask(form));
        setForm({ title: "", description: "",priority:"",status:"To-Do",createAt:new Date().toISOString()});
    };

    return (
      <div className="task-form">
        <h2>Add New Task</h2>
        <input 
          type="text" 
          placeholder="Task Title" 
          className="input-field"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
        />
        <textarea 
          placeholder="Task Description" 
          className="input-field"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        ></textarea>
        <select value={form.priority} onChange={(e)=>setForm((prevfrom)=>({...prevfrom,priority:e.target.value}))}>
            <option>
                Choose priority
            </option>
            <option>
                Low
            </option>
            <option>
                Medieum
            </option>
            <option>
                High
            </option>
            <option> 
                Very High
            </option>
        </select>
        <button className="add-task-btn" onClick={handleSubmit}>Add Task</button>
      </div>
    );
};

export default TaskForm;
