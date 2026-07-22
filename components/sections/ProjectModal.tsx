"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useReducedMotionSafe } from "@/lib/useReducedMotionSafe";
import type { ProjectItem } from "@/types/content";
import {
  ProjectPlaceholder,
  type PlaceholderTone,
} from "@/components/sections/ProjectCard";

interface ProjectModalProps {
  project: ProjectItem | null;
  /** Position of the project in the grid — picks the placeholder motif/tone. */
  variantIndex: number;
  labels: { details: string; tools: string };
  onClose: () => void;
}

/**
 * Accessible project detail modal. Closes on Escape or backdrop click,
 * focuses the close button on open and locks body scroll while visible.
 * (Focus is returned to the invoking card by the parent's onClose handler.)
 */
export default function ProjectModal({
  project,
  variantIndex,
  labels,
  onClose,
}: ProjectModalProps) {
  const prefersReducedMotion = useReducedMotionSafe();
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const open = project !== null;

  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
        return;
      }
      // Focus trap: keep Tab / Shift+Tab cycling inside the dialog.
      if (event.key === "Tab" && dialogRef.current) {
        const focusables = dialogRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, textarea, select, [tabindex]:not([tabindex="-1"])'
        );
        if (focusables.length === 0) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        const active = document.activeElement;
        if (event.shiftKey) {
          if (active === first || !dialogRef.current.contains(active)) {
            event.preventDefault();
            last.focus();
          }
        } else if (active === last || !dialogRef.current.contains(active)) {
          event.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus();
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  // Match the card's tone/motif so the modal banner shows the same artwork.
  const tone: PlaceholderTone = variantIndex % 2 === 0 ? "steel" : "ember";

  return (
    <AnimatePresence>
      {project ? (
        <motion.div
          key="project-modal"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          onClick={onClose}
          className="fixed inset-0 z-50 flex items-center justify-center bg-charcoal-950/80 p-4 backdrop-blur-sm sm:p-6"
        >
          <motion.div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="project-modal-title"
            initial={
              prefersReducedMotion
                ? { opacity: 0 }
                : { opacity: 0, y: 32, scale: 0.96 }
            }
            animate={
              prefersReducedMotion
                ? { opacity: 1 }
                : { opacity: 1, y: 0, scale: 1 }
            }
            exit={
              prefersReducedMotion
                ? { opacity: 0 }
                : { opacity: 0, y: 24, scale: 0.97 }
            }
            transition={{ duration: 0.3, ease: "easeOut" }}
            onClick={(event) => event.stopPropagation()}
            className="metal-card relative w-full max-w-2xl overflow-hidden"
          >
            <button
              ref={closeButtonRef}
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-charcoal-900/80 text-slate-300 transition hover:border-white/25 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-steel-300"
            >
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                className="h-4 w-4"
              >
                <path d="M18 6 6 18M6 6l12 12" />
              </svg>
            </button>

            {/* tabIndex makes the scroll region keyboard-reachable (arrow keys / PgDn), incl. Safari */}
            <div tabIndex={0} className="max-h-[85vh] overflow-y-auto focus:outline-none focus-visible:ring-2 focus-visible:ring-steel-300">
              {/* Banner */}
              <div className="relative h-48 w-full overflow-hidden border-b border-white/10 sm:h-64">
                {project.image ? (
                  <>
                    {/* Blurred copy fills the frame so any aspect ratio looks deliberate… */}
                    <Image
                      src={project.image}
                      alt=""
                      aria-hidden
                      fill
                      sizes="(min-width: 672px) 672px, 100vw"
                      className="scale-110 object-cover opacity-40 blur-lg"
                    />
                    {/* …while the actual photo shows complete and unscaled-sharp. */}
                    <Image
                      src={project.image}
                      alt={project.imageAlt}
                      fill
                      sizes="(min-width: 672px) 672px, 100vw"
                      className="object-contain"
                    />
                  </>
                ) : (
                  <ProjectPlaceholder
                    label={project.imageAlt}
                    tone={tone}
                    variant={variantIndex}
                  />
                )}
              </div>

              <div className="p-6 sm:p-8">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-ember-400">
                  {project.company}
                </p>
                <h2
                  id="project-modal-title"
                  className="mt-2 font-display text-2xl font-bold text-white sm:text-3xl"
                >
                  {project.title}
                </h2>
                <p className="mt-1 text-sm text-steel-300">{project.subtitle}</p>
                <p className="mt-4 text-sm leading-relaxed text-slate-400 sm:text-base">
                  {project.description}
                </p>

                {/* Details */}
                <h3 className="mt-8 font-display text-sm font-semibold uppercase tracking-[0.2em] text-steel-300">
                  {labels.details}
                </h3>
                <ul className="mt-4 space-y-3">
                  {project.details.map((detail) => (
                    <li
                      key={detail}
                      className="flex items-start gap-3 text-sm leading-relaxed text-slate-300"
                    >
                      <svg
                        aria-hidden="true"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="mt-0.5 h-4 w-4 shrink-0 text-ember-400"
                      >
                        <path d="M20 6 9 17l-5-5" />
                      </svg>
                      <span>{detail}</span>
                    </li>
                  ))}
                </ul>

                {/* Tools */}
                <h3 className="mt-8 font-display text-sm font-semibold uppercase tracking-[0.2em] text-steel-300">
                  {labels.tools}
                </h3>
                <div className="mt-4 flex flex-wrap gap-2">
                  {project.tools.map((tool) => (
                    <span
                      key={tool}
                      className="rounded-full border border-steel-500/30 bg-steel-500/10 px-3 py-1 text-xs font-medium text-steel-300"
                    >
                      {tool}
                    </span>
                  ))}
                </div>

                {/* Tags */}
                <div className="mt-8 flex flex-wrap gap-2 border-t border-white/10 pt-6">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full border border-white/10 bg-white/5 px-2.5 py-0.5 text-[11px] font-medium uppercase tracking-wide text-slate-400"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
