"use client";

import { motion } from "framer-motion";
import { useReducedMotionSafe } from "@/lib/useReducedMotionSafe";
import type {
  AchievementsContent,
  CertificationsContent,
  EducationContent,
} from "@/types/content";
import SectionHeading from "@/components/ui/SectionHeading";
import { fadeUp, staggerContainer, viewportOnce } from "@/lib/motion";

interface CredentialsProps {
  certifications: CertificationsContent;
  education: EducationContent;
  achievements: AchievementsContent;
}

function AwardIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-5 w-5"
    >
      <circle cx="12" cy="8" r="6" />
      <path d="M15.5 12.9 17 22l-5-3-5 3 1.5-9.1" />
    </svg>
  );
}

function StarIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="currentColor"
      className="mt-0.5 h-4 w-4 shrink-0"
    >
      <path d="m12 2 2.9 6.26 6.6.73-4.9 4.55 1.36 6.51L12 16.77 6.04 20.05 7.4 13.54 2.5 8.99l6.6-.73L12 2Z" />
    </svg>
  );
}

/**
 * Credentials section: certifications, education and achievements laid out
 * side by side on large screens with staggered fade-up reveals.
 */
export default function Credentials({
  certifications,
  education,
  achievements,
}: CredentialsProps) {
  const prefersReducedMotion = useReducedMotionSafe();
  const columnInitial = prefersReducedMotion ? false : "hidden";

  return (
    <section id="credentials" className="relative py-24 sm:py-32">
      <div className="section-shell">
        <SectionHeading
          eyebrow={certifications.eyebrow}
          heading={certifications.heading}
        />

        <div className="mt-14 grid gap-12 lg:grid-cols-3 lg:gap-10">
          {/* Certifications */}
          <motion.div
            variants={staggerContainer}
            initial={columnInitial}
            whileInView="visible"
            viewport={viewportOnce}
            className="space-y-4"
          >
            {certifications.items.map((cert) => (
              <motion.div
                key={cert.id}
                variants={fadeUp}
                className="metal-card flex items-start gap-4 p-5"
              >
                <span
                  aria-hidden="true"
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-steel-500/30 bg-steel-500/10 text-steel-300"
                >
                  <AwardIcon />
                </span>
                <span>
                  <span className="block font-semibold text-white">
                    {cert.name}
                  </span>
                  <span className="mt-1 block text-sm text-slate-400">
                    {cert.issuer}
                  </span>
                </span>
              </motion.div>
            ))}
          </motion.div>

          {/* Education */}
          <motion.div
            variants={staggerContainer}
            initial={columnInitial}
            whileInView="visible"
            viewport={viewportOnce}
          >
            <motion.h3
              variants={fadeUp}
              className="font-display text-xl font-bold text-white"
            >
              {education.heading}
            </motion.h3>
            <div className="mt-6 space-y-7">
              {education.items.map((item) => (
                <motion.div
                  key={item.id}
                  variants={fadeUp}
                  className="border-l-2 border-steel-500/40 pl-5"
                >
                  <p className="font-semibold text-white">{item.degree}</p>
                  <p className="mt-1 text-sm text-steel-300">
                    {item.institution}
                  </p>
                  <p className="mt-1 text-xs uppercase tracking-wider text-slate-400">
                    {item.period}
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-slate-400">
                    {item.detail}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Achievements */}
          <motion.div
            variants={staggerContainer}
            initial={columnInitial}
            whileInView="visible"
            viewport={viewportOnce}
          >
            <motion.h3
              variants={fadeUp}
              className="font-display text-xl font-bold text-white"
            >
              {achievements.heading}
            </motion.h3>
            <ul className="mt-6 space-y-4">
              {achievements.items.map((item) => (
                <motion.li
                  key={item}
                  variants={fadeUp}
                  className="flex items-start gap-3 text-sm leading-relaxed text-slate-300"
                >
                  <span aria-hidden="true" className="text-ember-400">
                    <StarIcon />
                  </span>
                  <span>{item}</span>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
