"use client";

import { useCallback, useRef, useState } from "react";
import { motion } from "framer-motion";
import { useReducedMotionSafe } from "@/lib/useReducedMotionSafe";
import type { ProjectItem, ProjectsContent } from "@/types/content";
import SectionHeading from "@/components/ui/SectionHeading";
import ProjectCard from "@/components/sections/ProjectCard";
import ProjectModal from "@/components/sections/ProjectModal";
import { fadeUp, staggerContainer, viewportOnce } from "@/lib/motion";

interface ProjectsProps {
  content: ProjectsContent;
}

/**
 * Projects grid: 3D-tilt cards in a responsive 1/2/3-column layout with
 * staggered scroll reveals. Clicking a card opens an accessible detail modal;
 * focus is returned to the invoking card on close.
 */
export default function Projects({ content }: ProjectsProps) {
  const prefersReducedMotion = useReducedMotionSafe();
  const [selected, setSelected] = useState<{
    project: ProjectItem;
    index: number;
  } | null>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);

  const handleSelect = useCallback(
    (
      project: ProjectItem,
      index: number,
      trigger: HTMLButtonElement | null
    ) => {
      triggerRef.current = trigger;
      setSelected({ project, index });
    },
    []
  );

  const handleClose = useCallback(() => {
    setSelected(null);
    // Return focus to the card that opened the modal.
    triggerRef.current?.focus();
    triggerRef.current = null;
  }, []);

  return (
    <section id="projects" className="relative py-24 sm:py-32">
      <div className="section-shell">
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
          className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          {content.items.map((item, index) => (
            <motion.div key={item.id} variants={fadeUp} className="h-full">
              <ProjectCard
                project={item}
                index={index}
                ctaLabel={content.cardCtaLabel}
                onSelect={handleSelect}
              />
            </motion.div>
          ))}
        </motion.div>
      </div>

      <ProjectModal
        project={selected?.project ?? null}
        variantIndex={selected?.index ?? 0}
        labels={{
          details: content.modalDetailsLabel,
          tools: content.modalToolsLabel,
        }}
        onClose={handleClose}
      />
    </section>
  );
}
