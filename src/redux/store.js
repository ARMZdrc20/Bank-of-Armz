import { configureStore } from "@reduxjs/toolkit";
// import layoutReducer from "./layoutSlice";
import walletReducer from "./walletSlice";
import informationReducer from "./informationSlice";

const store = configureStore({
  reducer: {
    // layout: layoutReducer,
    wallet: walletReducer,
    information: informationReducer
  },
});

export default store;
