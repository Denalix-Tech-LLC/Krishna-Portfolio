import type { FooterContent, PersonalContent } from "@/types/content";

interface FooterProps {
  content: FooterContent;
  personal: PersonalContent;
}

/** Compact site footer: name + year, tagline, build credit and social links. */
export default function Footer({ content, personal }: FooterProps) {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-white/10 bg-charcoal-950">
      <div className="section-shell flex flex-col items-center gap-4 py-8 text-center sm:flex-row sm:items-center sm:justify-between sm:gap-6 sm:text-left">
        <p className="text-sm text-slate-400">
          <span className="font-display font-semibold text-white">
            {personal.name}
          </span>{" "}
          &copy; {year}
        </p>

        <p className="text-sm text-slate-400">{content.text}</p>

        <div className="flex items-center gap-4">
          <span className="text-xs text-slate-500">{content.builtWith}</span>
          <a
            href={personal.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`LinkedIn profile of ${personal.name}`}
            className="rounded-md p-1 text-slate-400 transition hover:text-steel-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-steel-300"
          >
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="h-5 w-5"
            >
              <path d="M20.45 20.45h-3.55v-5.57c0-1.33-.03-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05a3.74 3.74 0 0 1 3.37-1.85c3.6 0 4.27 2.37 4.27 5.46v6.28ZM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12ZM7.12 20.45H3.55V9h3.57v11.45Z" />
            </svg>
          </a>
          <a
            href={`mailto:${personal.email}`}
            aria-label={`Email ${personal.name}`}
            className="rounded-md p-1 text-slate-400 transition hover:text-ember-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-ember-300"
          >
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-5 w-5"
            >
              <rect x="3" y="5" width="18" height="14" rx="2" />
              <path d="m3 7 9 6 9-6" />
            </svg>
          </a>
        </div>
      </div>
    </footer>
  );
}
