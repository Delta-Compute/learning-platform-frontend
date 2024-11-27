import { useContext, useEffect } from "react";

import {
  Navigate,
  Route,
  Routes, useNavigate,
  useParams
} from "react-router-dom";

import {
  AssignmentDetailPage,
  ClassDetailPage,
  ConversationPage,
  FollowLinkPage,
  InitialPage,
  IntroducingWithAI,
  ProfilePage,
  SecretInfo,
  SignInPage,
  SignUpPage,
  StudentAssignmentsPage,
  UserTypeSelectionPage,
} from "../pages";

import ClassesPage from "../pages/ClassesPage/ClassRoom.tsx";
import JoinYourSchoolPage from "../pages/JoinYourSchoolPage/JoinYourSchool.tsx";

import { School } from "../context";

import SchoolNamesContext from "../context/SchoolNamesContext";
import UserContext from "../context/UserContext";
import ConfirmSecretInfoPage from '../pages/ConfirmSecretInfoPage/ConfirmSecretInfoPage.tsx';

export const MainRouter = () => {
  const { schoolName } = useParams();
  const navigate = useNavigate();

  const { currentSchoolName } = useContext(SchoolNamesContext);
  const { user } = useContext(UserContext);

  const schoolPaths = Object.values(School);

  useEffect(() => {
    if (user && user.school !== currentSchoolName) {
      navigate(`/${currentSchoolName}/initial`);
    }

    if (schoolName && schoolPaths.includes(schoolName as School)) {
      localStorage.setItem("school-name", JSON.stringify(schoolName));

      document.body.classList.add(`${schoolName}-light`);

      return () => {
        document.body.classList.remove(`${schoolName}-light`);
      }
    } else {
      navigate(`/${currentSchoolName}/initial`);
    }
  }, [schoolName, currentSchoolName, user]);

  return (
    <Routes>
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
      <Route path="/introducing-with-ai" element={<IntroducingWithAI />} />
      <Route path="/profile/:userId" element={<ProfilePage />} />
      <Route path="/secret-info-ai" element={<SecretInfo />} />
      <Route path="/confirm-secret-info-ai" element={<ConfirmSecretInfoPage />} />

      <Route
        path="/user-type-selection"
        element={<UserTypeSelectionPage />}
      />
      <Route path="/join-your-school" element={<JoinYourSchoolPage />} />

      <Route path="/*" element={<Navigate to="/initial" replace />} />
    </Routes>
  );
};