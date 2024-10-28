import { Routes, Route, Navigate } from "react-router-dom";

import {
  ConversationPage,
  FollowLinkPage,
  LearningPlanPage,
  InitialPage,
  SignUpPage,
  UserTypeSelectionPage,
} from "./pages";

const App = () => {
  return (
    <>
      <Routes>
        <Route path="/initial" element={<InitialPage />} />
        <Route path="/follow-link" element={<FollowLinkPage />} />
        <Route
          path="/user-type-selection"
          element={<UserTypeSelectionPage />}
        />
        <Route path="/sign-up" element={<SignUpPage />} />
        <Route path="/ai-conversation" element={<ConversationPage />} />
        <Route path="/teacher-tasks" element={<LearningPlanPage />} />
        <Route path="/*" element={<Navigate to="/initial" replace />} />
      </Routes>
    </>
  );
};

export default App;
