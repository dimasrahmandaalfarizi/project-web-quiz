"use client";

import { cn } from "@/lib/utils";
import { motion, HTMLMotionProps } from "framer-motion";
import React from "react";

interface NeoButtonProps extends HTMLMotionProps<"button"> {
  variant?: "primary" | "secondary" | "accent" | "green" | "purple" | "white";
  size?: "sm" | "md" | "lg";
}

export const NeoButton = React.forwardRef<HTMLButtonElement, NeoButtonProps>(
  ({ className, variant = "primary", size = "md", children, ...props }, ref) => {
    const variants = {
      primary: "bg-[var(--color-neo-primary)] text-white",
      secondary: "bg-[var(--color-neo-secondary)] text-white",
      accent: "bg-[var(--color-neo-accent)] text-black",
      green: "bg-[var(--color-neo-green)] text-black",
      purple: "bg-[var(--color-neo-purple)] text-white",
      white: "bg-white text-black",
    };

    const sizes = {
      sm: "px-4 py-2 text-sm font-bold",
      md: "px-6 py-3 text-base font-bold",
      lg: "px-8 py-4 text-xl font-bold",
    };

    return (
      <motion.button
        ref={ref}
        whileHover={{ x: -2, y: -2, boxShadow: "var(--shadow-neo-hover)" }}
        whileTap={{ x: 2, y: 2, boxShadow: "var(--shadow-neo-active)" }}
        className={cn(
          "border-4 border-[var(--color-neo-dark)] rounded-[var(--radius-neo)] transition-colors",
          "shadow-[var(--shadow-neo)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--color-neo-dark)]",
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      >
        {children}
      </motion.button>
    );
  }
);
NeoButton.displayName = "NeoButton";
