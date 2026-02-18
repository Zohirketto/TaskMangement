import { createSlice } from "@reduxjs/toolkit";
const initialState = {
    tasks:[],
    lastId : 0
}

const TaskSlice = createSlice({
    name:"task",
    initialState,
    reducers:{
        setTasks:(state,action)=>{
            state.tasks = action.payload || [];
        },
        addTask:(state,action)=>{
             state.lastId += 1
              const list = {...action.payload,id:state.lastId}
              state.tasks=[...state.tasks,list]
        },
        setTaskStatus:(state, action)=>{
          const { id, status } = action.payload
          const task = state.tasks.find(t=>t.id===id)
          if(task){
            task.status = status
          }
        },
        setTaskDueDate:(state, action)=>{
          const { id, dueDate } = action.payload
          const task = state.tasks.find(t=>t.id===id)
          if(task){
            task.dueDate = dueDate
          }
        },
        deleteTask: (state, action) => {
          const { id } = action.payload;
          state.tasks = state.tasks.filter((task) => task.id !== id);
        },
        ToggleChangeStatus: (state, action) => {
            const task = state.tasks.find(task => task.id === action.payload);
            if (task) {
              if (task.status === "To-Do") {
                task.status = "In-Progress";
              } else if (task.status === "In-Progress") {
                task.status = "Completed";
              }
            }
          },
        clearAlltasks:(state)=>{
            state.tasks = []
        }
          
    }
   

})
export const {setTasks,addTask,deleteTask,ToggleChangeStatus,clearAlltasks,setTaskStatus,setTaskDueDate} = TaskSlice.actions
export default TaskSlice.reducer
