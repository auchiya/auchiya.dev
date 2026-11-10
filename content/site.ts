export type NavItem = {
  href: string;
  label: string;
};

export type SocialLink = {
  label: string;
  href: string;
  icon: "mail" | "github" | "x" | "linkedin";
};

export type Project = {
  slug: string;
  title: string;
  year: string;
  summary: string;
};

export type MiscItem = {
  title: string;
  note: string;
  href: string;
};

export const site = {
  name: "Agustin Uchiya",
  monogram: "AU",
  lastNameKanji: "打矢",
  nameKatakana: "アグスティン・打矢",
  role: "Full-Stack Engineer",
  location: "Barcelona, Spain",
  email: "you@auchiya.dev",
  description: "Personal site of Agustin Uchiya, a full-stack engineer.",
};

export const nav: NavItem[] = [
  { href: "/", label: "About" },
  { href: "/projects", label: "Projects" },
  { href: "/misc", label: "Misc" },
];

export const socials: SocialLink[] = [
  { label: "Email", href: `mailto:${site.email}`, icon: "mail" },
  { label: "GitHub", href: "https://github.com/yourhandle", icon: "github" },
  { label: "X", href: "https://x.com/yourhandle", icon: "x" },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/yourhandle", icon: "linkedin" },
];

export const projects: Project[] = [
  {
    slug: "placeholder-project-one",
    title: "Placeholder Project One",
    year: "2026",
    summary: "A short placeholder summary for the first project.",
  },
  {
    slug: "placeholder-project-two",
    title: "Placeholder Project Two",
    year: "2025",
    summary: "A short placeholder summary for the second project.",
  },
  {
    slug: "placeholder-project-three",
    title: "Placeholder Project Three",
    year: "2025",
    summary: "A short placeholder summary for the third project.",
  },
  {
    slug: "placeholder-project-four",
    title: "Placeholder Project Four",
    year: "2024",
    summary: "A short placeholder summary for the fourth project.",
  },
  {
    slug: "placeholder-project-five",
    title: "Placeholder Project Five",
    year: "2024",
    summary: "A short placeholder summary for the fifth project.",
  },
  {
    slug: "placeholder-project-six",
    title: "Placeholder Project Six",
    year: "2023",
    summary: "A short placeholder summary for the sixth project.",
  },
  {
    slug: "placeholder-project-seven",
    title: "Placeholder Project Seven",
    year: "2023",
    summary: "A short placeholder summary for the seventh project.",
  },
  {
    slug: "placeholder-project-eight",
    title: "Placeholder Project Eight",
    year: "2022",
    summary: "A short placeholder summary for the eighth project.",
  },
];

export const misc: MiscItem[] = [
  {
    title: "Open Source",
    note: "Libraries and tools I maintain",
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
