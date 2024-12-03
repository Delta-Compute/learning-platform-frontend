import React from "react";

import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";

interface DropDownMenuProps {
  menuItems: { title: string }[];
  children: React.ReactNode;
  onClick: () => void;
};

export const DropdownMenu: React.FC<DropDownMenuProps> = ({
  menuItems,
  children,
  onClick,
}) => {
  return (
    <Menu as="div" className="relative inline-block text-left">
      <div>
        <MenuButton className="inline-flex w-full justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900">
          {children}
        </MenuButton>
      </div>

      <MenuItems
        transition
        className="absolute right-0 z-10 mt-2 w-[120px] origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black/5 transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in"
      >
        <div className="py-1">
          {menuItems.map(item => (
            <MenuItem
              key={item.title}
              className="p-2"
            >
              <div onClick={onClick}>{item.title}</div>
            </MenuItem>
          ))}
        </div>
      </MenuItems>
    </Menu>
  );
};
