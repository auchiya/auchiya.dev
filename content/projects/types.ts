export type ProjectLink = {
  label: string;
  href: string;
};

export type ProjectMeta = {
  title: string;
  year: string;
  summary: string;
  stack: string[];
  repo: string;
  repoLabel?: string;
  links?: ProjectLink[];
};
