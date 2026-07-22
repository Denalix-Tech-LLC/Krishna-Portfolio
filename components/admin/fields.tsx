"use client";

import { useId, type MouseEvent, type ReactNode } from "react";

/**
 * Small, reusable, typed form primitives for the /admin editor.
 * All are dark-styled to match the site's industrial theme and are fully
 * keyboard operable. Purely presentational — state lives in the caller.
 */

/* ------------------------------------------------------------------ */
/* Shared class strings                                                */
/* ------------------------------------------------------------------ */

export const inputClass =
  "w-full rounded-lg border border-white/10 bg-charcoal-900 px-3 py-2 text-sm text-slate-300 placeholder:text-slate-500 transition focus:border-steel-500/50 focus:outline-none focus-visible:ring-2 focus-visible:ring-steel-400/70";

export const labelClass =
  "mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-400";

const addButtonClass =
  "mt-2 inline-flex items-center gap-1.5 rounded-md border border-steel-500/40 bg-steel-500/10 px-2.5 py-1.5 text-xs font-semibold text-steel-300 transition hover:border-steel-400 hover:bg-steel-500/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-steel-300";

/* ------------------------------------------------------------------ */
/* Inline SVG icons (no emoji in UI)                                   */
/* ------------------------------------------------------------------ */

interface IconProps {
  className?: string;
}

function iconAttrs(className?: string) {
  return {
    viewBox: "0 0 16 16",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.5,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
    className: className ?? "h-3.5 w-3.5",
  };
}

export function ArrowUpIcon({ className }: IconProps) {
  return (
    <svg {...iconAttrs(className)}>
      <path d="M8 13V3M4 7l4-4 4 4" />
    </svg>
  );
}

export function ArrowDownIcon({ className }: IconProps) {
  return (
    <svg {...iconAttrs(className)}>
      <path d="M8 3v10M4 9l4 4 4-4" />
    </svg>
  );
}

export function TrashIcon({ className }: IconProps) {
  return (
    <svg {...iconAttrs(className)}>
      <path d="M2.5 4.5h11M6.5 4.5V3a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 .5.5v1.5M4 4.5l.6 8.1a1 1 0 0 0 1 .9h4.8a1 1 0 0 0 1-.9l.6-8.1M6.5 7.5v3.5M9.5 7.5v3.5" />
    </svg>
  );
}

export function PlusIcon({ className }: IconProps) {
  return (
    <svg {...iconAttrs(className)}>
      <path d="M8 3v10M3 8h10" />
    </svg>
  );
}

export function ChevronRightIcon({ className }: IconProps) {
  return (
    <svg {...iconAttrs(className)}>
      <path d="M6 3.5 10.5 8 6 12.5" />
    </svg>
  );
}

export function DownloadIcon({ className }: IconProps) {
  return (
    <svg {...iconAttrs(className)}>
      <path d="M8 2.5v7.5M4.5 7 8 10.5 11.5 7M3 13.5h10" />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* IconButton                                                          */
/* ------------------------------------------------------------------ */

export function IconButton({
  label,
  onClick,
  disabled,
  children,
}: {
  label: string;
  onClick: (event: MouseEvent<HTMLButtonElement>) => void;
  disabled?: boolean;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={onClick}
      disabled={disabled}
      className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-md border border-white/10 bg-charcoal-800 text-slate-400 transition hover:border-steel-500/60 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-steel-400 disabled:pointer-events-none disabled:opacity-30"
    >
      {children}
    </button>
  );
}

/* ------------------------------------------------------------------ */
/* Scalar fields                                                       */
/* ------------------------------------------------------------------ */

export function TextField({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  autoComplete,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: "text" | "password" | "email" | "url" | "tel";
  autoComplete?: string;
}) {
  const id = useId();
  return (
    <div>
      <label htmlFor={id} className={labelClass}>
        {label}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        placeholder={placeholder}
        autoComplete={autoComplete}
        onChange={(e) => onChange(e.target.value)}
        className={inputClass}
      />
    </div>
  );
}

export function TextAreaField({
  label,
  value,
  onChange,
  rows = 3,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  rows?: number;
  placeholder?: string;
}) {
  const id = useId();
  return (
    <div>
      <label htmlFor={id} className={labelClass}>
        {label}
      </label>
      <textarea
        id={id}
        rows={rows}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className={`${inputClass} resize-y`}
      />
    </div>
  );
}

export function NumberField({
  label,
  value,
  onChange,
  min,
  max,
  step,
}: {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
}) {
  const id = useId();
  return (
    <div>
      <label htmlFor={id} className={labelClass}>
        {label}
      </label>
      <input
        id={id}
        type="number"
        value={Number.isFinite(value) ? value : 0}
        min={min}
        max={max}
        step={step}
        onChange={(e) => {
          const parsed = Number(e.target.value);
          onChange(Number.isNaN(parsed) ? 0 : parsed);
        }}
        className={inputClass}
      />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* List helpers                                                        */
/* ------------------------------------------------------------------ */

/** Immutably move an array item one position; returns the array unchanged if out of range. */
export function moveItem<T>(items: T[], from: number, to: number): T[] {
  if (to < 0 || to >= items.length || from === to) return items;
  const next = [...items];
  const removed = next.splice(from, 1);
  next.splice(to, 0, ...removed);
  return next;
}

/**
 * Editor for a plain string[] — inline edit, add, remove, move up/down.
 * Set `multiline` for paragraph-length strings (bio, highlights).
 */
export function StringListEditor({
  label,
  items,
  onChange,
  multiline = false,
  addLabel,
}: {
  label: string;
  items: string[];
  onChange: (items: string[]) => void;
  multiline?: boolean;
  addLabel?: string;
}) {
  const groupId = useId();
  const setAt = (index: number, value: string) =>
    onChange(items.map((item, i) => (i === index ? value : item)));
  const removeAt = (index: number) =>
    onChange(items.filter((_, i) => i !== index));
  const move = (index: number, direction: -1 | 1) =>
    onChange(moveItem(items, index, index + direction));

  return (
    <div role="group" aria-labelledby={`${groupId}-label`}>
      <p id={`${groupId}-label`} className={labelClass}>
        {label}
      </p>
      {items.length > 0 ? (
        <ul className="space-y-2">
          {items.map((item, i) => (
            <li key={i} className="flex items-start gap-2">
              {multiline ? (
                <textarea
                  rows={2}
                  value={item}
                  aria-label={`${label} — item ${i + 1}`}
                  onChange={(e) => setAt(i, e.target.value)}
                  className={`${inputClass} resize-y`}
                />
              ) : (
                <input
                  type="text"
                  value={item}
                  aria-label={`${label} — item ${i + 1}`}
                  onChange={(e) => setAt(i, e.target.value)}
                  className={inputClass}
                />
              )}
              <span className="flex gap-1 pt-1">
                <IconButton
                  label={`Move ${label} item ${i + 1} up`}
                  disabled={i === 0}
                  onClick={() => move(i, -1)}
                >
                  <ArrowUpIcon />
                </IconButton>
                <IconButton
                  label={`Move ${label} item ${i + 1} down`}
                  disabled={i === items.length - 1}
                  onClick={() => move(i, 1)}
                >
                  <ArrowDownIcon />
                </IconButton>
                <IconButton
                  label={`Remove ${label} item ${i + 1}`}
                  onClick={() => removeAt(i)}
                >
                  <TrashIcon />
                </IconButton>
              </span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="rounded-lg border border-dashed border-white/10 px-3 py-2 text-xs text-slate-500">
          No items yet.
        </p>
      )}
      <button
        type="button"
        onClick={() => onChange([...items, ""])}
        className={addButtonClass}
      >
        <PlusIcon className="h-3 w-3" />
        {addLabel ?? "Add item"}
      </button>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* ArrayEditor<T>                                                      */
/* ------------------------------------------------------------------ */

/**
 * Generic list wrapper for arrays of objects. Renders each item as a
 * collapsible card (native <details>/<summary> — keyboard operable for
 * free) with move up/down and remove controls, plus an "add" button that
 * appends a fresh item from `makeItem`. Item fields are rendered by the
 * caller through the render-prop `children(item, index, update)`.
 */
export function ArrayEditor<T>({
  label,
  items,
  onChange,
  makeItem,
  itemTitle,
  addLabel,
  children,
}: {
  label: string;
  items: T[];
  onChange: (items: T[]) => void;
  /** Template factory for newly added items. */
  makeItem: () => T;
  /** Title shown on the collapsed card. */
  itemTitle: (item: T, index: number) => string;
  addLabel?: string;
  children: (item: T, index: number, update: (next: T) => void) => ReactNode;
}) {
  const groupId = useId();
  const setAt = (index: number, next: T) =>
    onChange(items.map((item, i) => (i === index ? next : item)));
  const removeAt = (index: number) =>
    onChange(items.filter((_, i) => i !== index));
  const move = (index: number, direction: -1 | 1) =>
    onChange(moveItem(items, index, index + direction));

  // Stable per-item key: use the item's own id when it has one so an
  // expanded <details> stays with its item across move/remove (index keys
  // would leave the open state stuck to the list position instead).
  const seenKeys = new Set<string>();
  const keyFor = (item: T, index: number): string => {
    let key = `i-${index}`;
    if (typeof item === "object" && item !== null && "id" in item) {
      const id = (item as { id: unknown }).id;
      if (typeof id === "string" && id) key = id;
    }
    while (seenKeys.has(key)) key = `${key}~`;
    seenKeys.add(key);
    return key;
  };

  return (
    <div role="group" aria-labelledby={`${groupId}-label`}>
      <p id={`${groupId}-label`} className={labelClass}>
        {label}
      </p>
      {items.length > 0 ? (
        <div className="space-y-3">
          {items.map((item, i) => (
            // Controls overlay the summary row but live OUTSIDE <details>,
            // so no interactive elements are nested inside <summary>.
            <div key={keyFor(item, i)} className="relative">
              <details className="group rounded-lg border border-white/10 bg-charcoal-800/60">
                <summary className="flex cursor-pointer list-none items-center gap-2 rounded-lg py-2.5 pl-3 pr-28 focus:outline-none focus-visible:ring-2 focus-visible:ring-steel-400 [&::-webkit-details-marker]:hidden">
                  <ChevronRightIcon className="h-3.5 w-3.5 shrink-0 text-slate-500 transition-transform group-open:rotate-90" />
                  <span className="min-w-0 flex-1 truncate text-sm font-semibold text-slate-300">
                    {itemTitle(item, i) || `Item ${i + 1}`}
                  </span>
                </summary>
                <div className="space-y-4 border-t border-white/10 px-3 py-4 sm:px-4">
                  {children(item, i, (next) => setAt(i, next))}
                </div>
              </details>
              <span className="absolute right-3 top-2 flex gap-1">
                <IconButton
                  label={`Move ${label} item ${i + 1} up`}
                  disabled={i === 0}
                  onClick={() => move(i, -1)}
                >
                  <ArrowUpIcon />
                </IconButton>
                <IconButton
                  label={`Move ${label} item ${i + 1} down`}
                  disabled={i === items.length - 1}
                  onClick={() => move(i, 1)}
                >
                  <ArrowDownIcon />
                </IconButton>
                <IconButton
                  label={`Remove ${label} item ${i + 1}`}
                  onClick={() => removeAt(i)}
                >
                  <TrashIcon />
                </IconButton>
              </span>
            </div>
          ))}
        </div>
      ) : (
        <p className="rounded-lg border border-dashed border-white/10 px-3 py-2 text-xs text-slate-500">
          No items yet.
        </p>
      )}
      <button
        type="button"
        onClick={() => onChange([...items, makeItem()])}
        className={addButtonClass}
      >
        <PlusIcon className="h-3 w-3" />
        {addLabel ?? `Add ${label.toLowerCase()}`}
      </button>
    </div>
  );
}
