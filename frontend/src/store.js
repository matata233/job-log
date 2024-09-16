import { configureStore } from "@reduxjs/toolkit";
import { apiSlice } from "./slices/api/apiSlice";
import authReducer from "./slices/authSlice";
import themeReducer from "./slices/themeSlice";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { combineReducers } from "redux";
import { thunk } from "redux-thunk";
import siderbarSlice from "./slices/siderbarSlice";
import jobBoardsSlice from "./slices/jobBoardsSlice";
import mobileSlice from "./slices/mobileSlice";
import aiSlice from "./slices/aiSlice";

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["auth", "theme"], // put the reducers that needs to be persisted in the localStorage
};

const reducers = combineReducers({
  api: apiSlice.reducer,
  auth: authReducer,
  theme: themeReducer,
  sidebar: siderbarSlice,
  mobile: mobileSlice,
  jobBoards: jobBoardsSlice,
  ai: aiSlice,
});

const persistedReducer = persistReducer(persistConfig, reducers);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: () => [apiSlice.middleware, thunk],
  devTools: true,
});

export const persistor = persistStore(store);
