import { createSlice } from '@reduxjs/toolkit';

import { REDUX_SLICES } from '../utils/redux-slices';

const assetInitialState = {};

const assetsSlice = createSlice({
  name: REDUX_SLICES.ASSET,
  initialState: assetInitialState,
  reducers: {},
});

export const assetsReducer = assetsSlice.reducer;
