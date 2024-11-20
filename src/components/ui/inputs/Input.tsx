import React from "react";

import { cn } from "../../../utils";

type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

export const Input: React.FC<InputProps> = props => {
  return (
    <input
      {...props}
      className={cn(
        "border-[1px] px-4 py-3 rounded-full focus:border-main",
        props.className,
      )}
    />
  );
};
