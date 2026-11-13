const dateFormatter = new Intl.DateTimeFormat("en", {
  dateStyle: "medium",
  timeZone: "UTC",
});

/** Format a YYYY-MM-DD date without shifting it across time zones. */
export function formatDate(date: string) {
  const value = /^\d{4}-\d{2}-\d{2}$/.test(date) ? `${date}T00:00:00Z` : date;

  return dateFormatter.format(new Date(value));
}
