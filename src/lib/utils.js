import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

/** Format ISO date for display. format: "DD.MM.YYYY" | "DD.MM.YYYY HH:mm" */
export function formatDateDisplay(value, format = "DD.MM.YYYY") {
  if (value == null) return "—";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "—";
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();
  const h = String(d.getHours()).padStart(2, "0");
  const m = String(d.getMinutes()).padStart(2, "0");
  if (format === "DD.MM.YYYY HH:mm") return `${day}.${month}.${year} ${h}:${m}`;
  return `${day}.${month}.${year}`;
}
