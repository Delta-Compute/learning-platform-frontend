import React, { useState } from "react";

import { cn } from "../../../utils";

import { Eye, EyeOff } from "lucide-react";

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
            <Eye />
          ) : (
            <EyeOff />
          )}
        </button>
      )}
    </div>
  );
};
