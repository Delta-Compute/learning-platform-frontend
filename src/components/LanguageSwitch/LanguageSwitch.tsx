import { useContext, useState, useRef, useEffect } from "react";

import LanguageContext, {Languages} from "../../context/LanguageContext";

const LANGUAGES_LIST = [
  {
    key: Languages.English,
    name: "English"
  },
  {
    key: Languages.Portuguese,
    name: "Portuguese",
  },
  {
    key: Languages.Spanish,
    name: "Spanish",
  },
];

export const LanguageSwitch = () => {
  const { language, changeLanguage } = useContext(LanguageContext);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  return (
    <div ref={dropdownRef}>
      <button
        className="flex gap-[8px] items-center p-[10px] bg-gray-100 rounded-[5px] relative"
        onClick={() => setIsDropdownOpen(true)}
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

        <svg
          className="w-[14px] h-[14px]"
          xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
        >
          <path d="m7 15 5 5 5-5"/>
          <path d="m7 9 5-5 5 5"/>
        </svg>
      </button>

      {isDropdownOpen && (
        <ul className="py-2 border-[1px] bg-white rounded-[8px] absolute right-0 top-12">
          {LANGUAGES_LIST.map(lang=> (
            <li
              key={lang.key}
              onClick={() => {
                changeLanguage(lang.key);
                setIsDropdownOpen(false);
              }}
              className="py-2 px-4 cursor-pointer flex justify-between items-center gap-2"
            >
              <span>{lang.name}</span>
              <div>
                {language === lang.key && (
                  <svg
                    xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                    className="text-main w-4"
                  >
                    <path d="M20 6 9 17l-5-5"/>
                  </svg>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};