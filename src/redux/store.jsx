import {configureStore} from "@reduxjs/toolkit"
import TaskSliceReducer from "../features/TaskSlice"

const store = configureStore({
    reducer :{
        TaskReducer :TaskSliceReducer,

    }
})
export default store;