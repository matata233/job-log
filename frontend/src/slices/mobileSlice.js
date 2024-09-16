// used to store if the user is using a mobile device or not

import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isMobile: false,
  isMobileMenuOpen: false,
};

const mobileSlice = createSlice({
  name: "mobile",
  initialState,
  reducers: {
    setIsMobile: (state, action) => {
      state.isMobile = action.payload;
    },
    setIsMobileMenuOpen: (state, action) => {
      state.isMobileMenuOpen = action.payload;
    },
  },
});

export const { setIsMobile, setIsMobileMenuOpen } = mobileSlice.actions;

export default mobileSlice.reducer;
