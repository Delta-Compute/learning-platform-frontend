import React, { Fragment, useEffect, useState } from "react";

import { useTranslation } from "react-i18next";

import { useQuery } from "@tanstack/react-query";
import { GooglePlacesSearchApi } from "../../services";

import { Combobox, Transition } from "@headlessui/react";

import { MapPin, Search, X } from "lucide-react";

export type School = {
  placeId: string;
  name: string;
  address: string;
  location: {
    lat: number;
    lng: number;
  };
};

interface SchoolSearchAutocompleteProps {
  schoolName: string;
  setSchoolName: React.Dispatch<React.SetStateAction<string>>;
  onSelectSchool: (value: School) => void;
};

export const SchoolSearchAutocomplete: React.FC<SchoolSearchAutocompleteProps> = ({
  schoolName,
  setSchoolName,
  onSelectSchool,
}) => {
  const { t } = useTranslation();
  const [selected, setSelected] = useState<School | null>(null);
  const [debouncedSchoolName, setDebouncedSchoolName] = useState("");
  const [isSelectingSchool, setIsSelectingSchool] = useState(false);

  const {
    data: schools,
    refetch: refetchSchools,
    isRefetching: isSchoolSearchingRefetching
  } = useQuery({
    queryFn: () => GooglePlacesSearchApi.schoolSearch(debouncedSchoolName),
    queryKey: ["schools-search"],
    staleTime: 5_000_000,
    enabled: !!debouncedSchoolName,
  });

  const changeComboboxHandler = (value: any) => {
    setIsSelectingSchool(true);
    setSelected(value as School);
    onSelectSchool(value as School);
    setSchoolName(value?.name || "");
    setDebouncedSchoolName("");
  };

  useEffect(() => {
    const handler = setTimeout(() => {
      if (!isSelectingSchool) {
        setDebouncedSchoolName(schoolName);
      }
    }, 300);

    return () => {
      clearTimeout(handler);
    };
  }, [schoolName, isSelectingSchool]);

  useEffect(() => {
    if (debouncedSchoolName) {
      refetchSchools();
    }
  }, [debouncedSchoolName, refetchSchools]);

  return (
    <div className="w-full">
      <Combobox
        value={selected}
        onChange={changeComboboxHandler}
      >
        <div className="relative mt-1">
          <div className="relative w-full cursor-default overflow-hidden rounded-full p-1 border-[1px] bg-white text-left">
            <Combobox.Input
              className="w-full border-none py-2 pl-3 pr-[70px]"
              placeholder="Search school"
              value={schoolName}
              displayValue={(school: School | null) => school?.name || schoolName}
              onChange={(event) => {
                setSchoolName(event.target.value);
                setIsSelectingSchool(false);
              }}
            />
            <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-3">
              <Search strokeWidth={1.5} />
            </Combobox.Button>
            {(schoolName !== "" || selected) && (
              <Combobox.Button
                onClick={() => {
                  setDebouncedSchoolName("");
                  setSchoolName("");
                  setSelected(null);
                }}
                className="absolute inset-y-3 right-[40px] flex items-center p-1 border-r-[1px]"
              >
                <X size={16} />
              </Combobox.Button>
            )}
          </div>

          {schools?.length === 0 && schoolName !== "" && !isSchoolSearchingRefetching && (
            <div className="text-[14px] px-4 py-3 text-gray-700 absolute mt-2 max-h-60 w-full bg-white rounded-[16px] shadow-lg">
              Nothing found.
            </div>
          )}

          {isSchoolSearchingRefetching && (
            <div
              className="text-[14px] px-4 py-3 text-gray-700 absolute mt-2 max-h-60 w-full bg-white rounded-[16px] shadow-lg"
            >
              {t("authPages.joinYourSchool.loadingText")}
            </div>
          )}

          {schools?.length !== 0 && schoolName !== "" && !isSchoolSearchingRefetching && (<Transition
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Combobox.Options
              className="absolute mt-2 max-h-60 w-full overflow-auto rounded-[16px] bg-white z-40 p-1 text-base shadow-lg focus:outline-none sm:text-sm"
            >
              {schools?.map((school) => (
                <Combobox.Option
                  key={school?.placeId}
                  value={school}
                  className="p-2 text-[14px] cursor-pointer"
                >
                  {({ selected }) => (
                    <>
                      <div>
                        <span
                          className={`block truncate text-sm ${
                            selected ? "font-medium" : "font-normal"
                          }`}
                        >
                        {school?.name}
                      </span>
                      </div>
                      <div className="flex items-center gap-1 text-gray-600 mt-1">
                        <div>
                          <MapPin size={15} />
                        </div>
                        <span
                          className={`block truncate text-xs ${
                            selected ? "font-medium" : "font-normal"
                          }`}
                        >
                        {school?.address}
                      </span>
                      </div>
                    </>
                  )}
                </Combobox.Option>
              ))}
            </Combobox.Options>
          </Transition>)}
        </div>
      </Combobox>
    </div>
  );
};
