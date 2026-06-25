import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  startDate: null,
  endDate: null,
};

const dateRangeSlice = createSlice({
  name: "dateRange",
  initialState,
  reducers: {
    setDateRange: (state, action) => {
      state.startDate = action.payload.startDate;
      state.endDate = action.payload.endDate;
    },
    resetDateRange: () => initialState,
  },
});

export const { setDateRange, resetDateRange } = dateRangeSlice.actions;
export default dateRangeSlice.reducer;