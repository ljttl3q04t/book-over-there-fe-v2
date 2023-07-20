import { createRoot } from "react-dom/client";
import "./i18n";

import App from "./App";
import { UserProvider } from "@/context/UserContext";
const root = createRoot(document.getElementById("root") as HTMLElement);
root.render(
  <UserProvider>
    <App />
  </UserProvider>,
);
