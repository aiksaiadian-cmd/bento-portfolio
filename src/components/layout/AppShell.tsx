"use client";

import { useEffect, useState } from "react";
import { usePageStore } from "@/store/pageStore";
import { useModeStore } from "@/store/modeStore";
import { Sidebar } from "./Sidebar";
import { ModeToggle } from "./ModeToggle";
import { PageRenderer } from "@/components/view/PageRenderer";

export function AppShell() {
  const init = usePageStore((s) => s.init);
  const currentPage = usePageStore((s) => s.getCurrentPage());
  const mode = useModeStore((s) => s.mode);
  const [saved, setSaved] = useState(true);

  useEffect(() => {
    init();
  }, [init]);

  useEffect(() => {
    const unsub = usePageStore.subscribe(() => setSaved(false));
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "s") {
        e.preventDefault();
        setSaved(true);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      unsub();
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-zinc-50">
      <Sidebar />
      <main className="flex-1 flex flex-col min-w-0">
        <header className="h-12 flex items-center justify-end gap-3 px-4 border-b border-zinc-100 shrink-0">
          <span
            className={`text-[10px] transition-opacity ${
              saved ? "opacity-0" : "opacity-100 text-zinc-400"
            }`}
          >
            Unsaved changes
          </span>
          <ModeToggle />
        </header>
        <div
          className={`flex-1 overflow-auto p-6 ${
            mode === "view" ? "view-mode" : ""
          }`}
        >
          <div className="max-w-5xl mx-auto">
            {currentPage ? (
              <PageRenderer />
            ) : (
              <div className="flex items-center justify-center h-64 text-zinc-400 text-sm">
                <p>
                  No pages.{" "}
                  <button
                    onClick={() => {
                      const store = usePageStore.getState();
                      store.createPage("New Page", "bento");
                    }}
                    className="text-indigo-500 hover:underline"
                  >
                    Create one
                  </button>
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
