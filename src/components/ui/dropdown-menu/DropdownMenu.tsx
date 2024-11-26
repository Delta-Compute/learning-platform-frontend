import React from "react";

import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";

interface DropDownMenuProps {
  menuItems: { title: string }[];
  children: React.ReactNode;
};

export const DropdownMenu: React.FC<DropDownMenuProps> = ({
  menuItems,
  children,
}) => {
  return (
    <Menu as="div" className="relative inline-block text-left">
      <div>
        <MenuButton className="inline-flex w-full justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
          {children}
        </MenuButton>
      </div>

      <MenuItems
        transition
        className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black/5 transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in"
      >
        <div className="py-1">
          {menuItems.map(item => (
            <MenuItem key={item.title}>
              <div>{item.title}</div>
            </MenuItem>
          ))}
        </div>
      </MenuItems>
    </Menu>
  );
};
