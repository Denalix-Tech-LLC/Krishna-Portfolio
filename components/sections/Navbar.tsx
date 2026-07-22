"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useReducedMotionSafe } from "@/lib/useReducedMotionSafe";
import type { NavContent, PersonalContent } from "@/types/content";

interface NavbarProps {
  content: NavContent;
  personal: PersonalContent;
}

/** Small download-arrow icon for the resume pill. */
function DownloadIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-3.5 w-3.5"
    >
      <path d="M10 3v9m0 0-3.5-3.5M10 12l3.5-3.5M4 16h12" />
    </svg>
  );
}

/**
 * Fixed top navigation. Transparent over the hero, gains a blurred
 * charcoal backdrop once the page is scrolled. Mobile links live in an
 * animated slide-down panel.
 */
export default function Navbar({ content, personal }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const prefersReducedMotion = useReducedMotionSafe();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close the mobile panel if the viewport grows past the md breakpoint.
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const onChange = () => {
      if (mq.matches) setOpen(false);
    };
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  const solid = scrolled || open;

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
        solid
          ? "border-b border-white/10 bg-charcoal-950/80 backdrop-blur-md"
          : "border-b border-transparent bg-transparent"
      }`}
    >
      <nav
        aria-label="Primary"
        className="section-shell flex h-16 items-center justify-between"
      >
        {/* Logo */}
        <a
          href="#home"
          className="rounded-md font-display text-lg font-bold tracking-tight text-white transition hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-steel-300"
        >
          {content.logoText}
          <span className="text-ember-400">{content.logoAccent}</span>
        </a>

        {/* Desktop links */}
        <div className="hidden items-center gap-1 md:flex">
          {content.links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="rounded-md px-3 py-2 text-sm font-medium text-slate-300 transition hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-steel-300"
            >
              {link.label}
            </a>
          ))}
          <a
            href={personal.resumeUrl}
            download
            className="ml-3 inline-flex items-center gap-1.5 rounded-full border border-ember-500/40 bg-ember-500/10 px-4 py-1.5 text-sm font-semibold text-ember-300 transition hover:border-ember-400 hover:bg-ember-500/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-ember-300"
          >
            <DownloadIcon />
            {content.resumeLabel}
          </a>
        </div>

        {/* Mobile hamburger */}
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="mobile-nav"
          aria-label={open ? "Close navigation menu" : "Open navigation menu"}
          className="inline-flex h-10 w-10 items-center justify-center rounded-md text-slate-300 transition hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-steel-300 md:hidden"
        >
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinecap="round"
            className="h-6 w-6"
          >
            {open ? (
              <path d="M6 6l12 12M18 6L6 18" />
            ) : (
              <path d="M4 7h16M4 12h16M4 17h16" />
            )}
          </svg>
        </button>
      </nav>

      {/* Mobile slide-down panel */}
      <AnimatePresence>
        {open ? (
          <motion.div
            id="mobile-nav"
            initial={
              prefersReducedMotion ? { opacity: 0 } : { height: 0, opacity: 0 }
            }
            animate={
              prefersReducedMotion
                ? { opacity: 1 }
                : { height: "auto", opacity: 1 }
            }
            exit={
              prefersReducedMotion ? { opacity: 0 } : { height: 0, opacity: 0 }
            }
            transition={{
              duration: prefersReducedMotion ? 0.1 : 0.3,
              ease: "easeOut",
            }}
            className="overflow-hidden border-t border-white/10 bg-charcoal-950/95 backdrop-blur-md md:hidden"
          >
            <ul className="section-shell flex flex-col gap-1 py-4">
              {content.links.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className="block rounded-md px-3 py-2.5 text-base font-medium text-slate-300 transition hover:bg-white/5 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-steel-300"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
              <li className="mt-2">
                <a
                  href={personal.resumeUrl}
                  download
                  onClick={() => setOpen(false)}
                  className="inline-flex items-center gap-1.5 rounded-full border border-ember-500/40 bg-ember-500/10 px-4 py-2 text-sm font-semibold text-ember-300 transition hover:border-ember-400 hover:bg-ember-500/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-ember-300"
                >
                  <DownloadIcon />
                  {content.resumeLabel}
                </a>
              </li>
            </ul>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </header>
  );
}
