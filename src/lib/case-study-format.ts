export type CaseStudyMetricUnit =
  | "count"
  | "percent"
  | "currency"
  | "days"
  | "hours"
  | "ratio";

const numberFormatter = new Intl.NumberFormat("en-US", {
  maximumFractionDigits: 2,
});

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

export function formatCaseStudyMetric(
  value: number,
  unit: CaseStudyMetricUnit
): string {
  if (!Number.isFinite(value)) return "Unavailable";
  if (unit === "currency") return currencyFormatter.format(value);
  const formatted = numberFormatter.format(value);
  if (unit === "percent") return `${formatted}%`;
  if (unit === "hours") return `${formatted} hours`;
  if (unit === "days") return `${formatted} days`;
  if (unit === "ratio") return `${formatted} ratio`;
  return formatted;
}

export function formatCaseStudyReleaseDate(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Release date unavailable";
  return new Intl.DateTimeFormat("en-US", { dateStyle: "long" }).format(date);
}
