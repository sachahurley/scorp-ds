/**
 * UTILITY FUNCTIONS
 * 
 * Common helper functions used throughout the application
 */

import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * CN (ClassName) Utility
 * 
 * Combines clsx and tailwind-merge for smart className handling:
 * - clsx: Conditionally joins classNames together
 * - tailwind-merge: Intelligently merges Tailwind classes (removes conflicts)
 * 
 * Example:
 * cn("px-2 py-1", condition && "bg-red-500", "px-4")
 * Result: "py-1 bg-red-500 px-4" (px-2 is overridden by px-4)
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

