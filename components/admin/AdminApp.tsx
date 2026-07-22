"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type FormEvent,
  type ReactNode,
} from "react";
import type { SiteContent } from "@/types/content";
import { DownloadIcon, TextField } from "@/components/admin/fields";
import {
  AboutEditor,
  ContactFooterEditor,
  CredentialsEditor,
  ExperienceEditor,
  HeroEditor,
  PersonalMetaNavEditor,
  ProjectsEditor,
  SkillsEditor,
} from "@/components/admin/sectionEditors";

/**
 * The hidden /admin content editor. Flow: on mount we check the session
 * (GET /api/admin/login) → show the login form or the editor.
 *
 * NOTE: this is basic single-password protection — entirely appropriate
 * for a personal portfolio site, not for anything multi-user.
 */

type Phase = "checking" | "login" | "editor";
type SaveState = "idle" | "saving" | "saved" | "error";

type TabId =
  | "personal"
  | "hero"
  | "about"
  | "experience"
  | "projects"
  | "skills"
  | "credentials"
  | "contact";

const TABS: ReadonlyArray<{ id: TabId; label: string }> = [
  { id: "personal", label: "Personal & Meta & Nav" },
  { id: "hero", label: "Hero" },
  { id: "about", label: "About" },
  { id: "experience", label: "Experience" },
  { id: "projects", label: "Projects" },
  { id: "skills", label: "Skills" },
  { id: "credentials", label: "Credentials" },
  { id: "contact", label: "Contact & Footer" },
];

async function readErrorMessage(res: Response, fallback: string) {
  const data = (await res.json().catch(() => null)) as { error?: string } | null;
  return data?.error ?? fallback;
}

/** Full-height dark wrapper with the faint blueprint grid behind everything. */
function Shell({ children }: { children: ReactNode }) {
  return (
    <div className="relative min-h-screen bg-charcoal-950">
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 bg-grid-faint bg-[length:36px_36px]"
      />
      <div className="relative">{children}</div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Login form                                                          */
/* ------------------------------------------------------------------ */

function LoginForm({
  onSuccess,
  extra,
}: {
  onSuccess: () => void;
  extra?: ReactNode;
}) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (res.ok) {
        onSuccess();
      } else {
        setError(await readErrorMessage(res, "Login failed"));
      }
    } catch {
      setError("Network error — please try again");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-6 py-24">
      <form onSubmit={handleSubmit} className="metal-card w-full max-w-sm p-8">
        <p className="section-eyebrow">
          <span aria-hidden className="h-px w-8 bg-ember-500" />
          Restricted
        </p>
        <h1 className="mt-3 font-display text-2xl font-bold text-white">
          Site Editor Login
        </h1>
        <p className="mt-2 text-sm text-slate-400">
          Enter the admin password to edit the site content.
        </p>
        <div className="mt-6">
          <TextField
            label="Password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={setPassword}
          />
        </div>
        <p role="alert" aria-live="assertive" className="mt-3 min-h-5 text-sm text-ember-400">
          {error}
        </p>
        <button type="submit" disabled={busy} className="btn-primary mt-4 w-full disabled:opacity-60">
          {busy ? "Checking…" : "Unlock Editor"}
        </button>
        {extra}
      </form>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Editor                                                              */
/* ------------------------------------------------------------------ */

function Editor({
  content,
  dirty,
  saveState,
  saveError,
  savedMessage,
  onChange,
  onSave,
  onExport,
  onLogout,
}: {
  content: SiteContent;
  dirty: boolean;
  saveState: SaveState;
  saveError: string | null;
  savedMessage: string | null;
  onChange: (next: SiteContent) => void;
  onSave: () => void;
  onExport: () => void;
  onLogout: () => void;
}) {
  const [tab, setTab] = useState<TabId>("personal");

  const statusText =
    saveState === "saving"
      ? "Saving…"
      : saveState === "saved"
        ? savedMessage ?? "Saved"
        : saveState === "error"
          ? saveError ?? "Save failed"
          : dirty
            ? "Unsaved changes"
            : "";

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-white/10 bg-charcoal-950/90 backdrop-blur">
        <div className="section-shell flex flex-wrap items-center gap-x-4 gap-y-2 py-3">
          <h1 className="font-display text-lg font-bold text-white">
            Site Editor<span className="text-ember-400">.</span>
          </h1>
          <p
            role="status"
            aria-live="polite"
            className={`min-w-0 flex-1 truncate text-xs font-semibold ${
              saveState === "error"
                ? "text-ember-400"
                : saveState === "saved"
                  ? "text-steel-300"
                  : "text-slate-400"
            }`}
          >
            {statusText}
          </p>
          <div className="flex items-center gap-2">
            <button type="button" onClick={onExport} className="btn-secondary px-3 py-1.5 text-xs">
              <DownloadIcon className="h-3.5 w-3.5" />
              Export JSON
            </button>
            <button type="button" onClick={onLogout} className="btn-secondary px-3 py-1.5 text-xs">
              Logout
            </button>
            <button
              type="button"
              onClick={onSave}
              disabled={saveState === "saving"}
              className="btn-primary px-4 py-1.5 text-xs disabled:opacity-60"
            >
              Save
            </button>
          </div>
        </div>
        <nav aria-label="Editor sections" className="section-shell flex gap-1 overflow-x-auto pb-3">
          {TABS.map((t) => {
            const active = t.id === tab;
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => setTab(t.id)}
                aria-current={active ? "true" : undefined}
                className={`whitespace-nowrap rounded-md border px-3 py-1.5 text-xs font-semibold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-steel-400 ${
                  active
                    ? "border-steel-400/60 bg-steel-500/20 text-white"
                    : "border-transparent text-slate-400 hover:bg-white/5 hover:text-white"
                }`}
              >
                {t.label}
              </button>
            );
          })}
        </nav>
      </header>

      <main className="section-shell py-10">
        {tab === "personal" && <PersonalMetaNavEditor content={content} onChange={onChange} />}
        {tab === "hero" && <HeroEditor content={content} onChange={onChange} />}
        {tab === "about" && <AboutEditor content={content} onChange={onChange} />}
        {tab === "experience" && <ExperienceEditor content={content} onChange={onChange} />}
        {tab === "projects" && <ProjectsEditor content={content} onChange={onChange} />}
        {tab === "skills" && <SkillsEditor content={content} onChange={onChange} />}
        {tab === "credentials" && <CredentialsEditor content={content} onChange={onChange} />}
        {tab === "contact" && <ContactFooterEditor content={content} onChange={onChange} />}
      </main>
    </>
  );
}

/* ------------------------------------------------------------------ */
/* App shell / state machine                                           */
/* ------------------------------------------------------------------ */

export default function AdminApp() {
  const [phase, setPhase] = useState<Phase>("checking");
  const [content, setContent] = useState<SiteContent | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [dirty, setDirty] = useState(false);
  const [saveState, setSaveState] = useState<SaveState>("idle");
  const [saveError, setSaveError] = useState<string | null>(null);
  const [savedMessage, setSavedMessage] = useState<string | null>(null);
  // Session expired mid-edit: show a re-login overlay WITHOUT unmounting the
  // editor, so unsaved changes survive and can still be exported.
  const [reauth, setReauth] = useState(false);
  const savingRef = useRef(false);

  const loadContent = useCallback(async () => {
    setLoadError(null);
    try {
      const res = await fetch("/api/admin/content");
      if (res.status === 401) {
        setPhase("login");
        return;
      }
      if (!res.ok) {
        setLoadError(await readErrorMessage(res, "Could not load the site content"));
        setPhase("editor");
        return;
      }
      const data = (await res.json()) as SiteContent;
      setContent(data);
      setDirty(false);
      setSaveState("idle");
      setPhase("editor");
    } catch {
      setLoadError("Network error while loading the site content");
      setPhase("editor");
    }
  }, []);

  // Initial session check: already authed → straight into the editor.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/admin/login");
        const data = (await res.json().catch(() => null)) as { authed?: boolean } | null;
        if (cancelled) return;
        if (data?.authed) {
          void loadContent();
        } else {
          setPhase("login");
        }
      } catch {
        if (!cancelled) setPhase("login");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [loadContent]);

  // Warn before leaving the page with unsaved changes.
  useEffect(() => {
    if (!dirty) return;
    const handler = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [dirty]);

  const handleChange = useCallback((next: SiteContent) => {
    setContent(next);
    setDirty(true);
    setSaveState("idle");
    setSaveError(null);
  }, []);

  const handleSave = useCallback(async () => {
    // savingRef also guards Ctrl+S (the button is disabled while saving, but
    // the shortcut isn't) so overlapping POSTs can't race each other.
    if (!content || savingRef.current) return;
    savingRef.current = true;
    setSaveState("saving");
    setSaveError(null);
    try {
      const res = await fetch("/api/admin/content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(content),
      });
      if (res.ok) {
        const data = (await res.json().catch(() => null)) as {
          message?: string;
        } | null;
        setSavedMessage(data?.message ?? null);
        setDirty(false);
        setSaveState("saved");
      } else if (res.status === 401) {
        setSaveError(
          "Session expired — log in again; your unsaved changes are preserved"
        );
        setSaveState("error");
        setReauth(true);
      } else {
        setSaveError(await readErrorMessage(res, `Save failed (${res.status})`));
        setSaveState("error");
      }
    } catch {
      setSaveError("Network error while saving");
      setSaveState("error");
    } finally {
      savingRef.current = false;
    }
  }, [content]);

  // Ctrl/Cmd+S saves instead of opening the browser save dialog.
  useEffect(() => {
    if (phase !== "editor") return;
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "s") {
        e.preventDefault();
        if (!e.repeat) void handleSave();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [phase, handleSave]);

  const handleExport = useCallback(() => {
    if (!content) return;
    const blob = new Blob([`${JSON.stringify(content, null, 2)}\n`], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "site-content.json";
    anchor.click();
    URL.revokeObjectURL(url);
  }, [content]);

  const handleLogout = useCallback(async () => {
    if (dirty && !window.confirm("You have unsaved changes. Log out anyway?")) {
      return;
    }
    await fetch("/api/admin/login", { method: "DELETE" }).catch(() => undefined);
    setContent(null);
    setDirty(false);
    setSaveState("idle");
    setSaveError(null);
    setPhase("login");
  }, [dirty]);

  return (
    <Shell>
      {phase === "checking" && (
        <div className="flex min-h-screen items-center justify-center">
          <p className="animate-pulse-soft text-sm text-slate-400" role="status">
            Checking session&hellip;
          </p>
        </div>
      )}

      {phase === "login" && <LoginForm onSuccess={() => void loadContent()} />}

      {phase === "editor" && !content && (
        <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-6">
          {loadError ? (
            <>
              <p className="text-sm text-ember-400" role="alert">
                {loadError}
              </p>
              <button type="button" onClick={() => void loadContent()} className="btn-secondary px-4 py-2 text-sm">
                Retry
              </button>
            </>
          ) : (
            <p className="animate-pulse-soft text-sm text-slate-400" role="status">
              Loading content&hellip;
            </p>
          )}
        </div>
      )}

      {phase === "editor" && content && (
        <Editor
          content={content}
          dirty={dirty}
          saveState={saveState}
          saveError={saveError}
          savedMessage={savedMessage}
          onChange={handleChange}
          onSave={() => void handleSave()}
          onExport={handleExport}
          onLogout={() => void handleLogout()}
        />
      )}

      {/* Re-login overlay after mid-edit session expiry — editor (and its
          unsaved state) stays mounted underneath. */}
      {phase === "editor" && content && reauth && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-charcoal-950/95 backdrop-blur-sm">
          <LoginForm
            onSuccess={() => setReauth(false)}
            extra={
              <div className="mt-6 border-t border-white/10 pt-4">
                <p className="text-xs text-slate-400">
                  Your unsaved changes are still in the editor. You can also
                  download them now as a backup:
                </p>
                <button
                  type="button"
                  onClick={handleExport}
                  className="btn-secondary mt-3 w-full px-3 py-2 text-xs"
                >
                  <DownloadIcon className="h-3.5 w-3.5" />
                  Export JSON
                </button>
              </div>
            }
          />
        </div>
      )}
    </Shell>
  );
}
