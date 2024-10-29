import { Routes, Route, Navigate } from "react-router-dom";

import JoinYourSchoolPage from "./pages/JoinYourSchoolPage";
import ClassesPage from "./pages/ClassesPage";
import CongratulationPage from "./pages/CongratulationPage";
import {
  ConversationPage,
  FollowLinkPage,
  LearningPlanPage,
  InitialPage,
  SignUpPage,
  UserTypeSelectionPage,
} from "./pages";
import { SignInPage } from "./pages/SignInPage/SignInPage";

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
        <Route path="/sign-in" element={<SignInPage />} />
        <Route path="/ai-conversation" element={<ConversationPage />} />
        <Route path="/teacher-tasks" element={<LearningPlanPage />} />
        <Route path="/join-your-school" element={<JoinYourSchoolPage />} />
        <Route path="/classes" element={<ClassesPage />} />
        <Route path="/congratulations" element={<CongratulationPage />} />
        <Route path="/*" element={<Navigate to="/initial" replace />} />
      </Routes>
    </>
  );
};

export default App;
