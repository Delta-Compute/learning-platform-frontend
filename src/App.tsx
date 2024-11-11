import { useContext, useEffect } from "react";

import { Routes, Route, Navigate } from "react-router-dom";

import UserContext from "./context/UserContext";

import ClassesPage from "./pages/ClassesPage/ClassRoom";
import {
  ConversationPage,
  FollowLinkPage,
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

const App = () => {
  const { user, isUserRefetching } = useContext(UserContext);

  useEffect(() => {
    console.log("user", isUserRefetching, user);
  }, [user]);

  return (
    <>
      <Toaster />

      {!isUserRefetching && (
        <Routes>
          {user === null && (
            <>
              <Route path="/initial" element={<InitialPage />} />
              <Route path="/follow-link" element={<FollowLinkPage />} />
              <Route
                path="/user-type-selection"
                element={<UserTypeSelectionPage />}
              />
              <Route path="/sign-up" element={<SignUpPage />} />
              <Route path="/sign-in" element={<SignInPage />} />
              <Route path="/join-your-school" element={<JoinYourSchoolPage />} />
              <Route path="/*" element={<Navigate to="/initial" replace />} />
            </>
          )}

          {user?.role === "teacher" && (
            <>
              <Route path="/teacher-assignments/:classRoomId" element={<ConversationPage role="teacher" />} />
              <Route path="/classes" element={<ClassesPage />} />
              <Route path="/classes/:id" element={<ClassDetailPage />} />
              <Route path="/classes/:classRoomId/:assignmentId" element={<AssignmentDetailPage />} />
              <Route path="/*" element={<Navigate to="/classes" replace />} />
            </>
          )}

          {user?.role === "student" && (
            <>
              <Route path="/student-assignments" element={<StudentAssignmentsPage />} />
              <Route path="/student-assignments/:assignmentId" element={<ConversationPage role="student" />} />
              <Route path="/*" element={<Navigate to="/student-assignments" replace />} />
            </>
          )}
        </Routes>
      )}
    </>
  );
};

export default App;
