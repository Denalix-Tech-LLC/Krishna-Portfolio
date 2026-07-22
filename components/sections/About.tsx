"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import {
  animate,
  motion,
  useInView,
} from "framer-motion";
import { useReducedMotionSafe } from "@/lib/useReducedMotionSafe";
import type { AboutContent, PersonalContent, StatItem } from "@/types/content";
import SectionHeading from "@/components/ui/SectionHeading";
import { fadeUp, staggerContainer, viewportOnce } from "@/lib/motion";

interface AboutProps {
  content: AboutContent;
  personal: PersonalContent;
}

/** "Krishna Reddy Kypu" → "KRK" — placeholder-portrait initials, max 3. */
function initialsOf(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .map((word) => word[0])
    .join("")
    .slice(0, 3)
    .toUpperCase();
}

/** Simple gear built from stroked circles — teeth faked with a dash pattern. */
function GearSvg({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 100 100"
      fill="none"
      className={className}
    >
      <circle
        cx="50"
        cy="50"
        r="38"
        stroke="currentColor"
        strokeWidth="11"
        strokeDasharray="8.5 7.5"
      />
      <circle cx="50" cy="50" r="26" stroke="currentColor" strokeWidth="2.5" />
      {[0, 60, 120].map((deg) => (
        <line
          key={deg}
          x1="24"
          y1="50"
          x2="76"
          y2="50"
          stroke="currentColor"
          strokeWidth="2.5"
          transform={`rotate(${deg} 50 50)`}
        />
      ))}
      <circle cx="50" cy="50" r="7" fill="currentColor" />
    </svg>
  );
}

/** Counts 0 → value once the element scrolls into view. Runs once. */
function StatCounter({ stat, index }: { stat: StatItem; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const prefersReducedMotion = useReducedMotionSafe();
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!inView) return;
    if (prefersReducedMotion) {
      setDisplay(stat.value);
      return;
    }
    const controls = animate(0, stat.value, {
      duration: 1.6,
      ease: "easeOut",
      onUpdate: (latest) => setDisplay(Math.round(latest)),
    });
    return () => controls.stop();
  }, [inView, prefersReducedMotion, stat.value]);

  const shown = prefersReducedMotion ? stat.value : display;
  const accent = index % 2 === 0 ? "text-ember-400" : "text-steel-300";

  return (
    <div ref={ref} className="metal-card px-4 py-6 text-center sm:px-6">
      <p className={`font-display text-4xl font-bold tabular-nums sm:text-5xl ${accent}`}>
        {shown}
        {stat.suffix}
      </p>
      <p className="mt-2 text-sm text-slate-400">{stat.label}</p>
    </div>
  );
}

/** About section: stylized portrait placeholder, bio, highlight chips, stat counters. */
export default function About({ content, personal }: AboutProps) {
  const prefersReducedMotion = useReducedMotionSafe();

  return (
    <section id="about" className="relative py-24 sm:py-32">
      <div className="section-shell">
        <div className="grid items-start gap-12 lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] lg:gap-16">
          {/* Photo (falls back to a stylized placeholder when about.photo is empty) */}
          <motion.div
            initial={prefersReducedMotion ? false : { opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={viewportOnce}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="mx-auto w-full max-w-sm lg:mx-0 lg:max-w-none"
          >
            <div className="metal-card relative aspect-[4/5] overflow-hidden">
              {content.photo ? (
                <>
                  {/* Blurred copy fills the frame; the photo itself stays uncropped and sharp. */}
                  <Image
                    src={content.photo}
                    alt=""
                    aria-hidden
                    fill
                    sizes="(min-width: 1024px) 40vw, (min-width: 640px) 384px, 100vw"
                    className="scale-110 object-cover opacity-40 blur-md"
                  />
                  <Image
                    src={content.photo}
                    alt={content.photoAlt}
                    fill
                    sizes="(min-width: 1024px) 40vw, (min-width: 640px) 384px, 100vw"
                    className="object-contain"
                  />
                  <div
                    aria-hidden="true"
                    className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-charcoal-950/60 to-transparent"
                  />
                </>
              ) : (
                <div
                  role="img"
                  aria-label={content.photoAlt}
                  className="absolute inset-0"
                >
                  <div
                    aria-hidden="true"
                    className="absolute inset-0 bg-grid-faint bg-[length:28px_28px]"
                  />
                  <div
                    aria-hidden="true"
                    className="absolute -right-10 -top-10 h-44 w-44 text-steel-500/40 motion-safe:animate-spin-slow"
                  >
                    <GearSvg className="h-full w-full" />
                  </div>
                  <div
                    aria-hidden="true"
                    className="absolute -bottom-14 -left-14 h-60 w-60 text-ember-500/25 motion-safe:animate-spin-slower"
                  >
                    <GearSvg className="h-full w-full" />
                  </div>
                  {/* Initials */}
                  <div
                    aria-hidden="true"
                    className="absolute inset-0 flex items-center justify-center"
                  >
                    <span className="rounded-full border border-white/10 bg-charcoal-950/60 px-10 py-16 font-display text-6xl font-bold tracking-tight text-white sm:text-7xl">
                      {initialsOf(personal.name)}
                    </span>
                  </div>
                  <div
                    aria-hidden="true"
                    className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-charcoal-950/80 to-transparent"
                  />
                </div>
              )}
            </div>
          </motion.div>

          {/* Bio + highlights */}
          <div>
            <SectionHeading eyebrow={content.eyebrow} heading={content.heading} />
            <motion.div
              variants={staggerContainer}
              initial={prefersReducedMotion ? false : "hidden"}
              whileInView="visible"
              viewport={viewportOnce}
              className="mt-8 space-y-5"
            >
              {content.bio.map((paragraph) => (
                <motion.p
                  key={paragraph.slice(0, 40)}
                  variants={fadeUp}
                  className="text-base leading-relaxed text-slate-300"
                >
                  {paragraph}
                </motion.p>
              ))}
            </motion.div>

            <motion.ul
              variants={staggerContainer}
              initial={prefersReducedMotion ? false : "hidden"}
              whileInView="visible"
              viewport={viewportOnce}
              className="mt-8 flex flex-wrap gap-2"
            >
              {content.highlights.map((highlight) => (
                <motion.li
                  key={highlight}
                  variants={fadeUp}
                  className="rounded-full border border-steel-500/30 bg-steel-500/10 px-3.5 py-1.5 text-xs font-medium text-steel-300"
                >
                  {highlight}
                </motion.li>
              ))}
            </motion.ul>
          </div>
        </div>

        {/* Stats row */}
        <div className="mt-16 grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
          {content.stats.map((stat, index) => (
            <StatCounter key={stat.label} stat={stat} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
