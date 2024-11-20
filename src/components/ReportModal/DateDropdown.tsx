import React, { useState, useRef } from "react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";

interface DateDropdownProps {
  t: (key: string) => string;
  setSelectedOption: React.Dispatch<React.SetStateAction<string | { from: number; to: number }>>;
  selectedOption: string | { from: number; to: number };
}

const options = ["Last week", "Last month", "Last 3 months", "Last 6 months", "Last year"];

export const DateDropdown: React.FC<DateDropdownProps> = ({ t, setSelectedOption, selectedOption }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [range, setRange] = useState<{ from?: Date; to?: Date }>({});
  const dropdownRef = useRef<HTMLUListElement | null>(null);

  const handleBlur = (e: React.FocusEvent<HTMLInputElement, Element>) => {
    if (!dropdownRef.current?.contains(e.relatedTarget)) {
      setIsDropdownOpen(false);
    }
  };

  const handleSelect = (option: string) => {
    setSelectedOption(option);
    setIsDropdownOpen(false);
    setIsCalendarOpen(false);
  };

  const handleManualSelection = () => {
    setIsDropdownOpen(false);
    setRange({});
    setIsCalendarOpen(true);
  };

  const handleDateRangeSelection = (selectedRange: { from?: Date; to?: Date }) => {
    setRange(selectedRange);

    if (selectedRange?.from && selectedRange?.to) {
      setSelectedOption({
        from: selectedRange.from.getTime(),
        to: selectedRange.to.getTime(),
      });
    }
  };

  const handleOpenDropdown = () => {
    setIsDropdownOpen((prevState) => !prevState);
    setIsCalendarOpen(false);
  };

  return (
    <div className="mb-4 relative">
      <label className="ml-[8px] block text-sm font-normal mb-2 text-[16px]">
        {t("teacherPages.classes.classModal.dateDropdownLabel")}
      </label>
      <input
        value={
          typeof selectedOption === "string"
            ? selectedOption
            : range?.from && range?.to
            ? `${range.from.toLocaleDateString()} - ${range.to.toLocaleDateString()}`
            : ""
        }
        type="text"
        placeholder={t("teacherPages.classes.classModal.dateDropdownPlaceholder")}
        className="w-full border rounded-full p-3 text-gray-700 focus:outline-none"
        onClick={() => handleOpenDropdown()}
        onBlur={handleBlur}
        readOnly
      />
      {isDropdownOpen && (
        <ul
          ref={dropdownRef}
          tabIndex={0}
          className="absolute z-10 bg-white border rounded-2xl shadow-md mt-1 w-full max-h-40 overflow-y-auto"
        >
          {options.map((option) => (
            <li
              key={option}
              className="p-2 cursor-pointer hover:bg-gray-100"
              onMouseDown={() => handleSelect(option)}
            >
              {option}
            </li>
          ))}
          <li
            className="p-2 cursor-pointer hover:bg-gray-100 text-blue-500 flex items-center gap-2"
            onMouseDown={handleManualSelection}
          >
            {t("teacherPages.classes.classModal.dateDropdownManualButton")}
          </li>
        </ul>
      )}
      {isCalendarOpen && (
        <div className="absolute bottom-10 z-20 bg-white border rounded-2xl shadow-md mt-1 p-4 w-full">
          <DayPicker
            mode="range"
            selected={range?.from && range?.to ? { from: range.from, to: range.to } : undefined}
            onSelect={(range) => handleDateRangeSelection(range as { from: Date; to: Date })}
          />
          <button
            className="mt-4 w-full p-2 bg-blue-500 text-white rounded-lg"
            onClick={() => setIsCalendarOpen(false)}
          >
            {t("teacherPages.classes.classModal.dateDropdownCloseButton")}
          </button>
        </div>
      )}
    </div>
  );
};