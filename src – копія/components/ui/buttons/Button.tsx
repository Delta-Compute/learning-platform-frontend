import React from "react";

import { cn } from "../../../utils";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement>;

export const Button: React.FC<ButtonProps> = (props) => {
  return (
    <button
      {...props}
      className={cn(
        "pt-[10px] py-4 rounded-[40px] border-[1px] ease-in-out transition-all duration-25",
        props.className
      )}
    >
      {props.children}
    </button>
  );
};
