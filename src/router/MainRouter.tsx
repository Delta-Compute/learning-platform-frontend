import { useContext, useEffect } from "react";

import { Navigate, Route, Routes, useNavigate, useParams } from "react-router-dom";

import { UserRole } from "../types";

import {
  AssignmentDetailPage,
  ClassDetailPage,
  ConversationPageOld,
  FollowLinkPage,
  InitialPage,
  IntroducingWithAI,
  ProfilePage,
  ResetPasswordPage,
  SecretInfo,
  SignInPage,
  SignUpPage,
  StudentAssignmentsPage,
  ImprovingStudentLanguage,
} from "../pages";

import ClassesPage from "../pages/ClassesPage/ClassRoom.tsx";
import JoinYourSchoolPage from "../pages/JoinYourSchoolPage/JoinYourSchool.tsx";

import { School } from "../context";

import SchoolNamesContext from "../context/SchoolNamesContext";
import UserContext from "../context/UserContext";
import ConfirmSecretInfoPage from '../pages/ConfirmSecretInfoPage/ConfirmSecretInfoPage';
import {CheckDataAI} from '../pages/CheckDataWithAI/CheckDataWithAI.tsx';
import {FreeLessonPage} from '../pages/FreeLessonPage/FreeLessonPage.tsx';
import {FeedbackAppPage} from '../pages/FeedbackAppPage/FeedbackAppPage.tsx';


export const MainRouter = () => {
  const { schoolName } = useParams();
  const navigate = useNavigate();

  const { currentSchoolName } = useContext(SchoolNamesContext);
  const { user, isUserPending, isUserRefetching } = useContext(UserContext);

  const token = localStorage.getItem("token");

  const schoolPaths = Object.values(School);

  useEffect(() => {
    if (user && user.school !== currentSchoolName) {
      navigate(`/${currentSchoolName}/initial`);
      localStorage.removeItem("token");
      localStorage.removeItem("refreshToken");
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
      {/* auth pages if not is logged in*/}
      {!token && (
        <>
          <Route path="/initial" element={<InitialPage />} />
          <Route path="/follow-link" element={<FollowLinkPage />} />
          <Route path="/sign-up" element={<SignUpPage />} />
          <Route path="/sign-in" element={<SignInPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          <Route path="/*" element={<Navigate to={`/${currentSchoolName}/initial`} replace />} />
        </>
      )}

      {/*teacher pages*/}
      {user?.role === UserRole.Teacher && token && user?.firstName && (
        <>
          <Route path="/teacher-assignments/:classRoomId" element={<ConversationPageOld role="teacher" />} />
          <Route path="/classes" element={<ClassesPage />} />
          <Route path="/classes/:id" element={<ClassDetailPage />} />
          <Route path="/classes/:classRoomId/:assignmentId" element={<AssignmentDetailPage />} />
          <Route path="/profile/:userId" element={<ProfilePage />} />
          <Route path="/feedback" element={<FeedbackAppPage />} />
          {!isUserPending && !isUserRefetching && <Route path="/*" element={<Navigate to={`/${currentSchoolName}/classes`} replace />} />}
        </>
      )}

      {/*student pages*/}
      {user?.role === UserRole.Student && user.school === currentSchoolName && user.firstName && user.lastName && (
        <>
          <Route path="/student-assignments" element={<StudentAssignmentsPage />} />
          <Route path="/student-assignments/:assignmentId" element={<ConversationPageOld role="student" />} />
          <Route path="/free-form-lesson" element={<FreeLessonPage />} />
          <Route path="/feedback" element={<FeedbackAppPage />} />
          <Route path="/improving-lessons" element={<ImprovingStudentLanguage />} />
          {!isUserPending && !isUserRefetching && <Route path="/*" element={<Navigate to={`/${currentSchoolName}/student-assignments`} replace />} />}
        </>
      )}

      {/* if registered but without name and other fields */}
      <Route path="/join-your-school" element={<JoinYourSchoolPage />} />
      <Route path="/secret-info-ai" element={<SecretInfo />} />
      <Route path="/confirm-secret-info-ai" element={<ConfirmSecretInfoPage />} />
      <Route path="/introducing-with-ai" element={<IntroducingWithAI />} />
      <Route path="/check-data" element={<CheckDataAI />} />
    </Routes>
  );
};