import { cn } from "@/lib/utils";
import React from "react";

interface NeoInputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

export const NeoInput = React.forwardRef<HTMLInputElement, NeoInputProps>(
  ({ className, ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={cn(
          "w-full bg-white border-4 border-[var(--color-neo-dark)] rounded-[var(--radius-neo)] px-4 py-3",
          "shadow-[var(--shadow-neo)] text-base font-bold transition-all outline-none",
          "focus:translate-x-[-2px] focus:translate-y-[-2px] focus:shadow-[var(--shadow-neo-hover)]",
          "placeholder:font-normal placeholder:text-gray-400",
          className
        )}
        {...props}
      />
    );
  }
);
NeoInput.displayName = "NeoInput";
