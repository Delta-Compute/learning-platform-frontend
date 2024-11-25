import React, { useCallback, useEffect, useState } from "react";

import { useTranslation } from "react-i18next";

export enum Languages {
  English = "en",
  Portuguese = "pt",
  Spanish = "sp",
};

interface LanguageContextType {
  language: Languages;
  changeLanguage: (lang: Languages) => void;
}

const LanguageContext = React.createContext({} as LanguageContextType);

export const LanguageContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const storedLanguage = localStorage.getItem("language");
  const initialLanguage = storedLanguage ? JSON.parse(storedLanguage) : Languages.English;
  const [lang, setLang] = useState<Languages>(initialLanguage);
  const { i18n } = useTranslation();

  useEffect(() => {
    localStorage.setItem("language", JSON.stringify(lang));
    changeLanguage(lang);
  }, [lang]);

  const changeLanguage = useCallback((lang: Languages) => {
    i18n.changeLanguage(lang);
    setLang(lang);
  }, []);

  return (
    <LanguageContext.Provider
      value={{
        language: lang,
        changeLanguage,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export default LanguageContext;