import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs))
} 


export const isIframe = window.self !== window.top;

export function shopifyImage(url, width) {
  if (!url) return null;
  return url.includes("?") ? `${url}&width=${width}` : `${url}?width=${width}`;
}

export function clamp(val, min, max) {
  return Math.min(Math.max(val, min), max);
}

