import {
  differenceInCalendarDays,
  endOfMonth,
  format,
  parseISO,
  startOfMonth,
} from "date-fns";

/** Treat the system date as fixed so the mock data lines up with "today". */
export const TODAY = parseISO("2026-05-11");

export function fmtDate(iso?: string): string {
  if (!iso) return "—";
  return format(parseISO(iso), "MMM d, yyyy");
}

export function fmtShort(iso?: string): string {
  if (!iso) return "—";
  return format(parseISO(iso), "MMM d");
}

export function daysFromToday(iso: string): number {
  return differenceInCalendarDays(parseISO(iso), TODAY);
}

export function daysBetween(aIso: string, bIso: string): number {
  return differenceInCalendarDays(parseISO(bIso), parseISO(aIso));
}

/**
 * Return the four week buckets for the current month, each labelled "May 4–10".
 * Anchored to TODAY's month.
 */
export function weeksOfCurrentMonth(): { label: string; start: Date; end: Date }[] {
  const monthStart = startOfMonth(TODAY);
  const monthEnd = endOfMonth(TODAY);
  const buckets: { label: string; start: Date; end: Date }[] = [];
  let cursor = new Date(monthStart);
  while (cursor <= monthEnd) {
    const start = new Date(cursor);
    const end = new Date(cursor);
    end.setDate(end.getDate() + 6);
    const clampedEnd = end > monthEnd ? monthEnd : end;
    buckets.push({
      label: `${format(start, "MMM d")}–${format(clampedEnd, "d")}`,
      start,
      end: clampedEnd,
    });
    cursor = new Date(end);
    cursor.setDate(cursor.getDate() + 1);
  }
  return buckets.slice(0, 4);
}
