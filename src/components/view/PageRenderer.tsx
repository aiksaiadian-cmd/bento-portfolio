"use client";

import { usePageStore } from "@/store/pageStore";
import { useModeStore } from "@/store/modeStore";
import { BentoGrid } from "@/components/bento/BentoGrid";
import { NotionEditor } from "@/components/notion/NotionEditor";
import { NotionView } from "./NotionView";

export function PageRenderer() {
  const page = usePageStore((s) => s.getCurrentPage());
  const mode = useModeStore((s) => s.mode);

  if (!page) return null;

  return (
    <div>
      {/* Page title */}
      <div className="mb-6">
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={page.title}
            onChange={(e) =>
              usePageStore.getState().updatePage(page.id, {
                title: e.target.value,
              })
            }
            className={`text-2xl font-semibold bg-transparent border-none outline-none w-full ${
              mode === "view" ? "pointer-events-none" : ""
            }`}
            disabled={mode === "view"}
          />
        </div>
      </div>

      {/* Page content */}
      {page.type === "bento" ? (
        <BentoGrid />
      ) : page.type === "notion" ? (
        mode === "edit" ? <NotionEditor /> : <NotionView />
      ) : null}
    </div>
  );
}
