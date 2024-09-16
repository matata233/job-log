import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  jobDescription: "",
  extractedJD: {},
  jobUrl: "",
  selectedMethod: null,
};

const aiSlice = createSlice({
  name: "ai",
  initialState,
  reducers: {
    setJobDescription: (state, action) => {
      state.jobDescription = action.payload;
    },
    setExtractedJD: (state, action) => {
      state.extractedJD = action.payload;
    },
    setJobUrl: (state, action) => {
      state.jobUrl = action.payload;
    },

    setLoading: (state, action) => {
      state.loading = action.payload;
    },

    setSelectedMethod: (state, action) => {
      state.selectedMethod = action.payload;
    },

    resetAIState: (state) => {
      state.jobDescription = "";
      state.extractedJD = {};
      state.jobUrl = "";
      state.selectedMethod = null;
    },
  },
});

export const {
  setJobDescription,
  setExtractedJD,
  setJobUrl,
  setSelectedMethod,
  resetAIState,
} = aiSlice.actions;
export default aiSlice.reducer;
