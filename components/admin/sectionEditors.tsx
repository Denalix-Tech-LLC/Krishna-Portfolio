"use client";

import type { ReactNode } from "react";
import type {
  AboutContent,
  AchievementsContent,
  CertificationItem,
  CertificationsContent,
  ContactContent,
  EducationItem,
  EducationContent,
  ExperienceContent,
  ExperienceItem,
  FooterContent,
  HeroContent,
  NavContent,
  NavLink,
  PersonalContent,
  ProjectItem,
  ProjectsContent,
  SiteContent,
  SiteMeta,
  SkillGroup,
  SkillItem,
  SkillsContent,
  StatItem,
} from "@/types/content";
import {
  ArrayEditor,
  NumberField,
  StringListEditor,
  TextAreaField,
  TextField,
} from "@/components/admin/fields";

/**
 * Per-tab section editors for the /admin content editor. Each editor is
 * fully typed against types/content.ts and reports a complete new
 * SiteContent object upward via `onChange`.
 *
 * IMPORTANT: the JSON file carries underscore-prefixed documentation keys
 * (_README, _comment, ...) that are NOT part of the TypeScript types. Every
 * update below therefore spreads the existing object ({ ...obj, field })
 * so those unknown keys are preserved on save — never rebuild an object
 * from scratch.
 */

export interface SectionEditorProps {
  content: SiteContent;
  onChange: (next: SiteContent) => void;
}

/** Random-suffix id for newly added items (ids just need to be unique-ish). */
function newId(prefix: string): string {
  return `${prefix}-${Math.random().toString(36).slice(2, 8)}`;
}

/** Titled panel grouping a set of related fields. */
function Panel({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="metal-card p-5 sm:p-6">
      <h2 className="flex items-center gap-2 font-display text-sm font-semibold uppercase tracking-[0.2em] text-steel-300">
        <span aria-hidden className="h-px w-6 bg-steel-500" />
        {title}
      </h2>
      <div className="mt-5 space-y-4">{children}</div>
    </section>
  );
}

/** Two-column grid for short fields. */
function Grid2({ children }: { children: ReactNode }) {
  return <div className="grid gap-4 sm:grid-cols-2">{children}</div>;
}

/* ================================================================== */
/* Personal & Meta & Nav                                              */
/* ================================================================== */

export function PersonalMetaNavEditor({ content, onChange }: SectionEditorProps) {
  const { personal, meta, nav } = content;
  const setPersonal = (patch: Partial<PersonalContent>) =>
    onChange({ ...content, personal: { ...personal, ...patch } });
  const setMeta = (patch: Partial<SiteMeta>) =>
    onChange({ ...content, meta: { ...meta, ...patch } });
  const setNav = (patch: Partial<NavContent>) =>
    onChange({ ...content, nav: { ...nav, ...patch } });

  return (
    <div className="space-y-6">
      <Panel title="Personal">
        <Grid2>
          <TextField label="Full name" value={personal.name} onChange={(v) => setPersonal({ name: v })} />
          <TextField label="Title" value={personal.title} onChange={(v) => setPersonal({ title: v })} />
          <TextField label="Subtitle" value={personal.subtitle} onChange={(v) => setPersonal({ subtitle: v })} />
          <TextField label="Location" value={personal.location} onChange={(v) => setPersonal({ location: v })} />
          <TextField label="Email" type="email" value={personal.email} onChange={(v) => setPersonal({ email: v })} />
          <TextField label="Phone" type="tel" value={personal.phone} onChange={(v) => setPersonal({ phone: v })} />
          <TextField label="LinkedIn URL" type="url" value={personal.linkedin} onChange={(v) => setPersonal({ linkedin: v })} />
          <TextField label="Resume URL" value={personal.resumeUrl} onChange={(v) => setPersonal({ resumeUrl: v })} />
        </Grid2>
      </Panel>

      <Panel title="Meta / SEO">
        <TextField label="Site title (browser tab)" value={meta.siteTitle} onChange={(v) => setMeta({ siteTitle: v })} />
        <TextAreaField label="Description" value={meta.description} onChange={(v) => setMeta({ description: v })} />
        <StringListEditor label="Keywords" items={meta.keywords} onChange={(keywords) => setMeta({ keywords })} addLabel="Add keyword" />
        <Grid2>
          <TextField label="Site URL" type="url" value={meta.siteUrl} onChange={(v) => setMeta({ siteUrl: v })} />
          <TextField label="Open Graph title" value={meta.ogTitle} onChange={(v) => setMeta({ ogTitle: v })} />
        </Grid2>
        <TextAreaField label="Open Graph description" value={meta.ogDescription} onChange={(v) => setMeta({ ogDescription: v })} />
      </Panel>

      <Panel title="Navigation">
        <Grid2>
          <TextField label="Logo text" value={nav.logoText} onChange={(v) => setNav({ logoText: v })} />
          <TextField label="Logo accent" value={nav.logoAccent} onChange={(v) => setNav({ logoAccent: v })} />
          <TextField label="Resume button label" value={nav.resumeLabel} onChange={(v) => setNav({ resumeLabel: v })} />
        </Grid2>
        <ArrayEditor<NavLink>
          label="Nav links"
          items={nav.links}
          onChange={(links) => setNav({ links })}
          makeItem={() => ({ label: "", href: "#" })}
          itemTitle={(link) => link.label}
          addLabel="Add link"
        >
          {(link, _i, update) => (
            <Grid2>
              <TextField label="Label" value={link.label} onChange={(v) => update({ ...link, label: v })} />
              <TextField label="Href (e.g. #about)" value={link.href} onChange={(v) => update({ ...link, href: v })} />
            </Grid2>
          )}
        </ArrayEditor>
      </Panel>
    </div>
  );
}

/* ================================================================== */
/* Hero                                                               */
/* ================================================================== */

export function HeroEditor({ content, onChange }: SectionEditorProps) {
  const hero = content.hero;
  const set = (patch: Partial<HeroContent>) =>
    onChange({ ...content, hero: { ...hero, ...patch } });

  return (
    <div className="space-y-6">
      <Panel title="Hero">
        <Grid2>
          <TextField label="Greeting" value={hero.greeting} onChange={(v) => set({ greeting: v })} />
          <TextField label="Scroll hint" value={hero.scrollHint} onChange={(v) => set({ scrollHint: v })} />
          <TextField label="Headline lead" value={hero.headlineLead} onChange={(v) => set({ headlineLead: v })} />
          <TextField label="Headline accent (orange)" value={hero.headlineAccent} onChange={(v) => set({ headlineAccent: v })} />
        </Grid2>
        <TextAreaField label="Intro paragraph" value={hero.intro} onChange={(v) => set({ intro: v })} />
        <Grid2>
          <TextField label="Primary CTA" value={hero.ctaPrimary} onChange={(v) => set({ ctaPrimary: v })} />
          <TextField label="Secondary CTA" value={hero.ctaSecondary} onChange={(v) => set({ ctaSecondary: v })} />
        </Grid2>
        <StringListEditor label="Badges" items={hero.badges} onChange={(badges) => set({ badges })} addLabel="Add badge" />
      </Panel>
    </div>
  );
}

/* ================================================================== */
/* About                                                              */
/* ================================================================== */

export function AboutEditor({ content, onChange }: SectionEditorProps) {
  const about = content.about;
  const set = (patch: Partial<AboutContent>) =>
    onChange({ ...content, about: { ...about, ...patch } });

  return (
    <div className="space-y-6">
      <Panel title="About">
        <Grid2>
          <TextField label="Eyebrow" value={about.eyebrow} onChange={(v) => set({ eyebrow: v })} />
          <TextField label="Heading" value={about.heading} onChange={(v) => set({ heading: v })} />
        </Grid2>
        <StringListEditor label="Bio paragraphs" items={about.bio} onChange={(bio) => set({ bio })} multiline addLabel="Add paragraph" />
        <Grid2>
          <TextField label="Photo path (in public/, empty = placeholder)" value={about.photo} onChange={(v) => set({ photo: v })} />
          <TextField label="Photo alt text" value={about.photoAlt} onChange={(v) => set({ photoAlt: v })} />
        </Grid2>
        <StringListEditor label="Highlight chips" items={about.highlights} onChange={(highlights) => set({ highlights })} addLabel="Add highlight" />
      </Panel>

      <Panel title="Stat counters">
        <ArrayEditor<StatItem>
          label="Stats"
          items={about.stats}
          onChange={(stats) => set({ stats })}
          makeItem={() => ({ value: 0, suffix: "", label: "" })}
          itemTitle={(stat) => (stat.label ? `${stat.value}${stat.suffix} — ${stat.label}` : "")}
          addLabel="Add stat"
        >
          {(stat, _i, update) => (
            <div className="grid gap-4 sm:grid-cols-3">
              <NumberField label="Value" value={stat.value} onChange={(v) => update({ ...stat, value: v })} />
              <TextField label="Suffix (e.g. +)" value={stat.suffix} onChange={(v) => update({ ...stat, suffix: v })} />
              <TextField label="Label" value={stat.label} onChange={(v) => update({ ...stat, label: v })} />
            </div>
          )}
        </ArrayEditor>
      </Panel>
    </div>
  );
}

/* ================================================================== */
/* Experience                                                         */
/* ================================================================== */

export function ExperienceEditor({ content, onChange }: SectionEditorProps) {
  const experience = content.experience;
  const set = (patch: Partial<ExperienceContent>) =>
    onChange({ ...content, experience: { ...experience, ...patch } });

  return (
    <div className="space-y-6">
      <Panel title="Section header">
        <Grid2>
          <TextField label="Eyebrow" value={experience.eyebrow} onChange={(v) => set({ eyebrow: v })} />
          <TextField label="Heading" value={experience.heading} onChange={(v) => set({ heading: v })} />
        </Grid2>
        <TextAreaField label="Subheading" value={experience.subheading} onChange={(v) => set({ subheading: v })} rows={2} />
      </Panel>

      <Panel title="Timeline">
        <ArrayEditor<ExperienceItem>
          label="Experience items"
          items={experience.items}
          onChange={(items) => set({ items })}
          makeItem={() => ({
            id: newId("job"),
            role: "",
            company: "",
            location: "",
            period: "",
            industry: "",
            summary: "",
            highlights: [],
            tools: [],
          })}
          itemTitle={(item) => [item.role, item.company].filter(Boolean).join(" — ")}
          addLabel="Add experience"
        >
          {(item, _i, update) => (
            <>
              <Grid2>
                <TextField label="Id (unique slug)" value={item.id} onChange={(v) => update({ ...item, id: v })} />
                <TextField label="Role" value={item.role} onChange={(v) => update({ ...item, role: v })} />
                <TextField label="Company" value={item.company} onChange={(v) => update({ ...item, company: v })} />
                <TextField label="Location" value={item.location} onChange={(v) => update({ ...item, location: v })} />
                <TextField label="Period" value={item.period} onChange={(v) => update({ ...item, period: v })} />
                <TextField label="Industry" value={item.industry} onChange={(v) => update({ ...item, industry: v })} />
              </Grid2>
              <TextAreaField label="Summary" value={item.summary} onChange={(v) => update({ ...item, summary: v })} rows={2} />
              <StringListEditor label="Highlights" items={item.highlights} onChange={(highlights) => update({ ...item, highlights })} multiline addLabel="Add highlight" />
              <StringListEditor label="Tools" items={item.tools} onChange={(tools) => update({ ...item, tools })} addLabel="Add tool" />
            </>
          )}
        </ArrayEditor>
      </Panel>
    </div>
  );
}

/* ================================================================== */
/* Projects                                                           */
/* ================================================================== */

export function ProjectsEditor({ content, onChange }: SectionEditorProps) {
  const projects = content.projects;
  const set = (patch: Partial<ProjectsContent>) =>
    onChange({ ...content, projects: { ...projects, ...patch } });

  return (
    <div className="space-y-6">
      <Panel title="Section header">
        <Grid2>
          <TextField label="Eyebrow" value={projects.eyebrow} onChange={(v) => set({ eyebrow: v })} />
          <TextField label="Heading" value={projects.heading} onChange={(v) => set({ heading: v })} />
        </Grid2>
        <TextAreaField label="Subheading" value={projects.subheading} onChange={(v) => set({ subheading: v })} rows={2} />
        <Grid2>
          <TextField label="Card button label" value={projects.cardCtaLabel} onChange={(v) => set({ cardCtaLabel: v })} />
          <TextField label="Modal details label" value={projects.modalDetailsLabel} onChange={(v) => set({ modalDetailsLabel: v })} />
          <TextField label="Modal tools label" value={projects.modalToolsLabel} onChange={(v) => set({ modalToolsLabel: v })} />
        </Grid2>
      </Panel>

      <Panel title="Project cards">
        <ArrayEditor<ProjectItem>
          label="Projects"
          items={projects.items}
          onChange={(items) => set({ items })}
          makeItem={() => ({
            id: newId("project"),
            title: "",
            subtitle: "",
            company: "",
            description: "",
            details: [],
            tools: [],
            tags: [],
            image: "",
            imageAlt: "",
          })}
          itemTitle={(item) => item.title}
          addLabel="Add project"
        >
          {(item, _i, update) => (
            <>
              <Grid2>
                <TextField label="Id (unique slug)" value={item.id} onChange={(v) => update({ ...item, id: v })} />
                <TextField label="Title" value={item.title} onChange={(v) => update({ ...item, title: v })} />
                <TextField label="Subtitle" value={item.subtitle} onChange={(v) => update({ ...item, subtitle: v })} />
                <TextField label="Company" value={item.company} onChange={(v) => update({ ...item, company: v })} />
              </Grid2>
              <TextAreaField label="Description" value={item.description} onChange={(v) => update({ ...item, description: v })} />
              <StringListEditor label="Detail bullets" items={item.details} onChange={(details) => update({ ...item, details })} multiline addLabel="Add detail" />
              <StringListEditor label="Tools" items={item.tools} onChange={(tools) => update({ ...item, tools })} addLabel="Add tool" />
              <StringListEditor label="Tags" items={item.tags} onChange={(tags) => update({ ...item, tags })} addLabel="Add tag" />
              <Grid2>
                <TextField label="Image path (empty = placeholder)" value={item.image} onChange={(v) => update({ ...item, image: v })} placeholder="/projects/my-image.jpg" />
                <TextField label="Image alt text" value={item.imageAlt} onChange={(v) => update({ ...item, imageAlt: v })} />
              </Grid2>
            </>
          )}
        </ArrayEditor>
      </Panel>
    </div>
  );
}

/* ================================================================== */
/* Skills                                                             */
/* ================================================================== */

export function SkillsEditor({ content, onChange }: SectionEditorProps) {
  const skills = content.skills;
  const set = (patch: Partial<SkillsContent>) =>
    onChange({ ...content, skills: { ...skills, ...patch } });

  return (
    <div className="space-y-6">
      <Panel title="Section header">
        <Grid2>
          <TextField label="Eyebrow" value={skills.eyebrow} onChange={(v) => set({ eyebrow: v })} />
          <TextField label="Heading" value={skills.heading} onChange={(v) => set({ heading: v })} />
        </Grid2>
        <TextAreaField label="Subheading" value={skills.subheading} onChange={(v) => set({ subheading: v })} rows={2} />
      </Panel>

      <Panel title="Skill groups">
        <ArrayEditor<SkillGroup>
          label="Groups"
          items={skills.groups}
          onChange={(groups) => set({ groups })}
          makeItem={() => ({ id: newId("group"), name: "", skills: [] })}
          itemTitle={(group) => group.name}
          addLabel="Add group"
        >
          {(group, _i, update) => (
            <>
              <Grid2>
                <TextField label="Id (unique slug)" value={group.id} onChange={(v) => update({ ...group, id: v })} />
                <TextField label="Group name" value={group.name} onChange={(v) => update({ ...group, name: v })} />
              </Grid2>
              <ArrayEditor<SkillItem>
                label="Skills"
                items={group.skills}
                onChange={(list) => update({ ...group, skills: list })}
                makeItem={() => ({ name: "", level: 80 })}
                itemTitle={(skill) => (skill.name ? `${skill.name} (${skill.level})` : "")}
                addLabel="Add skill"
              >
                {(skill, _j, updateSkill) => (
                  <Grid2>
                    <TextField label="Skill name" value={skill.name} onChange={(v) => updateSkill({ ...skill, name: v })} />
                    <NumberField label="Level (0-100)" value={skill.level} min={0} max={100} onChange={(v) => updateSkill({ ...skill, level: Math.min(100, Math.max(0, v)) })} />
                  </Grid2>
                )}
              </ArrayEditor>
            </>
          )}
        </ArrayEditor>
      </Panel>
    </div>
  );
}

/* ================================================================== */
/* Credentials (certifications + education + achievements)            */
/* ================================================================== */

export function CredentialsEditor({ content, onChange }: SectionEditorProps) {
  const { certifications, education, achievements } = content;
  const setCertifications = (patch: Partial<CertificationsContent>) =>
    onChange({ ...content, certifications: { ...certifications, ...patch } });
  const setEducation = (patch: Partial<EducationContent>) =>
    onChange({ ...content, education: { ...education, ...patch } });
  const setAchievements = (patch: Partial<AchievementsContent>) =>
    onChange({ ...content, achievements: { ...achievements, ...patch } });

  return (
    <div className="space-y-6">
      <Panel title="Certifications">
        <Grid2>
          <TextField label="Eyebrow" value={certifications.eyebrow} onChange={(v) => setCertifications({ eyebrow: v })} />
          <TextField label="Heading" value={certifications.heading} onChange={(v) => setCertifications({ heading: v })} />
        </Grid2>
        <ArrayEditor<CertificationItem>
          label="Certifications"
          items={certifications.items}
          onChange={(items) => setCertifications({ items })}
          makeItem={() => ({ id: newId("cert"), name: "", issuer: "" })}
          itemTitle={(item) => item.name}
          addLabel="Add certification"
        >
          {(item, _i, update) => (
            <>
              <TextField label="Id (unique slug)" value={item.id} onChange={(v) => update({ ...item, id: v })} />
              <Grid2>
                <TextField label="Name" value={item.name} onChange={(v) => update({ ...item, name: v })} />
                <TextField label="Issuer" value={item.issuer} onChange={(v) => update({ ...item, issuer: v })} />
              </Grid2>
            </>
          )}
        </ArrayEditor>
      </Panel>

      <Panel title="Education">
        <TextField label="Heading" value={education.heading} onChange={(v) => setEducation({ heading: v })} />
        <ArrayEditor<EducationItem>
          label="Education items"
          items={education.items}
          onChange={(items) => setEducation({ items })}
          makeItem={() => ({ id: newId("edu"), degree: "", institution: "", period: "", detail: "" })}
          itemTitle={(item) => item.degree}
          addLabel="Add education"
        >
          {(item, _i, update) => (
            <>
              <Grid2>
                <TextField label="Id (unique slug)" value={item.id} onChange={(v) => update({ ...item, id: v })} />
                <TextField label="Degree" value={item.degree} onChange={(v) => update({ ...item, degree: v })} />
                <TextField label="Institution" value={item.institution} onChange={(v) => update({ ...item, institution: v })} />
                <TextField label="Period" value={item.period} onChange={(v) => update({ ...item, period: v })} />
              </Grid2>
              <TextAreaField label="Detail" value={item.detail} onChange={(v) => update({ ...item, detail: v })} rows={2} />
            </>
          )}
        </ArrayEditor>
      </Panel>

      <Panel title="Achievements">
        <TextField label="Heading" value={achievements.heading} onChange={(v) => setAchievements({ heading: v })} />
        <StringListEditor label="Achievements" items={achievements.items} onChange={(items) => setAchievements({ items })} multiline addLabel="Add achievement" />
      </Panel>
    </div>
  );
}

/* ================================================================== */
/* Contact & Footer                                                   */
/* ================================================================== */

export function ContactFooterEditor({ content, onChange }: SectionEditorProps) {
  const { contact, footer } = content;
  const setContact = (patch: Partial<ContactContent>) =>
    onChange({ ...content, contact: { ...contact, ...patch } });
  const setFooter = (patch: Partial<FooterContent>) =>
    onChange({ ...content, footer: { ...footer, ...patch } });

  return (
    <div className="space-y-6">
      <Panel title="Contact section">
        <Grid2>
          <TextField label="Eyebrow" value={contact.eyebrow} onChange={(v) => setContact({ eyebrow: v })} />
          <TextField label="Heading" value={contact.heading} onChange={(v) => setContact({ heading: v })} />
        </Grid2>
        <TextAreaField label="Subheading" value={contact.subheading} onChange={(v) => setContact({ subheading: v })} rows={2} />
        <TextAreaField label="Intro" value={contact.intro} onChange={(v) => setContact({ intro: v })} rows={2} />
        <Grid2>
          <TextField label="Email label" value={contact.emailLabel} onChange={(v) => setContact({ emailLabel: v })} />
          <TextField label="LinkedIn label" value={contact.linkedinLabel} onChange={(v) => setContact({ linkedinLabel: v })} />
          <TextField label="Phone label" value={contact.phoneLabel} onChange={(v) => setContact({ phoneLabel: v })} />
        </Grid2>
      </Panel>

      <Panel title="Footer">
        <TextField label="Footer text" value={footer.text} onChange={(v) => setFooter({ text: v })} />
        <TextField label="Built-with line" value={footer.builtWith} onChange={(v) => setFooter({ builtWith: v })} />
      </Panel>
    </div>
  );
}
