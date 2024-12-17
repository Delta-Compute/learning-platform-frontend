import { StrictMode } from "react";

import { createRoot } from "react-dom/client";

import { BrowserRouter } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";

import App from "./App.tsx";
import "./index.css";

import {
  UserContextProvider,
  ClassesContextProvider,
  LanguageContextProvider,
  SchoolNamesContextProvider,
} from "./context";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import i18n from "./translations/index";
import { I18nextProvider } from "react-i18next";

const client = new QueryClient();

export const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

import { ConnectionProvider, PlaygroundStateProvider } from "./pages/LiveKit/hooks";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <GoogleOAuthProvider clientId={googleClientId}>
      <QueryClientProvider client={client}>
        <I18nextProvider i18n={i18n}>
          <PlaygroundStateProvider>
            <ConnectionProvider>
              <BrowserRouter>
                <SchoolNamesContextProvider>
                  <ClassesContextProvider>
                    <UserContextProvider>
                      <LanguageContextProvider>
                        <App />
                      </LanguageContextProvider>
                    </UserContextProvider>
                  </ClassesContextProvider>
                </SchoolNamesContextProvider>
              </BrowserRouter>
            </ConnectionProvider>
          </PlaygroundStateProvider>
        </I18nextProvider>
      </QueryClientProvider>
    </GoogleOAuthProvider>
  </StrictMode>
);
