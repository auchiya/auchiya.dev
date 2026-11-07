export type NavItem = {
  href: string;
  label: string;
};

export type SocialLink = {
  label: string;
  href: string;
  icon: "mail" | "github" | "x" | "linkedin";
};

export type Post = {
  slug: string;
  title: string;
  date: string;
  summary: string;
};

export type MiscItem = {
  title: string;
  note: string;
  href: string;
};

export const site = {
  name: "Your Name",
  monogram: "YN",
  role: "Software Engineer",
  location: "Your City",
  email: "you@example.com",
  description: "Personal site of Your Name, a software engineer.",
};

export const nav: NavItem[] = [
  { href: "/", label: "About" },
  { href: "/writing", label: "Writing" },
  { href: "/misc", label: "Misc" },
];

export const socials: SocialLink[] = [
  { label: "Email", href: `mailto:${site.email}`, icon: "mail" },
  { label: "GitHub", href: "https://github.com/yourhandle", icon: "github" },
  { label: "X", href: "https://x.com/yourhandle", icon: "x" },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/yourhandle", icon: "linkedin" },
];

export const posts: Post[] = [
  {
    slug: "placeholder-post-one",
    title: "Placeholder Post One",
    date: "2026-11-01",
    summary: "A short placeholder summary for the first post.",
  },
  {
    slug: "placeholder-post-two",
    title: "Placeholder Post Two",
    date: "2026-10-12",
    summary: "A short placeholder summary for the second post.",
  },
  {
    slug: "placeholder-post-three",
    title: "Placeholder Post Three",
    date: "2026-09-23",
    summary: "A short placeholder summary for the third post.",
  },
  {
    slug: "placeholder-post-four",
    title: "Placeholder Post Four",
    date: "2026-08-04",
    summary: "A short placeholder summary for the fourth post.",
  },
  {
    slug: "placeholder-post-five",
    title: "Placeholder Post Five",
    date: "2026-06-18",
    summary: "A short placeholder summary for the fifth post.",
  },
  {
    slug: "placeholder-post-six",
    title: "Placeholder Post Six",
    date: "2026-04-29",
    summary: "A short placeholder summary for the sixth post.",
  },
  {
    slug: "placeholder-post-seven",
    title: "Placeholder Post Seven",
    date: "2026-02-11",
    summary: "A short placeholder summary for the seventh post.",
  },
  {
    slug: "placeholder-post-eight",
    title: "Placeholder Post Eight",
    date: "2025-12-01",
    summary: "A short placeholder summary for the eighth post.",
  },
];

export const misc: MiscItem[] = [
  {
    title: "Projects",
    note: "Open-source projects I maintain",
    href: "#",
  },
  {
    title: "Talks",
    note: "Conference talks and podcasts",
    href: "#",
  },
  {
    title: "Reading",
    note: "Books and articles worth sharing",
    href: "#",
  },
  {
    title: "Setup",
    note: "Tools and hardware I use",
    href: "#",
  },
  {
    title: "Now",
    note: "What I'm focused on right now",
    href: "#",
  },
];

export function formatDate(iso: string) {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  }).format(new Date(iso));
}
