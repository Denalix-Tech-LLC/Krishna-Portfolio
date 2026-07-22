"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { useReducedMotionSafe } from "@/lib/useReducedMotionSafe";
import type { HeroContent, PersonalContent } from "@/types/content";
import HeroFallback from "@/components/3d/HeroFallback";
import { fadeUp, staggerContainer } from "@/lib/motion";

/* The 3D scene is a heavy chunk — load it lazily, client-side only, and show
   the cheap SVG fallback until it is ready. */
const GearboxScene = dynamic(() => import("@/components/3d/GearboxScene"), {
  ssr: false,
  loading: () => <HeroFallback />,
});

interface HeroProps {
  content: HeroContent;
  personal: PersonalContent;
}

export default function Hero({ content, personal }: HeroProps) {
  const prefersReducedMotion = useReducedMotionSafe();

  /* null until we know — SSR and first client paint both render the fallback,
     so hydration stays consistent and mobile never downloads the 3D chunk. */
  const [isMobile, setIsMobile] = useState<boolean | null>(null);

  useEffect(() => {
    const query = window.matchMedia("(max-width: 767px)");
    const update = () => setIsMobile(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  const show3D = isMobile === false;

  return (
    <section
      id="home"
      className="relative flex min-h-screen items-center overflow-hidden"
    >
      {/* Background layer: 3D gearbox on desktop, SVG gears otherwise */}
      <div className="absolute inset-0" aria-hidden="true">
        {show3D ? (
          <GearboxScene reducedMotion={prefersReducedMotion} />
        ) : (
          <HeroFallback />
        )}
      </div>

      {/* Faint blueprint grid + vignette so the copy stays readable */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-grid-faint [background-size:44px_44px]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(8,11,16,0)_0%,rgba(8,11,16,0.5)_62%,rgba(8,11,16,0.85)_100%)]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-charcoal-950"
      />

      {/* Copy overlay — pointer-events-none so parallax still tracks the
          pointer; interactive elements re-enable pointer events. */}
      <motion.div
        className="section-shell pointer-events-none relative z-10 py-28 sm:py-32"
        variants={staggerContainer}
        initial={prefersReducedMotion ? "visible" : "hidden"}
        animate="visible"
      >
        <div className="max-w-3xl">
          <motion.p variants={fadeUp} className="section-eyebrow">
            <span aria-hidden="true" className="h-px w-8 bg-ember-500" />
            {content.greeting}
          </motion.p>

          <motion.h1
            variants={fadeUp}
            className="mt-4 font-display text-5xl font-bold tracking-tight text-white sm:text-6xl lg:text-7xl"
          >
            {personal.name}
          </motion.h1>

          <motion.p
            variants={fadeUp}
            className="mt-4 text-lg font-semibold text-steel-300 sm:text-xl"
          >
            {personal.title}
            <span className="mt-1 block text-sm font-normal text-slate-400 sm:text-base">
              {personal.subtitle}
            </span>
          </motion.p>

          <motion.p
            variants={fadeUp}
            className="mt-6 font-display text-2xl font-semibold text-white sm:text-3xl"
          >
            {content.headlineLead}{" "}
            <span className="bg-gradient-to-r from-ember-300 via-ember-400 to-ember-600 bg-clip-text text-transparent">
              {content.headlineAccent}
            </span>
          </motion.p>

          <motion.p
            variants={fadeUp}
            className="mt-5 max-w-xl text-base leading-relaxed text-slate-400 sm:text-lg"
          >
            {content.intro}
          </motion.p>

          <motion.ul variants={fadeUp} className="mt-7 flex flex-wrap gap-2">
            {content.badges.map((badge) => (
              <li
                key={badge}
                className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3.5 py-1.5 text-xs font-medium text-slate-300 backdrop-blur-sm"
              >
                <span
                  aria-hidden="true"
                  className="h-1.5 w-1.5 rounded-full bg-ember-400"
                />
                {badge}
              </li>
            ))}
          </motion.ul>

          <motion.div
            variants={fadeUp}
            className="pointer-events-auto mt-10 flex flex-wrap items-center gap-4"
          >
            <a href="#projects" className="btn-primary">
              {content.ctaPrimary}
              <svg
                className="h-4 w-4"
                viewBox="0 0 16 16"
                fill="none"
                aria-hidden="true"
                focusable="false"
              >
                <path
                  d="M3 8h10M9 4l4 4-4 4"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </a>
            <a href={personal.resumeUrl} download className="btn-secondary">
              <svg
                className="h-4 w-4"
                viewBox="0 0 16 16"
                fill="none"
                aria-hidden="true"
                focusable="false"
              >
                <path
                  d="M8 2v8m0 0L5 7m3 3l3-3M3 13h10"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              {content.ctaSecondary}
            </a>
          </motion.div>
        </div>
      </motion.div>

      {/* Scroll hint — hidden entirely for reduced motion */}
      {!prefersReducedMotion ? (
        <motion.a
          href="#about"
          className="pointer-events-auto absolute bottom-8 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-2 rounded text-xs uppercase tracking-[0.25em] text-slate-400 transition hover:text-steel-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-steel-300"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4, duration: 0.8 }}
        >
          {content.scrollHint}
          <motion.svg
            className="h-4 w-4 text-ember-400"
            viewBox="0 0 16 16"
            fill="none"
            aria-hidden="true"
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          >
            <path
              d="M3 6l5 5 5-5"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </motion.svg>
        </motion.a>
      ) : null}
    </section>
  );
}
