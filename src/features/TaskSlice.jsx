import { createSlice } from "@reduxjs/toolkit";
const initialState = {
    tasks:[
        {id:0,title:"task1",description:"fgggggggg",priority:"gggg",assign:0,status:"To-Do",createAt:"2025-02-22T10:00:00Z"},
        {id:1,title:"task1",description:"fgggggggg",priority:"gggggg",assign:0,status:"To-Do",createAt:"2025-02-22T10:00:00Z"}
    ],
    lastId : 0
}

const TaskSlice = createSlice({
    name:"task",
    initialState,
    reducers:{
        addTask:(state,action)=>{
             state.lastId += 1
              const list = {...action.payload,id:state.lastId}
              state.tasks=[...state.tasks,list]
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
// zohir ketto
export const {addTask,deleteTask,ToggleChangeStatus,clearAlltasks} = TaskSlice.actions
export default TaskSlice.reducer