import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatYear(firstYear: number, lastYear?: number): string {
  return lastYear ? `${firstYear}-${lastYear}` : `${firstYear}`;
}
