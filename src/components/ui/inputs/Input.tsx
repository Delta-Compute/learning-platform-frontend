import React from "react";

import { cn } from "../../../utils";

type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

export const Input: React.FC<InputProps> = props => {
  return (
    <input
      {...props}
      className={cn(
        "border-[1px] p-[16px] rounded-full",
        props.className,
      )}
    />
  );
};
