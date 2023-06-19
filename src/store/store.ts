import { configureStore } from "@reduxjs/toolkit";
import bookAllReducer from "./bookStore";
import userReducer from "./userStore";

const reducer = {
  bookAll: bookAllReducer,
  user: userReducer,
};

const store = configureStore({
  reducer: reducer,
  devTools: true,
});

export default store;
