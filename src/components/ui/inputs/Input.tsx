import React, { useState } from "react";

import { cn } from "../../../utils";

import eye from "../../../assets/icons/eye.svg";
import eyeOff from "../../../assets/icons/eye-off.svg";

type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  isPassword?: boolean;
};

export const Input: React.FC<InputProps> = ({ isPassword, ...props }) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="relative w-full">
      <input
        {...props}
        type={isPassword ? (showPassword ? "text" : "password") : props.type}
        className={cn(
          "border-[1px] px-4 py-3 rounded-full focus:border-main w-full",
          props.className,
        )}
      />
      {isPassword && (
        <button
          type="button"
          onClick={() => setShowPassword((prev) => !prev)}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500"
        >
          {showPassword ? (
            <img src={eye} alt="eye" className="w-[32px] h-[32px]" />
          ) : (
            <img src={eyeOff} alt="eye-off" className="w-[32px] h-[32px]" />
          )}
        </button>
      )}
    </div>
  );
};
