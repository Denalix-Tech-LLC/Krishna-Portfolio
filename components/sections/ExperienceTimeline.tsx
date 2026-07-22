"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useReducedMotionSafe } from "@/lib/useReducedMotionSafe";
import type { ExperienceContent, ExperienceItem } from "@/types/content";
import SectionHeading from "@/components/ui/SectionHeading";
import { viewportOnce } from "@/lib/motion";

interface ExperienceTimelineProps {
  content: ExperienceContent;
}

/** Tiny wrench bullet for highlight lists. */
function BulletIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="mt-1 h-3.5 w-3.5 shrink-0 text-ember-400"
    >
      <path d="M2.5 8h7M9.5 8l3-3M9.5 8l3 3" />
      <circle cx="2.5" cy="8" r="1.25" fill="currentColor" stroke="none" />
    </svg>
  );
}

/** Tracks the lg breakpoint so desktop items can slide in from alternating sides. */
function useIsDesktop() {
  const [isDesktop, setIsDesktop] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const update = () => setIsDesktop(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);
  return isDesktop;
}

function TimelineCard({ item, index }: { item: ExperienceItem; index: number }) {
  const prefersReducedMotion = useReducedMotionSafe();
  const isDesktop = useIsDesktop();

  const hidden = isDesktop
    ? { opacity: 0, x: index % 2 === 0 ? -48 : 48, y: 0 }
    : { opacity: 0, x: 0, y: 28 };

  const dotAccent =
    index % 2 === 0
      ? "bg-ember-400 shadow-[0_0_14px_rgba(224,122,63,0.85)]"
      : "bg-steel-400 shadow-[0_0_14px_rgba(119,163,201,0.85)]";

  return (
    <li className="relative pl-10 sm:pl-16">
      {/* Glowing dot on the timeline */}
      <span
        aria-hidden="true"
        className={`absolute left-3 top-8 h-3.5 w-3.5 -translate-x-1/2 rounded-full border-2 border-charcoal-950 ${dotAccent}`}
      />
      {/* Keyed by breakpoint so `initial` re-applies when the media query resolves after mount. */}
      <motion.article
        key={isDesktop ? "desktop" : "mobile"}
        initial={prefersReducedMotion ? false : hidden}
        whileInView={{ opacity: 1, x: 0, y: 0 }}
        viewport={viewportOnce}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="metal-card p-6 sm:p-8"
      >
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="font-mono text-xs font-semibold uppercase tracking-widest text-ember-400">
            {item.period}
          </p>
          <span className="rounded-full border border-steel-500/30 bg-steel-500/10 px-3 py-1 text-[11px] font-medium text-steel-300">
            {item.industry}
          </span>
        </div>

        <h3 className="mt-3 font-display text-xl font-bold text-white sm:text-2xl">
          {item.role}
        </h3>
        <p className="mt-1 text-sm font-medium text-steel-300">
          {item.company}
          <span aria-hidden="true" className="mx-2 text-slate-500">
            /
          </span>
          <span className="text-slate-400">{item.location}</span>
        </p>

        <p className="mt-4 text-sm leading-relaxed text-slate-300">
          {item.summary}
        </p>

        <ul className="mt-4 space-y-2">
          {item.highlights.map((highlight) => (
            <li
              key={highlight}
              className="flex items-start gap-2.5 text-sm leading-relaxed text-slate-400"
            >
              <BulletIcon />
              <span>{highlight}</span>
            </li>
          ))}
        </ul>

        <ul className="mt-5 flex flex-wrap gap-1.5">
          {item.tools.map((tool) => (
            <li
              key={tool}
              className="rounded border border-white/10 bg-white/5 px-2 py-0.5 text-[11px] text-slate-400"
            >
              {tool}
            </li>
          ))}
        </ul>
      </motion.article>
    </li>
  );
}

/** Vertical career timeline with a glowing steel→ember spine. */
export default function ExperienceTimeline({
  content,
}: ExperienceTimelineProps) {
  return (
    <section
      id="experience"
      className="relative bg-charcoal-900/50 py-24 sm:py-32"
    >
      <div className="section-shell">
        <SectionHeading
          eyebrow={content.eyebrow}
          heading={content.heading}
          subheading={content.subheading}
        />

        <div className="relative mt-16">
          {/* Gradient spine */}
          <div
            aria-hidden="true"
            className="absolute bottom-2 left-3 top-2 w-px bg-gradient-to-b from-steel-400 via-steel-600 to-ember-500"
          />
          <ol className="space-y-10 sm:space-y-12">
            {content.items.map((item, index) => (
              <TimelineCard key={item.id} item={item} index={index} />
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
