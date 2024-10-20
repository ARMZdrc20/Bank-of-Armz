import { createSlice } from "@reduxjs/toolkit";

const initialState = { 
  armzPrice: 0,       // USD
  dogecoinPrice: 0,   // USD
};

const informationSlice = createSlice({
  name: "information",
  initialState,
  reducers: {
    updateCoinPrice(state, action) {
      state.armzPrice = action.payload.armzPrice;
      state.dogecoinPrice = action.payload.dogecoinPrice;
    },
  },
});

export const { updateCoinPrice } = informationSlice.actions;
export default informationSlice.reducer;
