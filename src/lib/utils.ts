import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import type { $ZodIssue } from "zod/v4/core";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function createError(errors: $ZodIssue[]) {
  return errors.map((i) => `${i.path.join(".")}: ${i.message}`).join(", ");
}
