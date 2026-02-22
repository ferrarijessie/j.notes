export function hexWithAlpha(hex: string, alpha: number): string {
  const cleaned = hex.replace("#", "").trim();
  if (cleaned.length !== 6) return "#00000000";
  const a = Math.round(Math.max(0, Math.min(1, alpha)) * 255)
    .toString(16)
    .padStart(2, "0");
  return `#${cleaned}${a}`;
}

export function noteDateLabel(iso: string): string {
  const d = new Date(iso);
  const now = new Date();

  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const startOfThatDay = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  const diffDays = Math.round((startOfToday.getTime() - startOfThatDay.getTime()) / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "today";
  if (diffDays === 1) return "yesterday";

  const month = d.toLocaleString(undefined, { month: "short" });
  return `${month} ${d.getDate()}`;
}

export function lastEditedLabel(d: Date): string {
  const datePart = new Intl.DateTimeFormat(undefined, {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(d);

  const timePartRaw = new Intl.DateTimeFormat(undefined, {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(d);

  const timePart = timePartRaw
    .trim()
    .toLowerCase()
    .replace(/\s?(am|pm)$/, "$1");

  return `${datePart} at ${timePart}`;
}
