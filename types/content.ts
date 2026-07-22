/**
 * Type definitions for content/site-content.json — the single source of truth
 * for every piece of text on the site. Components receive these types as
 * props and never hardcode copy.
 */

export interface SiteMeta {
  siteTitle: string;
  description: string;
  keywords: string[];
  siteUrl: string;
  ogTitle: string;
  ogDescription: string;
}

export interface NavLink {
  label: string;
  href: string;
}

export interface NavContent {
  logoText: string;
  logoAccent: string;
  resumeLabel: string;
  links: NavLink[];
}

export interface PersonalContent {
  name: string;
  title: string;
  subtitle: string;
  location: string;
  email: string;
  phone: string;
  linkedin: string;
  resumeUrl: string;
}

export interface HeroContent {
  greeting: string;
  headlineLead: string;
  headlineAccent: string;
  intro: string;
  ctaPrimary: string;
  ctaSecondary: string;
  badges: string[];
  scrollHint: string;
}

export interface StatItem {
  value: number;
  suffix: string;
  label: string;
}

export interface AboutContent {
  eyebrow: string;
  heading: string;
  bio: string[];
  /** Path to a portrait in public/ (e.g. "/krishna-photo.jpg"); "" shows the stylized placeholder. */
  photo: string;
  photoAlt: string;
  stats: StatItem[];
  highlights: string[];
}

export interface ExperienceItem {
  id: string;
  role: string;
  company: string;
  location: string;
  period: string;
  industry: string;
  summary: string;
  highlights: string[];
  tools: string[];
}

export interface ExperienceContent {
  eyebrow: string;
  heading: string;
  subheading: string;
  items: ExperienceItem[];
}

export interface ProjectItem {
  id: string;
  title: string;
  subtitle: string;
  company: string;
  description: string;
  details: string[];
  tools: string[];
  tags: string[];
  image: string;
  imageAlt: string;
}

export interface ProjectsContent {
  eyebrow: string;
  heading: string;
  subheading: string;
  cardCtaLabel: string;
  modalDetailsLabel: string;
  modalToolsLabel: string;
  items: ProjectItem[];
}

export interface SkillItem {
  name: string;
  level: number; // 0-100 proficiency
}

export interface SkillGroup {
  id: string;
  name: string;
  skills: SkillItem[];
}

export interface SkillsContent {
  eyebrow: string;
  heading: string;
  subheading: string;
  groups: SkillGroup[];
}

export interface CertificationItem {
  id: string;
  name: string;
  issuer: string;
}

export interface CertificationsContent {
  eyebrow: string;
  heading: string;
  items: CertificationItem[];
}

export interface EducationItem {
  id: string;
  degree: string;
  institution: string;
  period: string;
  detail: string;
}

export interface EducationContent {
  heading: string;
  items: EducationItem[];
}

export interface AchievementsContent {
  heading: string;
  items: string[];
}

export interface ContactContent {
  eyebrow: string;
  heading: string;
  subheading: string;
  intro: string;
  emailLabel: string;
  linkedinLabel: string;
  phoneLabel: string;
}

export interface FooterContent {
  text: string;
  builtWith: string;
}

export interface SiteContent {
  meta: SiteMeta;
  nav: NavContent;
  personal: PersonalContent;
  hero: HeroContent;
  about: AboutContent;
  experience: ExperienceContent;
  projects: ProjectsContent;
  skills: SkillsContent;
  certifications: CertificationsContent;
  education: EducationContent;
  achievements: AchievementsContent;
  contact: ContactContent;
  footer: FooterContent;
}
