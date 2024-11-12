import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import { EN, PT } from "./locales";

const resources = {
  en: {
    translation: EN,
  },
  pt: {
    translation: PT,
  },
};

i18n.use(initReactI18next).init({
  resources,
  lng: "en",
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
