import { format, parseISO } from "date-fns";

function formatDate(value: string) {
  if (!value) {
    return "No date";
  }

  try {
    return format(parseISO(value), "MMM d, yyyy");
  } catch {
    return value;
  }
}

export function formatDateRange(startDate: string, endDate: string) {
  return `${formatDate(startDate)} - ${formatDate(endDate)}`;
}
