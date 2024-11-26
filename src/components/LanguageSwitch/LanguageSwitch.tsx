import React, { useContext } from "react";

import LanguageContext, { Languages } from "../../context/LanguageContext";

import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";

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

  return (
    <Menu as="div" className="relative inline-block text-left">
      <div>
        <MenuButton
          className="inline-flex w-full justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 ring-inset bg-gray-100"
        >
          <div className="flex items-center gap-2 py-[2px]">
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
          </div>
        </MenuButton>
      </div>

      <MenuItems
        transition
        className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black/5 transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-30 data-[enter]:ease-out data-[leave]:ease-in"
      >
        <div className="py-1">
          {LANGUAGES_LIST.map(lang => (
            <MenuItem
              key={lang.key}
              onClick={() => changeLanguage(lang.key)}
            >
              <div className="flex items-center justify-between gap-2 px-3 py-2">
                <span className="text-[15px]">{lang.name}</span>
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
              </div>
            </MenuItem>
          ))}
        </div>
      </MenuItems>
    </Menu>
  );
};