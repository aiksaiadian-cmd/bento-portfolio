"use client";

import { usePageStore } from "@/store/pageStore";
import type { NotionPageContent } from "@/types";

export function NotionView() {
  const page = usePageStore((s) => s.getCurrentPage());

  if (!page || page.type !== "notion") return null;

  const content = page.content as NotionPageContent;

  if (!content.html) {
    return (
      <div className="flex items-center justify-center h-32 text-zinc-300 text-sm">
        Empty page
      </div>
    );
  }

  return (
    <div
      className="notion-view prose prose-sm max-w-none"
      dangerouslySetInnerHTML={{ __html: content.html }}
    />
  );
}
