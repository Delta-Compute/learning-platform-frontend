// import { useContext } from "react";

import { Routes, Route, Navigate } from "react-router-dom";

import ClassesPage from "./pages/ClassesPage/ClassRoom";
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
import JoinYourSchoolPage from "./pages/JoinYourSchoolPage";

import { Toaster } from "react-hot-toast";  

// import UserContext from "./context/UserContext";

const App = () => {
  // const { user } = useContext(UserContext);

  return (
    <>
      <Toaster />
      <Routes>
        <Route path="/initial" element={<InitialPage />} />
        <Route path="/follow-link" element={<FollowLinkPage />} />
        <Route
          path="/user-type-selection"
          element={<UserTypeSelectionPage />}
        />
        <Route path="/sign-up" element={<SignUpPage />} />
        <Route path="/sign-in" element={<SignInPage />} />
        {<Route path="/student-assignments" element={<StudentAssignmentsPage />} />}
        {<Route path="/student-assignments/:assignmentId" element={<ConversationPage role="student" />} />}
        {<Route path="/teacher-tasks/:classRoomId" element={<ConversationPage role="teacher" />} />}
        {<Route path="/teacher-tasks" element={<ConversationPage role="teacher" />} />}
        {<Route path="/class-room-assignments/:classRoomId" element={<LearningPlanPage />} />}
        <Route path="/join-your-school" element={<JoinYourSchoolPage />} />
        {<Route path="/classes" element={<ClassesPage />} />}
        <Route path="/classes/:id" element={<ClassDetailPage />} />
        <Route path="/classes/:classRoomId/:assignmentId" element={<AssignmentDetailPage />} />
        {<Route path="/*" element={<Navigate to="/initial" replace />} />}
      </Routes>
    </>
  );
};

export default App;
