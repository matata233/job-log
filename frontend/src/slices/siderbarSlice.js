import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  expanded: true,
};

const sidebarSlice = createSlice({
  name: "sidebar",
  initialState,
  reducers: {
    setSidebarExpand: (state, action) => {
      state.expanded = action.payload;
    },
  },
});
export const { setSidebarExpand } = sidebarSlice.actions;

export default sidebarSlice.reducer;
