import { Routes, Route, Navigate } from "react-router-dom";

import { ConversationPage, LearningPlanPage } from "./pages";
import JoinYourSchoolPage from "./pages/JoinYourSchoolPage";
import ClassesPage from "./pages/ClassesPage";

const App = () => {
  return (
    <>
      <Routes>
        <Route path="/ai-conversation" element={<ConversationPage />} />
        <Route path="/teacher-tasks" element={<LearningPlanPage />} />
        <Route path="/join-your-school" element={<JoinYourSchoolPage />} />
        <Route path="/classes" element={<ClassesPage />} />
        <Route path="/*" element={<Navigate to="/teacher-tasks" replace />} />
      </Routes>
    </>
  );
};

export default App;
