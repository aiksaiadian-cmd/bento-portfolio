"use client";

import { useEffect } from "react";
import { useModeStore } from "@/store/modeStore";

export function ModeToggle() {
  const mode = useModeStore((s) => s.mode);
  const toggleMode = useModeStore((s) => s.toggleMode);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "e") {
        e.preventDefault();
        toggleMode();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [toggleMode]);

  return (
    <button
      data-testid="mode-toggle"
      onClick={toggleMode}
      className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
        mode === "edit"
          ? "bg-indigo-50 text-indigo-700 hover:bg-indigo-100"
          : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
      }`}
      title={`Switch to ${mode === "edit" ? "view" : "edit"} mode (Cmd+E)`}
    >
      {mode === "edit" ? (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
          <path d="M11 1.5l3.5 3.5L5.5 14H2v-3.5L11 1.5z" />
        </svg>
      ) : (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
          <path d="M1 8s2.5-5 7-5 7 5 7 5-2.5 5-7 5-7-5-7-5z" />
          <circle cx="8" cy="8" r="2" />
        </svg>
      )}
      <span>{mode === "edit" ? "Edit" : "View"}</span>
      <kbd className="text-[10px] text-zinc-400 ml-1 border border-zinc-200 rounded px-1 py-0.5 leading-none">
        ⌘E
      </kbd>
    </button>
  );
}
