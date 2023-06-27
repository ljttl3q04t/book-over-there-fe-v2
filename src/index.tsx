import React from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";

import App from "./App";
import store from "./store/store";
import { UserProvider } from "@/context/UserContext";
const root = createRoot(document.getElementById("root") as HTMLElement);
root.render(
  <Provider store={store}>
    <UserProvider>
      <App />
    </UserProvider>
  </Provider>,
);
