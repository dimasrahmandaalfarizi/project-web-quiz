"use client";

import { cn } from "@/lib/utils";
import { motion, HTMLMotionProps } from "framer-motion";
import React from "react";

interface NeoCardProps extends HTMLMotionProps<"div"> {
  hoverable?: boolean;
}

export const NeoCard = React.forwardRef<HTMLDivElement, NeoCardProps>(
  ({ className, hoverable = false, children, ...props }, ref) => {
    return (
      <motion.div
        ref={ref}
        whileHover={hoverable ? { x: -2, y: -2, boxShadow: "var(--shadow-neo-hover)" } : {}}
        className={cn(
          "bg-white border-4 border-[var(--color-neo-dark)] rounded-[var(--radius-neo)] p-6",
          "shadow-[var(--shadow-neo)]",
          hoverable && "transition-colors cursor-pointer",
          className
        )}
        {...props}
      >
        {children}
      </motion.div>
    );
  }
);
NeoCard.displayName = "NeoCard";
