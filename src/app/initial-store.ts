import { createSlice } from "@reduxjs/toolkit";

import { REDUX_SLICES } from "@helpers/constants/redux-slices-name";

const initialState = {
  count: 1,
};

const ReferenceSlice = createSlice({
  name: REDUX_SLICES.INITIAL_SLICE,
  initialState,
  reducers: {},
});

export const referenceSliceReducer = ReferenceSlice.reducer;
