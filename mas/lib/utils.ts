import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

const BASE_URL = "http://localhost:3000/api/"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
