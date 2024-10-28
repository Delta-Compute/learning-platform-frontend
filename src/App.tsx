import { Routes, Route, Navigate } from "react-router-dom";

import { ConversationPage, LearningPlanPage } from "./pages";
import { InitialPage } from "./pages/Initial/InitialPage";
import { SignUpPage } from "./pages/SignUp/SignUpPage";

const App = () => {
  return (
    <>
      <Routes>
        <Route path="/initial" element={<InitialPage />} />
        <Route path="/sign-up" element={<SignUpPage />} />
        <Route path="/ai-conversation" element={<ConversationPage />} />
        <Route path="/teacher-tasks" element={<LearningPlanPage />} />
        <Route path="/*" element={<Navigate to="/initial" replace />} />
      </Routes>
    </>
  );
};

export default App;
