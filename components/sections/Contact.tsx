"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { motion } from "framer-motion";
import { useReducedMotionSafe } from "@/lib/useReducedMotionSafe";
import type { ContactContent, PersonalContent } from "@/types/content";
import SectionHeading from "@/components/ui/SectionHeading";
import { fadeUp, staggerContainer, viewportOnce } from "@/lib/motion";

interface ContactProps {
  content: ContactContent;
  personal: PersonalContent;
}

interface InfoItem {
  label: string;
  value: string;
  href: string;
  external?: boolean;
  /** Raw string put on the clipboard; omit to hide the copy button. */
  copyValue?: string;
  tone: "steel" | "ember";
  icon: ReactNode;
}

const iconProps = {
  "aria-hidden": true,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.75,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  className: "h-5 w-5",
} as const;

/**
 * Contact section: intro plus direct-contact cards (email, LinkedIn, phone).
 * Email and phone have one-click copy buttons.
 */
export default function Contact({ content, personal }: ContactProps) {
  const prefersReducedMotion = useReducedMotionSafe();
  const [copied, setCopied] = useState<string | null>(null);
  const copyTimer = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (copyTimer.current !== null) window.clearTimeout(copyTimer.current);
    };
  }, []);

  const handleCopy = async (label: string, value: string) => {
    try {
      await navigator.clipboard.writeText(value);
    } catch {
      // Clipboard API unavailable (e.g. non-HTTPS) — fall back to a hidden textarea.
      const textarea = document.createElement("textarea");
      textarea.value = value;
      textarea.style.position = "fixed";
      textarea.style.opacity = "0";
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
    }
    setCopied(label);
    if (copyTimer.current !== null) window.clearTimeout(copyTimer.current);
    copyTimer.current = window.setTimeout(() => setCopied(null), 2000);
  };

  const infoItems: InfoItem[] = [
    {
      label: content.emailLabel,
      value: personal.email,
      href: `mailto:${personal.email}`,
      copyValue: personal.email,
      tone: "ember",
      icon: (
        <svg {...iconProps}>
          <rect x="2" y="4" width="20" height="16" rx="2" />
          <path d="m22 7-10 6L2 7" />
        </svg>
      ),
    },
    {
      label: content.linkedinLabel,
      value: content.linkedinText,
      href: personal.linkedin,
      external: true,
      tone: "steel",
      icon: (
        <svg {...iconProps}>
          <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4V8h4v1.6" />
          <rect x="2" y="9" width="4" height="12" />
          <circle cx="4" cy="4" r="2" />
        </svg>
      ),
    },
    {
      label: content.phoneLabel,
      value: personal.phone,
      href: `tel:${personal.phone.replace(/[^\d+]/g, "")}`,
      copyValue: personal.phone,
      tone: "steel",
      icon: (
        <svg {...iconProps}>
          <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.79 19.79 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z" />
        </svg>
      ),
    },
  ];

  return (
    <section id="contact" className="relative py-24 sm:py-32">
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
          className="mt-14"
        >
          <motion.p
            variants={fadeUp}
            className="max-w-2xl text-base leading-relaxed text-slate-400"
          >
            {content.intro}
          </motion.p>

          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {infoItems.map((item) => {
              const toneClasses =
                item.tone === "steel"
                  ? "border-steel-500/30 bg-steel-500/10 text-steel-300"
                  : "border-ember-500/30 bg-ember-500/10 text-ember-300";
              const isCopied = copied === item.label;

              return (
                <motion.div
                  key={item.label}
                  variants={fadeUp}
                  className="metal-card flex items-center gap-4 p-4"
                >
                  <a
                    href={item.href}
                    {...(item.external
                      ? { target: "_blank", rel: "noreferrer" }
                      : {})}
                    className="group flex min-w-0 flex-1 items-center gap-4 rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-steel-300"
                  >
                    <span
                      aria-hidden="true"
                      className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border ${toneClasses}`}
                    >
                      {item.icon}
                    </span>
                    <span className="min-w-0">
                      <span className="block text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                        {item.label}
                      </span>
                      <span className="mt-1 flex items-center gap-1.5 truncate text-sm font-medium text-white transition-colors group-hover:text-steel-200">
                        {item.value}
                        {item.external ? (
                          <svg
                            {...iconProps}
                            strokeWidth={2}
                            className="h-3.5 w-3.5 shrink-0 text-slate-500 transition-colors group-hover:text-steel-300"
                          >
                            <path d="M7 17 17 7M8 7h9v9" />
                          </svg>
                        ) : null}
                      </span>
                    </span>
                  </a>

                  {item.copyValue ? (
                    <button
                      type="button"
                      onClick={() => handleCopy(item.label, item.copyValue!)}
                      aria-label={`Copy ${item.label}`}
                      title={`Copy ${item.label}`}
                      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-charcoal-900/80 text-slate-400 transition hover:border-steel-500/40 hover:text-steel-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-steel-300"
                    >
                      {isCopied ? (
                        <svg
                          {...iconProps}
                          className="h-4 w-4 text-ember-400"
                          strokeWidth={2.5}
                        >
                          <path d="M20 6 9 17l-5-5" />
                        </svg>
                      ) : (
                        <svg {...iconProps} className="h-4 w-4">
                          <rect x="9" y="9" width="12" height="12" rx="2" />
                          <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                        </svg>
                      )}
                    </button>
                  ) : null}
                </motion.div>
              );
            })}
          </div>

          {/* Screen-reader announcement for the copy action */}
          <p aria-live="polite" className="sr-only">
            {copied ? `${copied} copied to clipboard` : ""}
          </p>
        </motion.div>
      </div>
    </section>
  );
}
