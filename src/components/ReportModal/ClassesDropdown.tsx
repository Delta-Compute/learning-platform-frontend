import { useRef, useState } from 'react';
import { Class } from '../../types/class';
import { TFunction } from 'i18next';

interface ClassesDropdownProps {
  classes: Class[] | [];
  setSelectedClass: (classItem: Class) => void;
  classChosenItem: Class | null;
  t: TFunction<"translation", undefined>;
}

export const ClassesDropdown: React.FC<ClassesDropdownProps> = ({ classes, setSelectedClass, classChosenItem, t }) => {
  const dropdownRef = useRef<HTMLUListElement>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleBlurClass = (e: React.FocusEvent<HTMLInputElement, Element>) => {
    if (!dropdownRef.current?.contains(e.relatedTarget)) {
      setIsDropdownOpen(false);
    }
  };

  const handleSelect = (classItem: Class) => {
    setSelectedClass(classItem);
    setIsDropdownOpen(false);
  };
  return (
    <div className="mb-4 relative">
      <label className="ml-[8px] block text-sm font-normal mb-2 text-[16px]">
        {t("teacherPages.classes.classModal.classNameLabel")}
      </label>
      <input
        value={classChosenItem?.name}
        type="text"
        placeholder={t("teacherPages.classes.classModal.classNameInputPlaceholder")}
        className="w-full border rounded-full p-3 text-gray-700 focus:outline-none"
        onClick={() => setIsDropdownOpen((prevState) => !prevState)}
        onBlur={handleBlurClass}
        readOnly
      />
      {isDropdownOpen && classes?.length && (
        <ul
          ref={dropdownRef}
          tabIndex={0}
          className="absolute z-10 bg-white border rounded-2xl shadow-md mt-1 w-full max-h-40 overflow-y-auto"
        >
          {classes
            .map((room) => (
              <li
                key={room.id}
                className="p-2 cursor-pointer hover:bg-gray-100"
                onMouseDown={() => handleSelect(room)}
              >
                {room.name}
              </li>
            ))}
        </ul>
      )}
    </div>
  )
}