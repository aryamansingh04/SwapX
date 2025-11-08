import { formatInTimeZone } from "date-fns-tz";
export const fmtLocal = (iso: string, tz: string, pattern = "EEE, dd MMM yyyy • HH:mm zzz") =>
  formatInTimeZone(new Date(iso), tz, pattern);
export const nowUtcISO = () => new Date().toISOString();

