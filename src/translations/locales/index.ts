import AUTH_PAGES_EN from "./auth-pages/auth-pages.en.json";
import AUTH_PAGES_PT from "./auth-pages/auth-pages.pt.json";
import STUDENT_PAGES_EN from "./student-pages/student-pages.en.json";
import STUDENT_PAGES_PT from "./student-pages/student-pages.pt.json";
import CONVERSATION_PAGE_EN from "./conversation-page/conversation-page.en.json";
import CONVERSATION_PAGE_PT from "./conversation-page/conversation-page.pt.json";
import TEACHER_PAGES_EN from "./teacher-pages/teacher-pages.en.json";
import TEACHER_PAGES_PT from "./teacher-pages/teacher-pages.pt.json";

export const EN = {
  ...AUTH_PAGES_EN,
  ...STUDENT_PAGES_EN,
  ...CONVERSATION_PAGE_EN,
  ...TEACHER_PAGES_EN,
};

export const PT = {
  ...AUTH_PAGES_PT,
  ...STUDENT_PAGES_PT,
  ...CONVERSATION_PAGE_PT,
  ...TEACHER_PAGES_PT,
};
