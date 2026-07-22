"use client";

import type { ReactElement } from "react";
import { motion } from "framer-motion";
import { useReducedMotionSafe } from "@/lib/useReducedMotionSafe";
import type { SkillGroup, SkillItem, SkillsContent } from "@/types/content";
import SectionHeading from "@/components/ui/SectionHeading";
import { fadeUp, staggerContainer, viewportOnce } from "@/lib/motion";

interface SkillsProps {
  content: SkillsContent;
}

const iconProps = {
  "aria-hidden": true,
  viewBox: "0 0 20 20",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.5,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  className: "h-5 w-5",
} as const;

/** Generic engineering icons assigned to groups by index. */
const GROUP_ICONS: ReactElement[] = [
  // Pencil / ruler (design)
  <svg key="design" {...iconProps}>
    <path d="M3 17l10.5-10.5a1.5 1.5 0 0 1 2.12 0l.88.88a1.5 1.5 0 0 1 0 2.12L6 20H3v-3Z" />
    <path d="M12 8l1.5 1.5" />
  </svg>,
  // Pulse / waveform (analysis)
  <svg key="analysis" {...iconProps}>
    <path d="M2 10h3l2.5-6 4 12L14 10h4" />
  </svg>,
  // Gear (manufacturing)
  <svg key="manufacturing" {...iconProps}>
    <circle cx="10" cy="10" r="3" />
    <path d="M10 2.5v2M10 15.5v2M2.5 10h2M15.5 10h2M4.7 4.7l1.4 1.4M13.9 13.9l1.4 1.4M15.3 4.7l-1.4 1.4M6.1 13.9l-1.4 1.4" />
  </svg>,
  // Document (PLM & documentation)
  <svg key="plm" {...iconProps}>
    <path d="M5 2.5h7l3 3v12H5v-15Z" />
    <path d="M12 2.5v3h3M8 10h4M8 13h4" />
  </svg>,
  // People (management)
  <svg key="management" {...iconProps}>
    <circle cx="7" cy="7" r="2.5" />
    <path d="M2.5 16a4.5 4.5 0 0 1 9 0" />
    <circle cx="14.5" cy="8" r="2" />
    <path d="M13 12.5a3.75 3.75 0 0 1 4.5 3.5" />
  </svg>,
];

function SkillBar({ skill, index }: { skill: SkillItem; index: number }) {
  const prefersReducedMotion = useReducedMotionSafe();

  return (
    <li>
      <div className="flex items-baseline justify-between gap-4">
        <span className="text-sm leading-snug text-slate-300">
          {skill.name}
        </span>
        <span className="text-xs tabular-nums text-slate-400">
          {skill.level}%
        </span>
      </div>
      <div
        role="progressbar"
        aria-label={skill.name}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={skill.level}
        className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/5"
      >
        {prefersReducedMotion ? (
          <div
            className="h-full rounded-full bg-gradient-to-r from-steel-500 to-ember-500"
            style={{ width: `${skill.level}%` }}
          />
        ) : (
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-steel-500 to-ember-500"
            initial={{ width: 0 }}
            whileInView={{ width: `${skill.level}%` }}
            viewport={viewportOnce}
            transition={{
              duration: 1,
              ease: "easeOut",
              delay: 0.15 + index * 0.08,
            }}
          />
        )}
      </div>
    </li>
  );
}

function GroupCard({ group, index }: { group: SkillGroup; index: number }) {
  const icon = GROUP_ICONS[index % GROUP_ICONS.length];

  return (
    <motion.article variants={fadeUp} className="metal-card p-6 sm:p-7">
      <header>
        <div className="flex items-center gap-3">
          <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-steel-500/25 bg-steel-500/10 text-steel-300">
            {icon}
          </span>
          <h3 className="font-display text-lg font-bold text-white">
            {group.name}
          </h3>
        </div>
        <div
          aria-hidden="true"
          className="mt-4 h-px w-14 bg-gradient-to-r from-steel-500 to-ember-500"
        />
      </header>

      <ul className="mt-6 space-y-5">
        {group.skills.map((skill, skillIndex) => (
          <SkillBar key={skill.name} skill={skill} index={skillIndex} />
        ))}
      </ul>
    </motion.article>
  );
}

/** Skill groups rendered as a card grid with animated proficiency bars. */
export default function Skills({ content }: SkillsProps) {
  const prefersReducedMotion = useReducedMotionSafe();

  return (
    <section id="skills" className="relative py-24 sm:py-32">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-grid-faint bg-[length:44px_44px] [mask-image:radial-gradient(ellipse_at_center,black_35%,transparent_75%)]"
      />
      <div className="section-shell relative">
        <SectionHeading
          eyebrow={content.eyebrow}
          heading={content.heading}
          subheading={content.subheading}
        />

        <motion.div
          variants={staggerContainer}
          initial={prefersReducedMotion ? false : "hidden"}
          whileInView="visible"
          viewport={viewportOnce}
          className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-3"
        >
          {content.groups.map((group, index) => (
            <GroupCard key={group.id} group={group} index={index} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
