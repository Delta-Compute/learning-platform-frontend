import { StrictMode } from "react";

import { createRoot } from "react-dom/client";

import { BrowserRouter } from "react-router-dom";

import { TeacherConversationsContextProvider } from "./context/teacher-conversations";

import App from "./App.tsx";
import "./index.css";
import { UserContextProvider } from "./context/UserContext.tsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const client = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={client}>
      <BrowserRouter>
        <UserContextProvider>
          <TeacherConversationsContextProvider>
            <App />
          </TeacherConversationsContextProvider>
        </UserContextProvider>
      </BrowserRouter>
    </QueryClientProvider>
  </StrictMode>
);
