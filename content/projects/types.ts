export type ProjectLink = {
  label: string;
  href: string;
};

export type ProjectStatus = "live";

export type ProjectImage = {
  /** Hashed URL from an imported asset, e.g. `/_next/static/media/foo.1a2b3c4d.webp`. */
  src: string;
  /** Describe what the screenshot shows. */
  alt: string;
  /** Intrinsic pixel dimensions of the original file. */
  width: number;
  height: number;
  /** Optional text shown under the screenshot. */
  caption?: string;
};

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
  /** Screenshots shown in a gallery on the project page. */
  screenshots?: ProjectImage[];
};
