export type MiscMeta = {
  title: string;
  /** Publication date in YYYY-MM-DD format. */
  date: string;
  /** Manual sort position; lower values appear first. */
  order?: number;
  tags: string[];
  note: string;
  summary: string;
};
