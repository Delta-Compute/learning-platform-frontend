import { useContext, Fragment } from "react";

import LanguageContext, { Languages } from "../../context/LanguageContext";

import {
  Listbox,
  Transition,
} from "@headlessui/react";

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

export const LanguageSelect = () => {
  const { language, changeLanguage } = useContext(LanguageContext);

  return (
    <>
      <Listbox
        value={language}
        onChange={(value: Languages) => changeLanguage(value)}
      >
        {({ open }) => (
          <>
            <div className="relative">
              <Listbox.Button className="bg-gray-100 p-[10px] rounded-[5px]">
                <div className="flex items-center gap-2">
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
              </Listbox.Button>

              <Transition
                show={open}
                as={Fragment}
                leave="transition ease-in duration-100"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <Listbox.Options
                  className="absolute right-0 z-10 mt-1 w-56 max-h-56 overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm"
                >
                  {LANGUAGES_LIST.map(lang => (
                    <Listbox.Option
                      key={lang.key}
                      value={lang.key}
                    >
                      {({ selected}) => (
                        <>
                          <div className="flex items-center justify-between gap-2 px-3 py-2">
                            <span className="text-[15px]">{lang.name}</span>

                            {selected ? (
                              <svg
                                xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                                className="text-main w-4"
                              >
                                <path d="M20 6 9 17l-5-5"/>
                              </svg>
                            ) : null}
                          </div>
                        </>
                      )}
                    </Listbox.Option>
                  ))}
                </Listbox.Options>
              </Transition>
            </div>
          </>
        )}
      </Listbox>
    </>
  );
};