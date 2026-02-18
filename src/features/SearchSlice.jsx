import { createSlice } from "@reduxjs/toolkit";
const initialState = {
  query: ""
};

const SearchSlice = createSlice({
  name: "search",
  initialState,
  reducers: {
    setQuery: (state, action) => {
      state.query = action.payload || "";
    },
    clearQuery: (state) => {
      state.query = "";
    }
  }
});

export const { setQuery, clearQuery } = SearchSlice.actions;
export default SearchSlice.reducer;
