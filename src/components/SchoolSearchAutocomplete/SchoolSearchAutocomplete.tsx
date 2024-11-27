import React, { Fragment, useEffect, useState } from "react";

import { useTranslation } from "react-i18next";

import { useQuery } from "@tanstack/react-query";
import { GooglePlacesSearchApi } from "../../services";

import { Combobox, Transition } from "@headlessui/react";

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
  const [debouncedSchoolName, setDebouncedSchoolName] = useState(schoolName);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSchoolName(schoolName);
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [schoolName]);

  const {
    data: schools,
    refetch: refetchSchools,
    isRefetching: isSchoolSearchingRefetching
  } = useQuery({
    queryFn: () => GooglePlacesSearchApi.schoolSearch(debouncedSchoolName),
    queryKey: ["schools", debouncedSchoolName],
    staleTime: 5_000_000,
    enabled: !!debouncedSchoolName,
  });

  useEffect(() => {
    if (debouncedSchoolName) {
      refetchSchools();
    }
  }, [debouncedSchoolName, refetchSchools]);

  return (
    <div className="w-full">
      <Combobox
        value={selected}
        onChange={(value) => {
          setSelected(value as School);
          setSchoolName(value?.name || "");
          onSelectSchool(value as School);
        }}
      >
        <div className="relative mt-1">
          <div className="relative w-full cursor-default overflow-hidden rounded-full p-1 border-[1px] bg-white text-left">
            <Combobox.Input
              className="w-full border-none py-2 pl-3 pr-10"
              displayValue={(school: School | null) => school?.name || schoolName}
              onChange={(event) => setSchoolName(event.target.value)}
            />
            <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2">
              {/* Іконка чи кнопка */}
            </Combobox.Button>
          </div>
          <Transition
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Combobox.Options className="absolute mt-2 max-h-60 w-full overflow-auto rounded-[16px] bg-white p-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm">
              {schools?.length === 0 && schoolName !== "" && !isSchoolSearchingRefetching ? (
                <div className="relative cursor-default text-[14px] select-none px-4 py-2 text-gray-500">
                  Nothing found.
                </div>
              ) : (
                schools?.map((school) => (
                  <Combobox.Option
                    key={school?.placeId}
                    value={school}
                    className="p-2 text-[14px]"
                  >
                    {({ selected }) => (
                      <>
                        <span
                          className={`block truncate ${
                            selected ? 'font-medium' : 'font-normal'
                          }`}
                        >
                          {school?.name}
                        </span>
                      </>
                    )}
                  </Combobox.Option>
                ))
              )}

              {isSchoolSearchingRefetching && <div className="relative cursor-default text-[14px] px-4 py-2 text-gray-700">{t("authPages.joinYourSchool.loadingText")}</div>}
            </Combobox.Options>
          </Transition>
        </div>
      </Combobox>
    </div>
  );
};
