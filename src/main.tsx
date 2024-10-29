import { StrictMode } from "react";

import { createRoot } from "react-dom/client";

import { BrowserRouter } from "react-router-dom";

import { TeacherConversationsContextProvider } from "./context/teacher-conversations";

import App from "./App.tsx";
import "./index.css";
import { UserContextProvider } from "./context/UserContext.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <UserContextProvider>
        <TeacherConversationsContextProvider>
          <App />
        </TeacherConversationsContextProvider>
      </UserContextProvider>
    </BrowserRouter>
  </StrictMode>
);
