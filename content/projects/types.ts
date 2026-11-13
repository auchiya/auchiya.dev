export type ProjectLink = {
  label: string;
  href: string;
};

export type ProjectStatus = "live";

export type ProjectMeta = {
  title: string;
  year: string;
  summary: string;
  stack: string[];
  /** Set when the project is deployed and publicly available. */
  status?: ProjectStatus;
  /** Public URL for a project that is live. */
  liveUrl?: string;
  repo?: string;
  repoLabel?: string;
  links?: ProjectLink[];
};
