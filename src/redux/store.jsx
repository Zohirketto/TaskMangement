import {configureStore} from "@reduxjs/toolkit"
import TaskSliceReducer from "../features/TaskSlice"
import SearchSliceReducer from "../features/SearchSlice"

const store = configureStore({
    reducer :{
        TaskReducer :TaskSliceReducer,
        SearchReducer: SearchSliceReducer,

    }
})
export default store;
