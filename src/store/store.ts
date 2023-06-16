import { configureStore } from "@reduxjs/toolkit";
import bookAllReducer from "./bookStore";

const reducer = {
  bookAll: bookAllReducer,
};

const store = configureStore({
  reducer: reducer,
  devTools: true,
});

export default store;
