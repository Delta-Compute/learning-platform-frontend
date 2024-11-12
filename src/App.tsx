// import { useContext } from "react";

import { Navigate, Route, Routes } from "react-router-dom";

// import { UserRole } from "./types";
//
// import UserContext from "./context/UserContext";

import {
  AssignmentDetailPage,
  ClassDetailPage,
  ConversationPage,
  FollowLinkPage,
  InitialPage,
  SignUpPage,
  StudentAssignmentsPage,
  UserTypeSelectionPage,
  SignInPage,
} from "./pages";
import JoinYourSchoolPage from "./pages/JoinYourSchoolPage";
import ClassesPage from "./pages/ClassesPage/ClassRoom";

import { Toaster } from "react-hot-toast";

import { LanguageSwitch } from "./components";

const App = () => {
  // const { user, isUserRefetching } = useContext(UserContext);

  return (
    <>
      <Toaster />

      <div className="fixed top-[10px] right-[10px] z-[4]">
        <LanguageSwitch />
      </div>

      {/*{!isUserRefetching && (*/}
      {/*  <Routes>*/}
      {/*    {user === null && (*/}
      {/*      <>*/}
      {/*        <Route path="/initial" element={<InitialPage />} />*/}
      {/*        <Route path="/follow-link" element={<FollowLinkPage />} />*/}
      {/*        <Route path="/sign-up" element={<SignUpPage />} />*/}
      {/*        <Route path="/sign-in" element={<SignInPage />} />*/}
      {/*        <Route path="/*" element={<Navigate to="/initial" replace />} />*/}
      {/*      </>*/}
      {/*    )}*/}

      {/*    {user?.role === UserRole.Teacher && user.firstName && user.lastName && (*/}
      {/*      <>*/}
      {/*        <Route path="/teacher-assignments/:classRoomId" element={<ConversationPage role="teacher" />} />*/}
      {/*        <Route path="/classes" element={<ClassesPage />} />*/}
      {/*        <Route path="/classes/:id" element={<ClassDetailPage />} />*/}
      {/*        <Route path="/classes/:classRoomId/:assignmentId" element={<AssignmentDetailPage />} />*/}
      {/*        <Route path="/*" element={<Navigate to="/classes" replace />} />*/}
      {/*      </>*/}
      {/*    )}*/}

      {/*    {user?.role === UserRole.Student && user.firstName && user.lastName && (*/}
      {/*      <>*/}
      {/*        <Route path="/student-assignments" element={<StudentAssignmentsPage />} />*/}
      {/*        <Route path="/student-assignments/:assignmentId" element={<ConversationPage role="student" />} />*/}
      {/*        <Route path="/*" element={<Navigate to="/student-assignments" replace />} />*/}
      {/*      </>*/}
      {/*    )}*/}

      {/*    {user !== null && (!user.role || !user.firstName || !user.lastName) && (*/}
      {/*      <>*/}
      {/*        <Route*/}
      {/*          path="/user-type-selection"*/}
      {/*          element={<UserTypeSelectionPage />}*/}
      {/*        />*/}
      {/*        <Route path="/join-your-school" element={<JoinYourSchoolPage />} />*/}
      {/*        <Route path="/*" element={<Navigate to="/user-type-selection" replace />} />*/}
      {/*      </>*/}
      {/*    )}*/}
      {/*  </Routes>*/}
      {/*)}*/}

      <Routes>
        <Route path="/initial" element={<InitialPage />} />
        <Route path="/follow-link" element={<FollowLinkPage />} />
        <Route path="/sign-up" element={<SignUpPage />} />
        <Route path="/sign-in" element={<SignInPage />} />

        <Route path="/teacher-assignments/:classRoomId" element={<ConversationPage role="teacher" />} />
        <Route path="/classes" element={<ClassesPage />} />
        <Route path="/classes/:id" element={<ClassDetailPage />} />
        <Route path="/classes/:classRoomId/:assignmentId" element={<AssignmentDetailPage />} />

        <Route path="/student-assignments" element={<StudentAssignmentsPage />} />
        <Route path="/student-assignments/:assignmentId" element={<ConversationPage role="student" />} />

        <Route
          path="/user-type-selection"
          element={<UserTypeSelectionPage />}
        />
        <Route path="/join-your-school" element={<JoinYourSchoolPage />} />

        <Route path="/*" element={<Navigate to="/initial" replace />} />
      </Routes>
    </>
  );
};

export default App;
