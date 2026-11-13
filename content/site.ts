export type NavItem = {
  href: string;
  label: string;
  /** Key pressed after `g` to navigate here. */
  shortcut: string;
};

export type SocialLink = {
  label: string;
  href: string;
  icon: "mail" | "github" | "x" | "linkedin";
};

export const site = {
  url: "https://auchiya.dev",
  name: "Agustin Uchiya",
  lastNameKanji: "打矢",
  nameKatakana: "アグスティン・ウチヤ",
  /** Japanese-order display name: surname in kanji, given name in katakana. */
  nameJapanese: "打矢 アグスティン",
  role: "Full-Stack Engineer",
  location: "Barcelona, Spain",
  email: "you@auchiya.dev",
  description: "Personal site of Agustin Uchiya, a full-stack engineer.",
};

export const nav: NavItem[] = [
  { href: "/", label: "About", shortcut: "a" },
  { href: "/projects", label: "Projects", shortcut: "p" },
  { href: "/misc", label: "Misc", shortcut: "m" },
];

export const socials: SocialLink[] = [
  // { label: "Email", href: `mailto:${site.email}`, icon: "mail" },
  { label: "GitHub", href: "https://github.com/auchiya", icon: "github" },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/agustin-uchiya", icon: "linkedin" },
];
