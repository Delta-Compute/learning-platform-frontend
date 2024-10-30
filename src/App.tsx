// import { useContext } from "react";

import { Routes, Route, Navigate } from "react-router-dom";

import ClassesPage from "./pages/ClassesPage";
import {
  ConversationPage,
  FollowLinkPage,
  LearningPlanPage,
  InitialPage,
  SignUpPage,
  UserTypeSelectionPage,
  ClassDetailPage,
  AssignmentDetailPage,
  StudentAssignmentsPage,
} from "./pages";
import { SignInPage } from "./pages/SignInPage/SignInPage";
import JoinYourSchoolPage from './pages/JoinYourSchoolPage';

// import UserContext from "./context/UserContext";

const App = () => {
  // const { user } = useContext(UserContext);

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
        {<Route path="/student-assignments" element={<StudentAssignmentsPage />} />}
        {<Route path="/student-assignments/:assignmentId" element={<div><ConversationPage /></div>} />}
        {<Route path="/teacher-tasks" element={<LearningPlanPage />} />}
        <Route path="/join-your-school" element={<JoinYourSchoolPage />} />
        {<Route path="/classes" element={<ClassesPage />} />}
        <Route path="/classes/:id" element={<ClassDetailPage />} />
        <Route
          path="/assignments/:id"
          element={<AssignmentDetailPage />}
        />
        <Route path="/*" element={<Navigate to="/initial" replace />} />
      </Routes>
    </>
  );
};

export default App;
