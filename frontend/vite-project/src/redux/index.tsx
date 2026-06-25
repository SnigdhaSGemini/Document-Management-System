import { configureStore } from "@reduxjs/toolkit";
import dateRangeReducer from "./dateRangeSlice";

export const store = configureStore({
  reducer: {
    dateRange: dateRangeReducer,
  },
});
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
