"use client";
import { useReducedMotionSafe } from "@/lib/useReducedMotionSafe";


interface GearOutlineProps {
  teeth: number;
  className?: string;
}

/** Wireframe gear drawn with basic SVG shapes (circles, rects, spokes). */
function GearOutline({ teeth, className = "" }: GearOutlineProps) {
  const step = 360 / teeth;
  return (
    <svg
      viewBox="0 0 120 120"
      className={className}
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      {/* Teeth around the rim */}
      {Array.from({ length: teeth }, (_, i) => (
        <rect
          key={i}
          x="55"
          y="8"
          width="10"
          height="12"
          rx="2"
          stroke="currentColor"
          strokeWidth="2.5"
          transform={`rotate(${i * step} 60 60)`}
        />
      ))}
      {/* Body, inner rim and bore */}
      <circle cx="60" cy="60" r="42" stroke="currentColor" strokeWidth="2.5" />
      <circle
        cx="60"
        cy="60"
        r="30"
        stroke="currentColor"
        strokeWidth="1"
        opacity="0.4"
      />
      <circle cx="60" cy="60" r="12" stroke="currentColor" strokeWidth="2.5" />
      {/* Spokes */}
      {Array.from({ length: 4 }, (_, i) => (
        <line
          key={i}
          x1="60"
          y1="48"
          x2="60"
          y2="30"
          stroke="currentColor"
          strokeWidth="2"
          opacity="0.5"
          transform={`rotate(${i * 90 + 45} 60 60)`}
        />
      ))}
    </svg>
  );
}

/**
 * Lightweight animated stand-in for the 3D gearbox: layered SVG gear
 * outlines spun with cheap CSS animations. Used on mobile, for reduced
 * motion, and while the 3D chunk loads.
 */
export default function HeroFallback() {
  const prefersReducedMotion = useReducedMotionSafe();
  const spinSlow = prefersReducedMotion ? "" : " animate-spin-slow";
  const spinSlower = prefersReducedMotion ? "" : " animate-spin-slower";
  const pulse = prefersReducedMotion ? "" : " animate-pulse-soft";

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden"
    >
      {/* Soft steel glow behind the gear cluster */}
      <div
        className={
          "absolute h-[26rem] w-[26rem] rounded-full bg-steel-500/10 blur-3xl" +
          pulse
        }
      />

      <div className="relative h-72 w-72 sm:h-96 sm:w-96 md:translate-x-24">
        {/* Main steel gear */}
        <div className={"absolute inset-0 text-steel-500/70" + spinSlower}>
          <GearOutline teeth={12} className="h-full w-full" />
        </div>

        {/* Ember gear meshing at the top right, counter-rotating */}
        <div
          className={
            "absolute -right-8 -top-6 h-1/2 w-1/2 text-ember-500/70 [animation-direction:reverse]" +
            spinSlow
          }
        >
          <GearOutline teeth={9} className="h-full w-full" />
        </div>

        {/* Small gear at the bottom left */}
        <div
          className={
            "absolute -bottom-4 -left-8 h-1/3 w-1/3 text-steel-300/50 [animation-direction:reverse]" +
            spinSlower
          }
        >
          <GearOutline teeth={8} className="h-full w-full" />
        </div>
      </div>
    </div>
  );
}
