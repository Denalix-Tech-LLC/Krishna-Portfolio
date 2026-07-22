"use client";

import Image from "next/image";
import { useRef, type MouseEvent as ReactMouseEvent } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";
import { useReducedMotionSafe } from "@/lib/useReducedMotionSafe";
import type { ProjectItem } from "@/types/content";

export type PlaceholderTone = "steel" | "ember";

/** Number of distinct placeholder motifs — variants cycle through these. */
export const MOTIF_COUNT = 6;

/**
 * Blueprint motifs, one per variant, so every project card gets its own
 * technical illustration: 0 vacuum chamber, 1 litho beam/wafer stack,
 * 2 gimbal rings, 3 PCB module, 4 piping manifold, 5 spoked wheel.
 */
function Motif({ variant, stroke }: { variant: number; stroke: string }) {
  switch (variant % MOTIF_COUNT) {
    case 0:
      // Vacuum deposition chamber: target, deposition arrows, wafer pedestal, ports, gauge
      return (
        <g stroke={stroke} opacity="0.55" fill="none">
          <rect x="145" y="28" width="150" height="112" rx="10" strokeWidth="1.5" />
          <rect x="185" y="38" width="70" height="9" strokeWidth="1" />
          <path d="M203 56v22M220 56v22M237 56v22" strokeWidth="0.75" strokeDasharray="3 3" />
          <path d="M203 84l-3.2-6.5h6.4zM220 84l-3.2-6.5h6.4zM237 84l-3.2-6.5h6.4z" fill={stroke} stroke="none" />
          <ellipse cx="220" cy="102" rx="44" ry="8" strokeWidth="1.5" />
          <path d="M220 110v30" strokeWidth="1.5" />
          <path d="M145 88h-28M117 80v16" strokeWidth="1.5" />
          <path d="M295 70h28M323 62v16" strokeWidth="1.5" />
          <circle cx="345" cy="120" r="13" strokeWidth="1" />
          <path d="M345 120l7.5-7.5M295 120h37" strokeWidth="0.9" strokeDasharray="4 3" />
          <path d="M220 16v144" strokeWidth="0.6" strokeDasharray="12 4 2 4" opacity="0.5" />
          <path d="M62 34v12M62 134v-12M62 46v88" strokeWidth="1" />
          <path d="M62 46l-3.2 8h6.4zM62 134l-3.2-8h6.4z" fill={stroke} stroke="none" />
        </g>
      );
    case 1:
      // Lithography: source, exposure rays through a mask onto a wafer layer stack
      return (
        <g stroke={stroke} opacity="0.55" fill="none">
          <circle cx="215" cy="28" r="9" strokeWidth="1.5" />
          <path d="M215 20v-8M207 24l-6-5M223 24l6-5" strokeWidth="0.9" />
          <path d="M212 37 L166 82 M215 37 L215 82 M218 37 L264 82" strokeWidth="0.75" strokeDasharray="4 3" />
          <path d="M166 82l1.2-7 4.8 4.4zM215 82l-3-6.4h6zM264 82l-6-2.6 4.8-4.4z" fill={stroke} stroke="none" />
          <path d="M150 90h38M202 90h26M242 90h38" strokeWidth="4" />
          <rect x="140" y="108" width="150" height="10" strokeWidth="1" />
          <rect x="140" y="118" width="150" height="10" strokeWidth="1" />
          <rect x="140" y="128" width="150" height="14" strokeWidth="1.25" />
          <path d="M146 142l8-14M162 142l8-14M178 142l8-14M194 142l8-14M210 142l8-14M226 142l8-14M242 142l8-14M258 142l8-14M274 142l8-14" strokeWidth="0.6" opacity="0.6" />
          <path d="M318 108v34M310 108h16M310 142h16" strokeWidth="1" />
          <path d="M318 118l-3.2-8h6.4zM318 132l-3.2 8h6.4z" fill={stroke} stroke="none" />
        </g>
      );
    case 2:
      // Two-axis gimbal: outer ring, orthogonal ellipses, pivots, sweep arc
      return (
        <g stroke={stroke} opacity="0.55" fill="none">
          <circle cx="215" cy="88" r="52" strokeWidth="1.5" />
          <ellipse cx="215" cy="88" rx="52" ry="17" strokeWidth="1" />
          <ellipse cx="215" cy="88" rx="17" ry="52" strokeWidth="1" />
          <circle cx="215" cy="88" r="8" strokeWidth="1.25" />
          <path d="M215 28v-12M215 148v12M147 88h-12M283 88h12" strokeWidth="1.5" />
          <path d="M209 16h12M209 160h12M129 82v12M301 82v12" strokeWidth="1" />
          <path d="M258 57 A52 52 0 0 0 215 36" strokeWidth="1" />
          <path d="M258 57l-7.5-1 3.8-5.6z" fill={stroke} stroke="none" />
          <path d="M140 88h150M215 13v150" strokeWidth="0.6" strokeDasharray="12 4 2 4" opacity="0.5" />
          <circle cx="330" cy="46" r="10" strokeWidth="1" />
          <path d="M316 46h28M330 32v28" strokeWidth="0.75" />
          <path d="M322 54l-42 24" strokeWidth="0.75" strokeDasharray="4 4" opacity="0.6" />
        </g>
      );
    case 3:
      // Electronics module: chip with pins, routed traces, vias, mounting holes
      return (
        <g stroke={stroke} opacity="0.55" fill="none">
          <rect x="182" y="52" width="72" height="68" rx="4" strokeWidth="1.5" />
          <circle cx="192" cy="62" r="3" strokeWidth="1" />
          <path d="M196 52v-14M212 52v-14M228 52v-14M244 52v-14M196 120v14M212 120v14M228 120v14M244 120v14" strokeWidth="1" />
          <path d="M254 66h44v-26h32" strokeWidth="1" />
          <circle cx="330" cy="40" r="3.5" strokeWidth="1" />
          <path d="M254 100h32v28h40" strokeWidth="1" />
          <circle cx="326" cy="128" r="3.5" strokeWidth="1" />
          <path d="M182 84h-34v-34h-24" strokeWidth="1" />
          <circle cx="124" cy="50" r="3.5" strokeWidth="1" />
          <path d="M182 106h-46v30h-30" strokeWidth="1" />
          <circle cx="106" cy="136" r="3.5" strokeWidth="1" />
          <circle cx="88" cy="88" r="6" strokeWidth="1" />
          <path d="M80 88h16M88 80v16" strokeWidth="0.75" />
          <circle cx="352" cy="88" r="6" strokeWidth="1" />
          <path d="M344 88h16M352 80v16" strokeWidth="0.75" />
          <path d="M218 86h-8v6h8z" strokeWidth="0.9" />
        </g>
      );
    case 4:
      // High-purity gas manifold: main header, valved branches, flow arrow, gauge
      return (
        <g stroke={stroke} opacity="0.55" fill="none">
          <path d="M96 56h248" strokeWidth="1.5" />
          <path d="M96 48v16M344 48v16M104 48v16M336 48v16" strokeWidth="1" />
          <path d="M160 56v34M220 56v34M280 56v34" strokeWidth="1.25" />
          <path d="M150 90l20 14M170 90l-20 14M150 90v14M170 90v14" strokeWidth="1" />
          <path d="M210 90l20 14M230 90l-20 14M210 90v14M230 90v14" strokeWidth="1" />
          <path d="M270 90l20 14M290 90l-20 14M270 90v14M290 90v14" strokeWidth="1" />
          <path d="M160 104v26M220 104v26M280 104v26" strokeWidth="1.25" />
          <path d="M152 130h16M212 130h16M272 130h16" strokeWidth="1.5" />
          <path d="M118 56l14 0" strokeWidth="2.5" />
          <path d="M138 56l-9-4.5v9z" fill={stroke} stroke="none" />
          <circle cx="320" cy="92" r="12" strokeWidth="1" />
          <path d="M320 92l6.5-6.5M320 80v-14" strokeWidth="0.9" />
          <path d="M60 130h44M60 124v12M104 124v12" strokeWidth="0.75" strokeDasharray="4 3" opacity="0.6" />
        </g>
      );
    default:
      // Spoked wheel with ground line and motion arcs
      return (
        <g stroke={stroke} opacity="0.55" fill="none">
          <circle cx="222" cy="86" r="54" strokeWidth="2" />
          <circle cx="222" cy="86" r="46" strokeWidth="0.75" />
          <circle cx="222" cy="86" r="10" strokeWidth="1.5" />
          {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => {
            const rad = (deg * Math.PI) / 180;
            return (
              <path
                key={deg}
                d={`M${222 + 10 * Math.cos(rad)} ${86 + 10 * Math.sin(rad)} L${222 + 45 * Math.cos(rad)} ${86 + 45 * Math.sin(rad)}`}
                strokeWidth="1"
              />
            );
          })}
          <path d="M110 146h230" strokeWidth="1.25" />
          <path d="M120 152l10-6M145 152l10-6M170 152l10-6M195 152l10-6M220 152l10-6M245 152l10-6M270 152l10-6M295 152l10-6" strokeWidth="0.6" opacity="0.6" />
          <path d="M138 46a58 58 0 0 0-16 24M124 34a74 74 0 0 0-20 30" strokeWidth="1" strokeDasharray="6 5" />
          <path d="M222 86h96M310 80v12" strokeWidth="0.75" strokeDasharray="10 4 2 4" opacity="0.5" />
        </g>
      );
  }
}

/**
 * Stylized blueprint placeholder shown when a project has no image. Each
 * variant renders a different technical motif so cards look distinct.
 * Exported so the project modal can reuse it for its banner.
 */
export function ProjectPlaceholder({
  label,
  tone,
  variant,
}: {
  label: string;
  tone: PlaceholderTone;
  variant: number;
}) {
  const stroke = tone === "steel" ? "#9dc1de" : "#f0ac82"; // steel-300 / ember-300
  const gradient =
    tone === "steel"
      ? "bg-gradient-to-br from-steel-700/40 via-charcoal-800 to-charcoal-900"
      : "bg-gradient-to-br from-ember-700/30 via-charcoal-800 to-charcoal-900";

  return (
    <span
      role="img"
      aria-label={label}
      className={`relative block h-full w-full overflow-hidden ${gradient}`}
    >
      <span
        aria-hidden="true"
        className="absolute inset-0 block bg-grid-faint bg-[length:24px_24px]"
      />
      <svg
        aria-hidden="true"
        viewBox="0 0 400 176"
        preserveAspectRatio="xMidYMid slice"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="absolute inset-0 h-full w-full"
      >
        <Motif variant={variant} stroke={stroke} />
      </svg>
    </span>
  );
}

interface ProjectCardProps {
  project: ProjectItem;
  index: number;
  /** Card footer call-to-action text (from projects.cardCtaLabel in the JSON). */
  ctaLabel: string;
  onSelect: (
    project: ProjectItem,
    index: number,
    trigger: HTMLButtonElement | null
  ) => void;
}

const TILT_SPRING = { stiffness: 260, damping: 20, mass: 0.6 };
const MAX_TILT = 8; // degrees

/**
 * Project card with a 3D tilt that follows the cursor (springs back on
 * leave). Rendered as a real button so Enter/Space open the modal natively.
 */
export default function ProjectCard({
  project,
  index,
  ctaLabel,
  onSelect,
}: ProjectCardProps) {
  const prefersReducedMotion = useReducedMotionSafe();
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Normalised cursor position over the card (0..1), centred at 0.5.
  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);
  const rotateX = useSpring(
    useTransform(py, [0, 1], [MAX_TILT, -MAX_TILT]),
    TILT_SPRING
  );
  const rotateY = useSpring(
    useTransform(px, [0, 1], [-MAX_TILT, MAX_TILT]),
    TILT_SPRING
  );

  const handleMouseMove = (event: ReactMouseEvent<HTMLButtonElement>) => {
    if (prefersReducedMotion) return;
    const rect = event.currentTarget.getBoundingClientRect();
    px.set((event.clientX - rect.left) / rect.width);
    py.set((event.clientY - rect.top) / rect.height);
  };

  const handleMouseLeave = () => {
    px.set(0.5);
    py.set(0.5);
  };

  const tone: PlaceholderTone = index % 2 === 0 ? "steel" : "ember";

  return (
    <div style={{ perspective: "900px" }} className="h-full">
      <motion.button
        ref={buttonRef}
        type="button"
        aria-haspopup="dialog"
        onClick={() => onSelect(project, index, buttonRef.current)}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={
          prefersReducedMotion
            ? undefined
            : { rotateX, rotateY, transformStyle: "preserve-3d" }
        }
        className="metal-card group flex h-full w-full flex-col overflow-hidden text-left transition-colors hover:border-steel-500/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-steel-300"
      >
        {/* Image / placeholder */}
        <span className="relative block h-44 w-full shrink-0 overflow-hidden border-b border-white/10">
          {project.image ? (
            <>
              {/* Blurred copy fills the frame so any aspect ratio looks deliberate… */}
              <Image
                src={project.image}
                alt=""
                aria-hidden
                fill
                sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                className="scale-110 object-cover opacity-40 blur-md"
              />
              {/* …while the actual photo shows complete and unscaled-sharp. */}
              <Image
                src={project.image}
                alt={project.imageAlt}
                fill
                sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                className="object-contain"
              />
            </>
          ) : (
            <ProjectPlaceholder
              label={project.imageAlt}
              tone={tone}
              variant={index}
            />
          )}
        </span>

        {/* Body */}
        <span className="flex flex-1 flex-col p-6">
          <span className="block text-xs font-semibold uppercase tracking-[0.2em] text-ember-400">
            {project.company}
          </span>
          <span className="mt-2 block font-display text-lg font-bold text-white">
            {project.title}
          </span>
          <span className="mt-1 block text-sm text-slate-400">
            {project.subtitle}
          </span>
          <span className="mt-3 line-clamp-3 block text-sm leading-relaxed text-slate-400">
            {project.description}
          </span>

          <span className="mt-4 flex flex-wrap gap-2">
            {project.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-white/10 bg-white/5 px-2.5 py-0.5 text-[11px] font-medium text-slate-300"
              >
                {tag}
              </span>
            ))}
          </span>

          <span className="mt-auto inline-flex items-center gap-1.5 pt-5 text-sm font-semibold text-steel-300 transition-colors group-hover:text-steel-200">
            {ctaLabel}
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-4 w-4 transition-transform group-hover:translate-x-1"
            >
              <path d="M5 12h14" />
              <path d="m12 5 7 7-7 7" />
            </svg>
          </span>
        </span>
      </motion.button>
    </div>
  );
}
