import React, { useState, useRef } from "react";
import { User } from '../../types';

interface StudentDropdownProps {
  students: User[] | [];
  t: (key: string) => string;
}

const StudentDropdown: React.FC<StudentDropdownProps> = ({ students, t }) => {
  const [selectedStudent, setSelectedStudent] = useState<User | string>("All");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLUListElement | null>(null);

  const handleBlur = (e: React.FocusEvent<HTMLInputElement, Element>) => {
    if (!dropdownRef.current?.contains(e.relatedTarget)) {
      setIsDropdownOpen(false);
    }
  };

  const handleSelect = (student: User | string) => {
    setSelectedStudent(student);
    setIsDropdownOpen(false);
  };

  return (
    <div className="mb-4 relative">
      <label className="ml-[8px] block text-sm font-normal mb-2 text-[16px]">
        {t("teacherPages.classes.studentDropdownLabel")}
      </label>
      <input
        value={typeof selectedStudent === "string" ? "All" : `${selectedStudent.firstName} ${selectedStudent.lastName}`}
        type="text"
        placeholder={t("teacherPages.classes.studentDropdownPlaceholder")}
        className="w-full border rounded-full p-3 text-gray-700 focus:outline-none"
        onFocus={() => setIsDropdownOpen(true)}
        onBlur={handleBlur}
        readOnly
      />
      {isDropdownOpen && (
        <ul
          ref={dropdownRef}
          tabIndex={0}
          className="absolute z-10 bg-white border rounded-md shadow-md mt-1 w-full max-h-40 overflow-y-auto"
        >
          <li
            className="p-2 cursor-pointer hover:bg-gray-100"
            onMouseDown={() => handleSelect("All")}
          >
            All
          </li>
          {students.map((student: User) => (
            <li
              key={student.id}
              className="p-2 cursor-pointer hover:bg-gray-100"
              onMouseDown={() => handleSelect(student)}
            >
              {student.firstName} {student.lastName}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default StudentDropdown;