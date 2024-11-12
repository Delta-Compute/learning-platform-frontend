import { StrictMode } from "react";

import { createRoot } from "react-dom/client";

import { BrowserRouter } from "react-router-dom";

import App from "./App.tsx";
import "./index.css";

import {
  UserContextProvider,
  ClassesContextProvider,
  LanguageContextProvider,
} from "./context";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import i18n from "./translations/index";
import { I18nextProvider } from "react-i18next";

const client = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={client}>
      <I18nextProvider i18n={i18n}>
        <BrowserRouter>
          <ClassesContextProvider>
            <UserContextProvider>
              <LanguageContextProvider>
                <App />
              </LanguageContextProvider>
            </UserContextProvider>
          </ClassesContextProvider>
        </BrowserRouter>
      </I18nextProvider>
    </QueryClientProvider>
  </StrictMode>
);
