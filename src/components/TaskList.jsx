import { ToggleChangeStatus } from "../features/TaskSlice";
import {useDispatch, useSelector }from "react-redux"
import { deleteTask } from "../features/TaskSlice";

    
    const TaskList = () => {
        const tasks = useSelector(state => state.TaskReducer.tasks);
        const dispatch = useDispatch();
       const changeStatus = (id)=>
       {
        dispatch(ToggleChangeStatus(id))
       }
    
        return (
          <div className="task-list-container">
            <div className="task-column">
              <h2>To-Do</h2>
              {tasks.filter(task => task.status === "To-Do").map(task => (
                <div key={task.id} className={task.status}>
                  <button onClick={()=>(dispatch(deleteTask({id:task.id})))}><i className="hh bx bx-x"></i></button>
                  <p>{task.title}</p>
                  <p className="dd">Description : {task.description}</p>
                  <p className="dd">Priority :{task.priority}</p>
                  <p className="dd">Created At : {task.createAt}</p>
                  <button className="toggle-btn"onClick={()=>changeStatus(task.id)} >Move to In Progress</button>
                </div>
              ))}
            </div>
            <div className="task-column">
              <h2>In Progress</h2>
              {tasks.filter(task => task.status === "In-Progress").map(task => (
                <div key={task.id} className={task.status}>
                  
                  <button onClick={()=>(dispatch(deleteTask({id:task.id})))}><i className="hh bx bx-x"></i></button>
                  <p>{task.title}</p>
                  <p className="dd">Description : {task.description}</p>
                  <p className="dd">Priority :{task.priority}</p>
                  <p className="dd">Created At : {task.createAt}</p>
                  <button className="toggle-btn" onClick={()=>changeStatus(task.id)}>Move to Completed</button>
                </div>
              ))}
            </div>
            <div className="task-column">
              <h2>Completed</h2>
              {tasks.filter(task => task.status === "Completed").map(task => (
                <div key={task.id} className={task.status}>
                  <button onClick={()=>(dispatch(deleteTask({id:task.id})))}><i className="hh bx bx-x"></i></button>
                  <p>{task.title}</p>
                  <p className="dd">Description : {task.description}</p>
                  <p className="dd">Priority :{task.priority}</p>
                  <p className="dd">Created At : {task.createAt}</p>
                </div>
              ))}
            </div>
          </div>
        );
    }    
  
  export default TaskList;