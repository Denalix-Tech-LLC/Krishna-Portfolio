"use client";

import { motion } from "framer-motion";
import { useReducedMotionSafe } from "@/lib/useReducedMotionSafe";

interface SectionHeadingProps {
  eyebrow: string;
  heading: string;
  subheading?: string;
}

/** Shared animated section header: eyebrow label, big title, optional subtitle. */
export default function SectionHeading({
  eyebrow,
  heading,
  subheading,
}: SectionHeadingProps) {
  const prefersReducedMotion = useReducedMotionSafe();

  return (
    <motion.header
      initial={prefersReducedMotion ? false : { opacity: 0, y: 24 }}
      whileInView={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <span className="section-eyebrow">
        <span aria-hidden className="h-px w-8 bg-ember-500" />
        {eyebrow}
      </span>
      <h2 className="section-heading">{heading}</h2>
      {subheading ? <p className="section-subheading">{subheading}</p> : null}
    </motion.header>
  );
}
