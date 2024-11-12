import { useContext } from "react";

import LanguageContext, { Languages } from "../../context/LanguageContext";

export const LanguageSwitch = () => {
  const { toggleLanguage, language } = useContext(LanguageContext);

  return (
    <div>
      <button
        className="flex gap-[8px] items-center p-[10px] bg-gray-100 rounded-[5px]"
        onClick={() => {
          if (language === Languages.English) {
            toggleLanguage(Languages.Portuguese);
          } else {
            toggleLanguage(Languages.English);
          }
        }}
      >
        <svg
          className="w-[20px] h-[20px]"
          xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="10"/>
          <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/>
          <path d="M2 12h20"/>
        </svg>

        <span>{language}</span>
      </button>
    </div>
  );
};